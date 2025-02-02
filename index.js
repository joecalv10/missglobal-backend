import dotenv from 'dotenv';
dotenv.config();  // Only call this once
import express from 'express';
import connectDB from './config/db.js';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Check if MONGO_URI is correctly loaded
console.log("MONGO_URI from environment:", process.env.MONGO_URI);

connectDB();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use("/images", express.static("uploads"));

fs.readdirSync("./routes").map(async (route) => {
  const { router } = await import(`./routes/${route}`);
  app.use(`/api/${route.replace(".js", "")}`, router);
});

app.listen(process.env.PORT, () =>
  console.log(`Server Running on port ${process.env.PORT}`)
);
