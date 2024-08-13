// src/controllers/adminController.js
import jwt from 'jsonwebtoken';
import { client } from "../server.js";
import bcrypt from "bcrypt";

//=============================/admin/login========================================
// /admin/login
//Tested
export const login = async (req, res) => {
    const { Email, Password } = req.body;

    const sql = `SELECT "User".id, "User".email, "User".password
    FROM "User"
    JOIN Admin ON "User".id = Admin.userid
    WHERE "User".email = $1;`;

    try {
        const result = await client.query(sql, [Email]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Admin not found' });

        const admin = result.rows[0];
        console.log(admin, "");
        const passwordIsValid = bcrypt.compare(Password, admin.password);
        if (!passwordIsValid) return res.status(401).json({ token: null, message: 'Invalid password' });

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Failed to login" });
    }
};

//=============================/admin/logout========================================
// /admin/logout
//Tested
export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

//=============================/admin/support-requests/update========================================
// /admin/support-requests/update
//Tested
export const updateSupportRequest = async (req, res) => {
    const { id, status } = req.body;
    const sql = `UPDATE request SET status = $1 WHERE id = $2 RETURNING *;`;
    const values = [status, id];

    try {

        const result = await client.query(sql, values);
        console.log("  Result", result)
        if (result.rowCount > 0)
            res.json({ message: 'Support request updated', request: result.rows[0] });
        else
            res.json({ message: 'Something went wrong' });
    } catch (err) {
        console.error("Update support request error:", err);
        res.status(500).json({ error: "Failed to update request" });
    }
};

//=============================/admin/support-requests/getAll========================================
// /admin/support-requests/getAll
//Tested
export const getAllRequests = async (req, res) => {

    const id = req.userId;
    console.log(id, " ");

    const sql = `SELECT * FROM Request;`;


    try {
        const result = await client.query(sql);
        res.json(result.rows);
    } catch (err) {
        console.error("Get all requests error:", err);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

//=============================/admin/feedback/getAll========================================
// /admin/feedback/getAll
//Tested
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

//=============================/admin/articles/add========================================
// /admin/articles/add
//Tested
export const addArticle = async (req, res) => {
    const { title, content, publishedDate } = req.body;
    const sql = `INSERT INTO Article (Title, content, publishedDate) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [title, content, publishedDate];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Article added', articleId: result.rows[0].id });
    } catch (err) {
        console.error("Add article error:", err);
        res.status(500).json({ error: "Failed to add article" });
    }
};

//=============================/admin/articles/update========================================
// /admin/articles/update
//Tested
export const updateArticle = async (req, res) => {
    const { id, title, content } = req.body;
    const sql = `UPDATE Article SET title = $1, content = $2 WHERE id = $3 RETURNING *;`;
    const values = [title, content, id];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Article updated', article: result.rows[0] });
    } catch (err) {
        console.error("Update article error:", err);
        res.status(500).json({ error: "Failed to update article" });
    }
};

//=============================/admin/articles/delete/:id========================================
// /admin/articles/delete/:id
//Tested
export const deleteArticle = async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Article WHERE id = $1 RETURNING *;`;

    try {
        const result = await client.query(sql, [id]);
        if (result.rowCount > 0)
            res.status(404).json({ message: 'Article deleted' });
        else
            res.json({ message: 'Article Not found', article: result.rows[0] });
    } catch (err) {
        console.error("Delete article error:", err);
        res.status(500).json({ error: "Failed to delete article" });
    }
};

//=============================/admin/spares/getAll========================================
// /admin/spares/getAll
//Tested
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

//=============================/admin/spares/:id/reorder========================================
// /admin/spares/:id/reorder
//Tested
export const reorderSpares = async (req, res) => {
    const { id, quantity } = req.body;
    const sql = `UPDATE Spares SET Quantity = Quantity + $1 WHERE id = $2 RETURNING *;`;
    const values = [quantity, id];

    try {
        const result = await client.query(sql, values);
        res.json({ message: 'Spares reordered', spare: result.rows[0] });
    } catch (err) {
        console.error("Reorder spares error:", err);
        res.status(500).json({ error: "Failed to reorder spares" });
    }
};

//=============================/admin/services/add========================================
// /admin/services/add
//Tested
export const addService = async (req, res) => {
    const { Description, Cost, MaintenanceTime, IsCommon } = req.body;
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

//=============================/admin/technicians/createAccount========================================
// /admin/technicians/createAccount
//Tested
export const createTechnicianAccount = async (req, res) => {
    const { Name, Email, Password, PhoneNumber, Specialization } = req.body;
    const hashedPassword = bcrypt.hashSync(Password, 10);
    const sqlInsertUser = `INSERT INTO "User" (Name, Email, Password, PhoneNumber) VALUES ($1, $2, $3, $4) RETURNING id;`;
    const values = [Name, Email, hashedPassword, PhoneNumber];

    try {
        const result = await client.query(sqlInsertUser, values);

        const userId = result.rows[0].id;

        if (userId != null) {
            const sqlInsertTechnician = `INSERT INTO technician (userid, specialization) VALUES ($1, $2) RETURNING id;`;
            const resultAddToTechnician = await client.query(sqlInsertTechnician, [userId, Specialization]);

            if (resultAddToTechnician.rowCount > 0) {
                res.json({ message: 'Technician account created', technicianId: resultAddToTechnician.rows[0].id });
            } else {
                res.status(500).json({ message: 'Something went wrong with the Technician table' });
            }
        } else {
            res.status(500).json({ message: 'Something went wrong with the User table' });
        }
    } catch (err) {
        console.error("Create technician account error:", err);
        res.status(500).json({ error: "Failed to create technician account" });
    }
};


