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
export const updateSupportRequestStatus = async (req, res) => {
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

//=============================/admin/support-requests-timeAndCost/update========================================
// /admin/support-requests-timeAndCost/update
//Tested
export const updateSupportRequestTimeAndCost = async (req, res) => {
    const { id, maintenanceTime, actualcost } = req.body;
    const sql = `UPDATE newrequest SET maintenanceTime = $1, actualcost = $2  WHERE id = $3 RETURNING *;`;
    const values = [maintenanceTime, actualcost, id];

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

//=============================/admin/support-requests/requestsPerDay========================================
// /admin/support-requests/requestsPerDay
//Tested
export const getRequestsPerDay = async (req, res) => {

    const sql = `
        SELECT 
            TO_CHAR(createddate, 'YYYY-MM-DD') AS date, 
            COUNT(*) AS count 
        FROM Request 
        GROUP BY TO_CHAR(createddate, 'YYYY-MM-DD') 
        ORDER BY date;
    `;

    try {
        const result = await client.query(sql);
        if(result.rowCount > 0)
        res.json(result.rows);
        else
        res.json({ error: "No resluts found" });

    } catch (err) {
        console.error("Error fetching requests per day:", err);
        res.status(500).json({ error: "Failed to fetch requests per day" });
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

//=============================/admin/feedback/relatedToService/:id==========================
// /admin/feedback/relatedToService/:id
//Tested
export const getAllFeedbackRelatedToService = async (req, res) => {
    const serviceId = req.params.id;
    const sql = `SELECT * FROM Feedback WHERE serviceid = $1;`;

    try {
        const result = await client.query(sql, [serviceId]);
        if(rowCount > 0)
        res.json(result.rows);
    else
      res.status(404).json({ error: "No feedbacks on this services, or service not found" });

    } catch (err) {
        console.error("Get all feedback related to service error:", err);
        res.status(500).json({ error: "Failed to fetch feedback related to this service" });
    }
};


//=============================/admin/feedback/relatedToService/avg/:id==========================
// /admin/feedback/relatedToService/avg/:id
//Tested
export const getAVGForAllFeedbackRelatedToService = async (req, res) => {
    const serviceId = req.params.id;
    
    const sql = `
        SELECT AVG(rating) AS average_rating, COUNT(*) AS total_feedbacks 
        FROM Feedback 
        WHERE serviceid = $1;
    `;

    try {
        const result = await client.query(sql, [serviceId]);
        const { average_rating, total_feedbacks } = result.rows[0];

        if (total_feedbacks > 0) {
            res.json({ 
                averageRating: average_rating, 
                totalFeedbacks: total_feedbacks 
            });
        } else {
            res.status(404).json({ error: "No feedbacks for this service, or service not found" });
        }

    } catch (err) {
        console.error("Get all feedback related to service error:", err);
        res.status(500).json({ error: "Failed to fetch feedback related to this service" });
    }
};


//=============================/admin/articles/add========================================
// /admin/articles/add
//Tested
export const addArticle = async (req, res) => {
    const { title, image, description } = req.body;
    const sql = `INSERT INTO Article (Title, Image, description) VALUES ($1, $2, $3) RETURNING id;`;
    const values = [title, image, description];

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
    const { id, title, image, description  } = req.body;
    const sql = `UPDATE Article SET title = $1, image = $2, description = $3 WHERE id = $4 RETURNING *;`;
    const values = [title, image, description, id];

    try {
        const result = await client.query(sql, values);
        if(result.rowCount > 0)
        res.json({ message: 'Article updated', article: result.rows[0] });
    else
    res.json({ message: 'Article not found', article: result.rows[0] });
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

//=============================/admin/spares/add========================================
// /admin/spares/add
//Tested
export const addSpare = async (req, res) => {
    const { name, quantity, reorderthreshold, price } = req.body;

    const sql = `
        INSERT INTO spares (name, quantity, reorderthreshold, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

    try {
        const result = await client.query(sql, [name, quantity, reorderthreshold, price]);
        if(result.rowCount > 0)
        res.json({
            message: 'Spare added successfully',
            spare: result.rows[0]
        });
        else 
        res.json({error: "something went wrong"});
    } catch (err) {
        console.error("Error adding spare:", err);
        res.status(500).json({ message: 'Failed to add spare' });
    }
};

//=============================/admin/spares/update========================================
// /admin/spares/update
//Tested
export const updateSpare = async (req, res) => {
    const { id, name, quantity, reorderthreshold, price } = req.body;

    const sql = `
        UPDATE spares
        SET name = $1, quantity = $2, reorderthreshold = $3, price = $4
        WHERE id = $5
        RETURNING *;
    `;

    try {
        const result = await client.query(sql, [name, quantity, reorderthreshold, price, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Spare not found' });
        }

        res.json({
            message: 'Spare updated successfully',
            spare: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating spare:", err);
        res.status(500).json({ message: 'Failed to update spare' });
    }
};

//=============================/admin/spares/delete/:id========================================
// /admin/spares/delete/:id
//Tested
export const deleteSpare = async (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM spares
        WHERE id = $1
        RETURNING *;
    `;

    try {
        const result = await client.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Spare not found' });
        }

        res.json({
            message: 'Spare deleted successfully',
            spare: result.rows[0]
        });
    } catch (err) {
        console.error("Error deleting spare:", err);
        res.status(500).json({ message: 'Failed to delete spare' });
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
    const { customerId, title, category, issueDescription, actualcost, maintenanceTime, isCommon } = req.body;
    let imgUrl;
    if (req.file !== undefined) {
      // Variable is undefined
      const filename = req.file.filename;
      console.log(filename);
      imgUrl = `${filename}`;
    }
    
    const sql = `INSERT INTO Service (customerId, title, category, actualcost, maintenanceTime, image, isCommon, issueDescription) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`;
    
    const values = [customerId, title, category, actualcost, maintenanceTime, imgUrl, isCommon, issueDescription];

    try {
        const fetchCustomer = await client.query(`SELECT * FROM Customer WHERE userid = $1`, [customerId]);
        
        if(fetchCustomer.rowCount > 0){

            const result = await client.query(sql, values);
            res.json({ message: 'Service added', serviceId: result.rows[0].id });
        }else{

            res.json({ message: 'Customer not found'});
        }
    } catch (err) {
        console.error("Add service error:", err);
        res.status(500).json({ error: "Failed to add service" });
    }
};

//=============================/admin/services/update========================================
// /admin/services/update
//Tested
export const updateService = async (req, res) => {
    const {id, title, category, issueDescription, actualcost, maintenanceTime, isCommon } = req.body;
    let imgUrl;
    if (req.file !== undefined) {
      // Variable is undefined
      const filename = req.file.filename;
      console.log(filename);
      imgUrl = `${filename}`;
    }
    const sql = `
        UPDATE service
        SET title = $1, category = $2, actualcost = $3, maintenanceTime = $4, image = $5, isCommon = $6, issueDescription = $7 
        WHERE id = $8
        RETURNING *;
    `;

    const values = [title, category, actualcost, maintenanceTime, imgUrl, isCommon, issueDescription, id];
    try {
        const result = await client.query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({
            message: 'Service updated successfully',
            service: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating service:", err);
        res.status(500).json({ message: 'Failed to update service' });
    }
};

//=============================/admin/services/delete/:id========================================
// /admin/services/delete/:id
//Tested
export const deleteService = async (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM service
        WHERE id = $1
        RETURNING *;
    `;

    try {
        const result = await client.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({
            message: 'Service deleted successfully',
            service: result.rows[0]
        });
    } catch (err) {
        console.error("Error deleting service:", err);
        res.status(500).json({ message: 'Failed to delete service' });
    }
};

//=============================/admin/services/usageRate========================================
// /admin/services/usageRate
//Tested
export const getServicesUsage = async (req, res) => {
    const sql = `
        SELECT title AS name, 
               (usagetime::FLOAT / (SELECT SUM(usagetime) FROM service)  * 100) AS usageRate
        FROM service;
    `;

    try {
        const result = await client.query(sql);
        if(result.rowCount >0)
        res.json(result.rows); 
        else 
        res.json({error: "No reslut found"});
    } catch (err) {
        console.error("Get services usage error:", err);
        res.status(500).json({ error: "Failed to fetch service usage rates" });
    }
};

//=============================/admin/services/getRatings========================================
// /admin/services/getRatings
export const getServicesRatings = async (req, res) => {
    const sql = `
        SELECT s.title AS name, 
               AVG(f.rating) AS rating
        FROM service s
        LEFT JOIN feedback f ON s.id = f.serviceid
        GROUP BY s.title;
    `;

    try {
        const result = await client.query(sql);
        res.json(result.rows);  // Returns the array of services with their ratings
    } catch (err) {
        console.error("Get services ratings error:", err);
        res.status(500).json({ error: "Failed to fetch service ratings" });
    }
};

//=============================/admin/services/servicesPerDay========================================
// /admin/services/servicesPerDay
//Tested
export const getServicesPerDay = async (req, res) => {

    const sql = `
        SELECT 
            TO_CHAR(createddate, 'YYYY-MM-DD') AS date, 
            COUNT(*) AS count 
        FROM Service 
        GROUP BY TO_CHAR(createddate, 'YYYY-MM-DD') 
        ORDER BY date;
    `;

    try {
        const result = await client.query(sql);
        if(result.rowCount > 0)
        res.json(result.rows);
        else
        res.json({ error: "No Servies found" });

    } catch (err) {
        console.error("Error fetching services per day:", err);
        res.status(500).json({ error: "Failed to fetch services per day" });
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

//=============================/admin/reports/request/:id========================================
// /admin/reports/request/:id
//Tested
export const getReportForRequest = async (req, res) => {
    const { id } = req.params; 

    const sql = `
          SELECT 
            r.comment,
            rd.quantity,
            s.name AS spareName
        FROM 
            Report r
        JOIN 
            ReportDetails rd ON r.id = rd.reportid
        JOIN 
            Spares s ON rd.spareid = s.id
        WHERE 
            r.requestId = $1;
    `;

    try {
        const result = await client.query(sql, [id]);
// Print or log the SQL query and parameter for debugging
console.log('SQL Query:', sql);
console.log('Parameter:', id);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No report found for this request' });
        }

        res.json({
            message: 'Report data retrieved successfully',
            reports: result.rows // list of reports
        });
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ message: 'Failed to fetch report data' });
    }
};

