"use strict";

import express from "express";
import cors from "cors";
import axios from "axios"; 
import dotenv from "dotenv"; 
import pg from "pg"; 
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import techRoutes from "./routes/technicianRoutes.js";

dotenv.config();

const pgUrl = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

//Client configuration
const { Client } = pg;
const client = new Client(pgUrl);


const app = express();


app.use(cors());
app.use(express.json());

//ROUTES:
app.use("/admin", adminRoutes);
app.use("/customers", customerRoutes);
app.use("/technician", techRoutes);

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

export { client };