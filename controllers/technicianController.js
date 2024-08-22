import { client } from "../server.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';




async function updateTechnicianAvailability(technicianId, maintenanceTime) {
  try {
    // Fetch the current availability
    const result = await client.query(
      'SELECT availability FROM Technician WHERE id = $1',
      [technicianId]
    );
    let currentAvailability = new Date(result.rows[0].availability);

    // Set working hours (08:00 to 17:00)
    const workStart = new Date(currentAvailability);
    workStart.setHours(8, 0, 0, 0);
    const workEnd = new Date(currentAvailability);
    workEnd.setHours(17, 0, 0, 0);

    let hoursToAdd = maintenanceTime;

    // If the current availability is before the working hours, set it to workStart
    if (currentAvailability < workStart) {
      currentAvailability = workStart;
    }

    while (hoursToAdd > 0) {
      // Calculate the end of the working day
      let endOfDay = new Date(currentAvailability);
      endOfDay.setHours(17, 0, 0, 0);

      // Calculate the time remaining until the end of the day
      let remainingHoursToday = (endOfDay - currentAvailability) / (1000 * 60 * 60);

      if (hoursToAdd <= remainingHoursToday) {
        // Update availability within the same day
        currentAvailability.setHours(currentAvailability.getHours() + hoursToAdd);
        hoursToAdd = 0;
      } else {
        // Move to the next workday
        hoursToAdd -= remainingHoursToday;
        currentAvailability.setDate(currentAvailability.getDate() + 1);
        currentAvailability.setHours(8, 0, 0, 0);
      }
    }

    // Update the technician's availability in the database
    const updatedResult = await client.query(
      'UPDATE Technician SET availability = $1 WHERE id = $2 RETURNING availability',
      [currentAvailability, technicianId]
    );

    // Return the new availability in timestamp without time zone format
    return updatedResult.rows[0].availability;
     //return moment(updatedResult.rows[0].availability).format('YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
}
//=============================/technician/login=========================================
// /technician/login
// Tested  
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
      const isMatch =  bcrypt.compare(Password, password);
      console.log(password, Email, Password);
  
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
  //=============================/technician/logout=========================================
 // /technician/logout
  export const technicianLogout = (req, res) => {
    //TODO: based on the middleware authentication
    // JWT token invalidation would be handled here
    res.status(200).json({ message: "Logged out successfully" });
  };
  
  //=============================/technician/assigned-request/update===============================
  // /technician/assigned-request/update 
  //Tested 
  //if it is newRequest type send MaintenanceTime
  export const updateAssignedRequest = async (req, res) => {
    const TechnicianId = req.userId;
    //if it is NewRequest send MaintenanceTime
    //if it is ServiceRequest get MaintenanceTime from service table
    let {MaintenanceTime , RequestId}= req.body;
    try {
      let result1= await client.query(`SELECT RequestType FROM Request WHERE id= $1`, [RequestId]);
      const {requesttype}= result1.rows[0];
      if(requesttype=="ServiceRequest")
      {
        result1 = await client.query
        (`SELECT MaintenanceTime FROM Service
          JOIN ServiceRequest ON Service.id = ServiceRequest.ServiceId
          WHERE ServiceRequest.RequestId = $1`,[RequestId]
        );
       MaintenanceTime= result1.rows[0].maintenancetime;
      }

     // Update technician's availability after updating request by technician
        const ActualTime= await updateTechnicianAvailability(TechnicianId, MaintenanceTime); 
      // update the request with the ActualTime and status
        const result = await client.query(
            `UPDATE Request SET actualtime = $1, status=$2 WHERE id = $3 RETURNING *;`
            , [ActualTime, "InProgress", RequestId]
        );
        
        res.json({ message: 'Request Updated Successfully', request: result.rows[0] });
    } catch (err) {
        console.error("Update Request error:", err);
        res.status(500).json({ error: "Failed to update Request" });
    }
  };
  //=============================/technician/completed-request/update===============================
  // /technician/completed-request/update
  //Tested
  //if it is newRequest type send ActualCost
  export const updateCompletedRequest = async (req, res) => {
    const {ActualCost, RequestId}= req.body;
    try {
      const result1= await client.query(`SELECT RequestType FROM Request WHERE id= $1`, [RequestId]);
      const {requesttype}= result1.rows[0];

      const result = await client.query(
        `UPDATE Request SET status=$1 WHERE id = $2 RETURNING *;`
        , ["Complete", RequestId]
    );

      if(requesttype=="NewRequest")
      {
        await client.query(
          `Update NewRequest SET ActualCost=$1 WHERE RequestId = $2;`,
          [ActualCost, RequestId]
        );
      }
 
        res.json({ message: 'Request Updated Successfully', request: result.rows[0] });
    } catch (err) {
        console.error("Update Request error:", err);
        res.status(500).json({ error: "Failed to update Request" });
    }
  };
  //=============================/technician/requests/assigned========================================
  // technician/requests/assigned
  // Tested
export const GetAssignedRequests = async (req, res) => {
    const TechnicianId = req.userId;
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
  
  //=============================/technician/send-report========================================
  // /technician/send-report
  //Tested
  export const SendReport= async (req, res)=>{
    //Spares is an array of objects {spareId, quantity}
    const {RequestId, Comment, Spares} = req.body;

    if(!RequestId || !Comment)
      return res.status(400).json({ error: "Invalid input" });

    try {
      const result = await client.query(
          `INSERT INTO Report (RequestId, Comment) VALUES ($1, $2) RETURNING Report.Id;`
          , [RequestId, Comment]
      );
      const {id}= result.rows[0];
      if(Spares.length !== 0)
      {
        for (const { spareId, quantity } of Spares) {
          await client.query(
            `INSERT INTO ReportDetails (ReportId, SpareId, Quantity) VALUES ($1, $2, $3) ;`,
            [id, spareId, quantity]
          );
          await client.query(
            `UPDATE Spares SET Quantity = Quantity - $1 WHERE Id = $2  ;`,
            [quantity, spareId]
          );
      }
    }
    res.json({ message: 'Report Sent Successfully'});
  } catch (err) {
      console.error("Send report error:", err);
      res.status(500).json({ error: "Failed to send report" });
  }
  };

