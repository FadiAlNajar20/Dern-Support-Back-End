import { client } from "../server.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


//=============================/technicians/login=========================================

// /technicians/login
//TODO: test this 
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
       `SELECT Technician.id, "User".email, "User".password
    FROM "User"
    JOIN Technician ON "User".id = Technician.userid
    WHERE "User".email = $1;`,
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
  
      const technicianId = result.rows[0].id;
      const token = jwt.sign({ id: technicianId }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({
        message: "Login successfully",
        success: true,
        token,
      });
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
  
  //=============================/technicians/assigned-request/update===============================
  // /technicians/assigned-request/update
  async function updateAvailability(technicianId, deadline) {
    try {
      // Get the current availability of the technician
      const res = await client.query('SELECT availability FROM Technician WHERE id = $1', [technicianId]);
      if (res.rows.length === 0) {
        console.log('Technician not found');
        return;
      }
  
      let availability = new Date(res.rows[0].availability);
      const deadlineDuration = new Date(deadline) - new Date(); // Deadline duration in milliseconds
  
      // Calculate new availability time
      let endAvailability = new Date(availability.getTime() + deadlineDuration);
  
      // Make sure endAvailability is within working hours
      let workStart = new Date(availability);
      workStart.setHours(8, 0, 0, 0); // 8 AM
  
      let workEnd = new Date(availability);
      workEnd.setHours(17, 0, 0, 0); // 5 PM
  
      if (endAvailability < workStart) {
        endAvailability = workStart;
      } else if (endAvailability > workEnd) {
        // If the end availability is outside working hours, adjust it to the next working day
        endAvailability = new Date(endAvailability);
        endAvailability.setDate(endAvailability.getDate() + ((8 - endAvailability.getDay() + 7) % 7)); // Move to next Monday
        endAvailability.setHours(8, 0, 0, 0);
      }
  
      // Update the availability in the database
      await client.query('UPDATE Technician SET availability = $1 WHERE id = $2', [endAvailability, technicianId]);
      console.log('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      await client.end();
    }
  }
//updateAvailability(1, '2024-08-15T12:00:00Z');

  export const updateAssignedRequest = async (req, res) => {
    const TechnicianId = req.userid;
    const {ActualTime, RequestId}= req.body;
    try {
        const result = await client.query(
            `UPDATE Request SET actualtime = $1, status=2$ WHERE id = $3 RETURNING *;`
            , [ActualTime, "InProgress", RequestId]
        );
        updateAvailability(TechnicianId, ActualTime); // Update technician's availability after updating request
        res.json({ message: 'Request successfully', request: result.rows[0] });
    } catch (err) {
        console.error("Update Request error:", err);
        res.status(500).json({ error: "Failed to update Request" });
    }
  };
  //=============================/technicians/completed-request/update===============================
  // /technicians/completed-request/update
  export const updateCompletedRequest = async (req, res) => {
    const TechnicianId = req.userid;
    const {ActualCost, MaintenanceTime, RequestId}= req.body;
    try {
      const result1= await client.query(`SELECT RequestType FROM Request WHERE id= $1`, [RequestId]);
      const {RequestType}= result1.rows[0];

      const result = await client.query(
        `UPDATE Request SET status=$1 WHERE id = $2 RETURNING *;`
        , ["Complete", RequestId]
    );

      if(RequestType=="NewRequest")
      {
        await client.query(
          `Update NewRequest SET ActualCost=$1, MaintenanceTime= $2 WHERE RequestId = $3;`,
          [ActualCost, MaintenanceTime, RequestId]
        );
      }
 
        res.json({ message: 'Request successfully', request: result.rows[0] });
    } catch (err) {
        console.error("Update Request error:", err);
        res.status(500).json({ error: "Failed to update Request" });
    }
  };
  //=============================/requests/assigned========================================
  // /requests/assigned
export const GetAssignedRequests = async (req, res) => {
    const TechnicianId = req.userid;
    try {
        const result = await client.query(
            `SELECT * FROM Request WHERE technicianid = $1;`
            , [TechnicianId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get assigned request error:", err);
        res.status(500).json({ error: "Failed to get assigned request" });
    }
  
};
  