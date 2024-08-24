import express from 'express';
import { client } from "../server.js";

const getTechnicians = async (req, res) => {
    const sql = `
            SELECT * FROM Technician;
        `;
    try {
      const result = await client.query(sql);
      return res.json(result.rows);
    //   else res.json({ error: "No reslut found" });
    } catch (err) {
      console.error("Get technicians error:", err);
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  };

  const getRequests = async (req, res) => {
    const sql = `
            SELECT * FROM Request;
        `;
    try {
      const result = await client.query(sql);
      return res.json(result.rows);
    //   else res.json({ error: "No reslut found" });
    } catch (err) {
      console.error("Get requests error:", err);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  };

  export const getAssignedRequests = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await client.query(
            `SELECT * FROM Request WHERE technicianid = $1;`
            , [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get assigned request error:", err);
        res.status(500).json({ error: "Failed to get assigned request" });
    }
  
};

  const router = express.Router();
  router.get('/getTechnicians',getTechnicians);
  router.get('/getRequests',getRequests);
  router.get('/getAssignedRequests/:id',getAssignedRequests)

  export default router;