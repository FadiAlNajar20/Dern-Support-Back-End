/**
 1- Create a controller Ex: (customerController)
 2- in customerController --> import { client } from "../server.js";
 3- Create functions that calls the database and retrieves data (Logic for customer)
    ex:

    export const getAllMovies = async (req, res) => {
        const sql = `SELECT * FROM movies;`;
        try {
            console.log("Executing query...");
            const result = await client.query(sql);
            console.log("Query result:", result.rows);
            res.json(result.rows);
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).json({ error: "Failed to fetch movies" });
        }
};

.....
4- go to customerRoutes: 
  import express from "express";
  import { getAllMovies, addNewMovie } from "../controllers/customerController.js";

  const router = express.Router();

  router.route("/getAllMovies").get(getAllMovies);
  router.route("/addNewMovie").post(addNewMovie);

  export default router;


5- go to server.js and import customerRoutes:
    import customerRoutes from "./routes/customerRoutes.js";
    after app.use(express.json());
    app.use("/customers", customerRoutes);

    so if I want to test this route:
    http://localhost:5000/customers/getAllMovies

 */

