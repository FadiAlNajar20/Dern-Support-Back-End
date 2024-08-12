import { client } from "../server.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


//=============================/technicians/login=========================================

// /technicians/login
export const technicianLogin = async (req, res) => {
    const { Email, Password } = req.body;
  
    //all field required
    if (!Email || !Password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }
  
    try {
      //check if the Email is exists in the database
      //We depend on the email (Maybe we can discussed a better solution)
      const result = await client.query(
        `
        SELECT Password FROM Technician WHERE Email = $1;
      `,
        [Email]
      );
  
      // check if the technician is exist or not
      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Technician not found :(" });
      }
  
      const { password } = result.rows[0];
      const isMatch = await bcrypt.compare(Password, password);
  
      //Check if the password matches the password stored in the database
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid Email Or Password" });
      }
  
      //TODO: WE should handle this
      //generate and return JWT token
      // const token = generateToken(id);
      // res.status(200).json({ token });
    } catch (error) {
      console.error("Error executing query", error.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  //=============================/technicians/logout========================================
  
  // /technicians/logout
  export const technicianLogout = (req, res) => {
    //TODO: based on the middleware authentication
    // JWT token invalidation would be handled here
    res.status(200).json({ message: "Logged out successfully" });
  };
  
  //=============================/technicians/job-schedules========================================
  // /technicians/job-schedules
  export const updateJobSchedule = async (req, res) => {
    const {id, ActualTime, ActualCost, Status}= req.body;
    try {
        const result = await client.query(
            `UPDATE JobSchedule SET actualtime = $1, actualcost=2$, status=3$ WHERE id = $4 RETURNING *;`
            , [ActualTime, ActualCost, Status, id]
        );
        res.json({ message: 'Job Updated successfully', request: result.rows[0] });
    } catch (err) {
        console.error("Update job schedule error:", err);
        res.status(500).json({ error: "Failed to update job schedule" });
    }
  };

  //=============================/requests/assigned/:id========================================
  // /requests/assigned/:id
export const GetAssignedJobSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query(
            `SELECT * FROM JobSchedule WHERE technicianid = $1;`
            , [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get assigned job schedule error:", err);
        res.status(500).json({ error: "Failed to get assigned job schedule" });
    }
  
};
  