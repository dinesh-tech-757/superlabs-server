import express from "express";
import client from "../config/connectdatabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

// Default values
const DEFAULT_USER = {
    username: "admin@admin",
    email: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS
};

// Function to create default user if not exists
const createDefaultUser = async () => {
    try {
        const { rows: existingUser } = await client.query("SELECT * FROM users WHERE email = $1", [DEFAULT_USER.email]);
        if (existingUser.length === 0) {
            const hashPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
            await client.query(
                "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
                [DEFAULT_USER.username, DEFAULT_USER.email, hashPassword]
            );
            console.log("Default user created successfully");
        }
    } catch (error) {
        console.error("Error creating default user:", error.message);
    }
};
createDefaultUser();

// Register Route
router.post("/register", async (req, res) => {
    let { username, email, password } = req.body;

    // Apply defaults if fields are empty
    username = username || DEFAULT_USER.username;
    email = email || DEFAULT_USER.email;
    password = password || DEFAULT_USER.password;

    try {
        // Check if user already exists
        const { rows: existingUser } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const { rows: newUser } = await client.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashPassword]
        );

        res.status(201).json({ message: "User created successfully", user: newUser[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    // Apply defaults if fields are empty
    email = email || DEFAULT_USER.email;
    password = password || DEFAULT_USER.password;

    try {
        // Fetch user from database
        const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: "3h" });

        return res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to Verify Token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Protected Route (Requires Authentication)
router.get('/home', verifyToken, async (req, res) => {
    try {
        const { rows } = await client.query("SELECT * FROM users WHERE id = $1", [req.userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }
        return res.status(200).json({ user: rows[0] });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if user exists
        const { rows: user } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

        // Save token and expiry to user record
        await client.query(
            "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
            [resetToken, resetTokenExpiry, email]
        );

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   http://${req.headers.host}/reset-password/${resetToken}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Error in forgot-password route:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        // Find user by reset token and check if token is still valid
        const { rows: user } = await client.query(
            "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2",
            [token, Date.now()]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash new password
        const hashPassword = await bcrypt.hash(password, 10);

        // Update user's password and remove reset token
        await client.query(
            "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
            [hashPassword, user[0].id]
        );

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;