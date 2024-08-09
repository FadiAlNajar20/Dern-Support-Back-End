"use strict";

const express = require("express");
const cors = require("cors");
const axios = require("axios").default;
require("dotenv").config();

//const movieData = require("./Movie Data/data.json");

const apiKey = process.env.API_KEY;
const pgUrl = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

//for quiery in js file using pg package
const { Client } = require("pg");
const client = new Client(pgUrl);

const app = express();

//server open for all clients requests
/*The "cors" package is commonly used in web development to enable Cross-Origin Resource Sharing (CORS). 
CORS is a mechanism that allows resources (e.g., fonts, scripts, or APIs) on a web page to be requested 
from another domain outside the domain from which the resource originated. 
It is a security feature implemented by web browsers to protect users from potential cross-site scripting (XSS) attacks.*/
app.use(cors());
//for parsing body
app.use(express.json());


//listener
client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening ${PORT}`);
    });
  })
  .catch();


// NOTE: IMPORTANT IN THE .env file: put This code 
/*
PORT=3004
DATABASE_URL=postgresql://localhost:5432/YourDatabaseName
*/