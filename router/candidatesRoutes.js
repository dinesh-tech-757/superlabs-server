import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import client from "../config/connectdatabase.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET Single Data
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      "SELECT * FROM candidates WHERE id = $1",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).send("Candidate not found");
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
  }
});

// POST: Add a candidate
router.post(
  "/",
  upload.fields([{ name: "resume" }, { name: "cover" }]),
  async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        linkedin,
        website,
        job_title,
      } = req.body;

      const resume = req.files["resume"][0].filename;
      const cover = req.files["cover"][0].filename;

      const result = await client.query(
        "INSERT INTO candidates (first_name, last_name, email, phone, linkedin, website, resume, cover,  job_title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          first_name,
          last_name,
          email,
          phone,
          linkedin,
          website,
          resume,
          cover,
          job_title,
        ]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  }
);

// GET: Fetch all candidates
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM candidates");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// DELETE: Remove a candidate
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query(
      "DELETE FROM candidates WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Candidate not found");
    }

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// UPDATE: Update candidate information
router.put(
  "/:id",
  upload.fields([{ name: "resume" }, { name: "cover" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        first_name,
        last_name,
        email,
        phone,
        linkedin,
        website,
        job_title,
      } = req.body;

      const existingCandidate = await client.query(
        "SELECT * FROM candidates WHERE id = $1",
        [id]
      );

      if (existingCandidate.rows.length === 0) {
        return res.status(404).send("Candidate not found");
      }

      const resume = req.files["resume"]
        ? req.files["resume"][0].filename
        : existingCandidate.rows[0].resume;
      const cover = req.files["cover"]
        ? req.files["cover"][0].filename
        : existingCandidate.rows[0].cover;

      const result = await client.query(
        "UPDATE candidates SET first_name=$1, last_name=$2, email=$3, phone=$4, linkedin=$5, website=$6, resume=$7, cover=$8, job_title=$9 WHERE id=$10 RETURNING *",
        [
          first_name,
          last_name,
          email,
          phone,
          linkedin,
          website,
          resume,
          cover,
          job_title,
          id,
        ]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

export default router;