import express from "express";
import dotenv from "dotenv"
import connectDatabase from "./config/database";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

connectDatabase();

app.get("/", (req, res) => {
  res.send("Welcome to the Vendor Recommendation System");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});