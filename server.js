"use strict";

import express from "express";
import cors from "cors";
import axios from "axios"; // Axios with default import
import dotenv from "dotenv"; // Import dotenv to configure environment variables
import pg from "pg"; // Import the entire module as the default export

// Configure dotenv to load environment variables from .env file
dotenv.config();

const apiKey = process.env.API_KEY;
const pgUrl = process.env.DATABASE_URL;
const PORT = process.env.PORT || 5000;

//Client configuration
const { Client } = pg;
const client = new Client(pgUrl);

//test pgurl
// const client = new Client({
//   host: 'dpg-cqrt82t6l47c739uk0rg-a.oregon-postgres.render.com',
//   user: 'dernsupportdb_user',
//   password: 'UiLNO8SkjYizDsmmPsQki6OQHGBZPNfT',
//   database: 'dernsupportdb',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false, // Set this to true if you have a valid SSL certificate
//   },
// });
const app = express();


app.use(cors());
//for parsing body
app.use(express.json());

//test database connection

async function insertTestData() {
  try {
    //await client.connect();

    // Insert into User table
    await client.query(`
      INSERT INTO "User" (Name, Email, Password, PhoneNumber)
      VALUES ('John Doe', 'maha.salem@example.com', 'password123', '1234567890');
    `);

 

    console.log('Test data inserted successfully.');
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    await client.end();
  }
}

//insertTestData();

app.delete('/clear-user-table', async (req, res) => {
  try {
    //await client.connect();
    await client.query('DELETE FROM "User"');
    res.status(200).json({
      message: 'All data from the User table has been successfully deleted.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting data from the User table',
      error: error.message,
    });
  } finally {
    await client.end();
  }
});

async function testQueries() {
  try {
    //await client.connect();

    // Retrieve data from User table
    const users = await client.query('SELECT * FROM "User";');
    console.log('Users:', users.rows);
    console.log("query is succeed")

    // Retrieve data from Customer table
    const customers = await client.query('SELECT * FROM Customer;');
    console.log('Customers:', customers.rows);

  } catch (error) {
    console.error('Error executing queries:', error);
  } finally {
    await client.end();
  }
}

testQueries();





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