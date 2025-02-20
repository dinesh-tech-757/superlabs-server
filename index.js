import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import cors from "cors";
import router from "./router/router.js";
import bodyParser from "body-parser";
import authRouter from "./router/authRoutes.js";
import client from "./config/connectdatabase.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);

app.use("/api/v1", router);

client.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});