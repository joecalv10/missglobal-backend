import dotenv from 'dotenv';
dotenv.config();  // Only call this once
console.log("JWT_SECRET: ", process.env.JWT_SECRET); 
console.log("REFRESH_TOKEN_SECRET: ", process.env.REFRESH_TOKEN_SECRET);
import express from 'express';
import connectDB from './config/db.js';
import fs from 'fs';
import cors from 'cors';

const app = express();

// Check if MONGO_URI is correctly loaded
console.log("MONGO_URI from environment:", process.env.MONGO_URI);

connectDB();

// Update CORS to allow multiple URLs
const allowedOrigins = [
  "https://missglobal-frontend.vercel.app", // Original frontend URL
  "https://missglobal-frontend-git-main-joe-calvins-projects.vercel.app" // New frontend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);  // Allow the origin
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,  // Allow credentials if needed (cookies, authorization headers)
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use("/images", express.static("uploads"));

fs.readdirSync("./routes").map(async (route) => {
  const { router } = await import(`./routes/${route}`);
  app.use(`/api/${route.replace(".js", "")}`, router);
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Server Running on port ${process.env.PORT || 8080}`)
);
