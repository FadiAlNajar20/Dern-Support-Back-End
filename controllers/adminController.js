// src/controllers/adminController.js
import jwt from 'jsonwebtoken';
import { client } from "../server.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const { Email, Password } = req.body;

    const sql = `SELECT * FROM admins WHERE email = $1;`;
    try {
        const result = await client.query(sql, [Email]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Admin not found' });

        const admin = result.rows[0];
        const passwordIsValid = bcrypt.compareSync(Password, admin.password);
        if (!passwordIsValid) return res.status(401).json({ token: null, message: 'Invalid password' });

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Failed to login" });
    }
};

export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

export const updateSupportRequest = async (req, res) => {
    const { id, Status } = req.body;
    const sql = `UPDATE Request SET status = $1 WHERE id = $2 RETURNING *;`;
    const values = [Status, id];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Support request updated', request: result.rows[0] });
    } catch (err) {
        console.error("Update support request error:", err);
        res.status(500).json({ error: "Failed to update request" });
    }
};

export const getAllRequests = async (req, res) => {
    const sql = `SELECT * FROM Request;`;

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all requests error:", err);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

export const getAllFeedback = async (req, res) => {
    const sql = `SELECT * FROM Feedback;`;

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all feedback error:", err);
        res.status(500).json({ error: "Failed to fetch feedback" });
    }
};

export const addArticle = async (req, res) => {
    const { Title, Image, Content, CreatedDate } = req.body;
    const sql = `INSERT INTO Article (Title, Image, Description, CreatedDate) VALUES ($1, $2, $3, $4) RETURNING id;`;
    const values = [Title, Image, Content, CreatedDate];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Article added', articleId: result.rows[0].id });
    } catch (err) {
        console.error("Add article error:", err);
        res.status(500).json({ error: "Failed to add article" });
    }
};

export const updateArticle = async (req, res) => {
    const { id, Title, Image, Content } = req.body;
    const sql = `UPDATE Article SET title = $1, Image = $2 Description = $3 WHERE id = $4 RETURNING *;`;
    const values = [Title, Image, Content, id];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Article updated', article: result.rows[0] });
    } catch (err) {
        console.error("Update article error:", err);
        res.status(500).json({ error: "Failed to update article" });
    }
};

export const deleteArticle = async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Article WHERE id = $1 RETURNING *;`;

    try {
        const result = await client.query(sql, [id]);
        res.json({ message: 'Article deleted', article: result.rows[0] });
    } catch (err) {
        console.error("Delete article error:", err);
        res.status(500).json({ error: "Failed to delete article" });
    }
};

export const getAllSpares = async (req, res) => {
    const sql = `SELECT * FROM Spares;`;

    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("View spares error:", err);
        res.status(500).json({ error: "Failed to fetch spares" });
    }
};

export const reorderSpares = async (req, res) => {
    const { SpareID, Quantity } = req.body;
    const sql = `UPDATE Spares SET Quantity = Quantity + $1 WHERE id = $2 RETURNING *;`;
    const values = [Quantity, SpareID];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Spares reordered', spare: result.rows[0] });
    } catch (err) {
        console.error("Reorder spares error:", err);
        res.status(500).json({ error: "Failed to reorder spares" });
    }
};

// this will be edited (I made some changes just to test it)
export const addService = async (req, res) => {
    const { Name, Description, Cost, MaintenanceTime, IsCommon } = req.body;
    const sql = `INSERT INTO Service (Description, Cost, MaintenanceTime, IsCommon) VALUES ($1, $2, $3, $4) RETURNING id;`;
    const values = [Description, Cost, MaintenanceTime, IsCommon];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Service added', serviceId: result.rows[0].id });
    } catch (err) {
        console.error("Add service error:", err);
        res.status(500).json({ error: "Failed to add service" });
    }
};

export const createTechnicianAccount = async (req, res) => {
    const { Name, Email, Password, PhoneNo, Specialization } = req.body;
    const hashedPassword = bcrypt.hashSync(Password, 10);
    const sql = `INSERT INTO technicians (Name, Email, Password, PhoneNumber, Specialization) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const values = [Name, Email, hashedPassword, PhoneNo, Specialization];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Technician account created', technicianId: result.rows[0].id });
    } catch (err) {
        console.error("Create technician account error:", err);
        res.status(500).json({ error: "Failed to create technician account" });
    }
};




