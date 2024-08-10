"use strict";

import express from "express";
import cors from "cors";
import axios from "axios"; // Axios with default import
import dotenv from "dotenv"; // Import dotenv to configure environment variables
import pg from "pg"; // Import the entire module as the default export

import customerRoutes from "./routes/customerRoutes.js";
// Configure dotenv to load environment variables from .env file
dotenv.config();

const apiKey = process.env.API_KEY;
const pgUrl = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

//Client configuration
const { Client } = pg;
const client = new Client(pgUrl);
const app = express();

app.use(cors());
//for parsing body
app.use(express.json());

//ROUTES:
app.use("/customers", customerRoutes);


//listener
client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });


// NOTE: IMPORTANT IN THE .env file: put This code 
/*
PORT=3004
DATABASE_URL=postgresql://localhost:5432/YourDatabaseName
*/

export { client };