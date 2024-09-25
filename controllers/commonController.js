import { client } from "../server.js";

export const getServicesById = async (req, res) => {
  const { id } = req.params;
  const sql = `
          SELECT * FROM service WHERE ID=$1;
      `;

  try {
    const result = await client.query(sql, [id]);
    if (result.rowCount > 0) res.json(result.rows);
    else res.json({ error: "No reslut found" });
  } catch (err) {
    console.error("Get service by Id error:", err);
    res.status(500).json({ error: "Failed to fetch service by Id " });
  }
};

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

// /common/articles/getArticlesById
export const getArticlesById = async (req, res) => {
  const {id} = req.params
  const sql = `SELECT * FROM Article where id=${id};`;
  try {
    const result = await client.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Get all articles error:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};