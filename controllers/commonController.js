import { client } from "../server.js";

//=============================/common/services/getAll========================================
// /common/services/getAll 
//Tested
export const getAllServices = async (req, res) => {
    const sql = `SELECT * FROM Service;`;

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all services error:", err);
        res.status(500).json({ error: "Failed to fetch services" });
    }
};

//=============================/common/articles/getAll========================================
// /common/articles/getAll 
//Tested
export const getAllArticles = async (req, res) => {

    const sql = `SELECT * FROM Article;`;

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all articles error:", err);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
};
