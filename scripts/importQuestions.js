import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const results = [];

fs.createReadStream("questions.csv")
  .pipe(csv())
  .on("data", (row) => {
    results.push({
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      answerIndex: Number(row.answerIndex)
    });
  })
  .on("end", async () => {
    await Question.insertMany(results);
    console.log("IMPORT DONE");
    process.exit();
  });
