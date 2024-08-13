import { client } from "../server.js";
import bcrypt from "bcrypt";
import { io } from "../server.js";
import { v4 as uuidv4 } from 'uuid';

export const testIo = async (req, res) => {
  console.log("Request received");

  const body = req.body;
  console.log(body);

  // create an idintity id  for each notification
  const notificationId = uuidv4();

  io.emit("newRequest", {
    id: notificationId, 
    message: "Your order has been successfully scheduled. Go to the information page to see the status of your order",
  });

  res.status(200).json("done");
};

//=============================/customers/signup========================================
// /customers/signup
export const customerSignup = async (req, res) => {
  const { Name, Email, Password, PhoneNumber, AccountType } = req.body;
  //all field required
  if (!Name || !Email || !Password || !PhoneNumber || !AccountType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //check if the Email is already exists (because in the schema the email is unique)
    const existingUser = await client.query(
      `SELECT * FROM "User" WHERE Email = $1`,
      [Email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    //hash the password before storing it in the database using (bcrypt package)
    const hashedPassword = await bcrypt.hash(Password, 10);

    //insert the new user into the database
    const result = await client.query(
      `
      INSERT INTO "User" (Name, Email, Password, PhoneNumber)
      VALUES ($1, $2, $3, $4) RETURNING ID;
    `,
      [Name, Email, hashedPassword, PhoneNumber]
    );
    //TODO: Hassan--> check if id retrieved correctly or not (id or ID)
    const userId = result.rows[0].id;

    //insert the customer record into the database
    await client.query(
      `
      INSERT INTO Customer (UserID, AccountType)
      VALUES ($1, $2);
    `,
      [userId, AccountType]
    );

    //TODO: WE should handle this with JWT
    //generate and return JWT token
    // const token = generateToken(userId);
    // res.status(201).json({ token });
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=============================/customers/login=========================================

// /customers/login
export const customerLogin = async (req, res) => {
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
      SELECT Password FROM "User" WHERE Email = $1;
    `,
      [Email]
    );

    // check if the user is exist or not
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found :(" });
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

//=============================/customers/logout========================================

// /customers/logout
export const customerLogout = (req, res) => {
  //TODO: based on the middleware authentication
  // JWT token invalidation would be handled here
  res.status(200).json({ message: "Logged out successfully" });
};

//=============================/customers/send-support-request========================================
// /customers/send-support-request
export const customerSendSupportRequest = async (req, res) => {
  const { CustomerID, Description, DeviceDeliveryMethod } = req.body;

  //all field required
  if (!CustomerID || !Description || !DeviceDeliveryMethod) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //TODO: Hassan--> check if customer id exists or not (CustomerID or ID)

    //insert the new request into the database
    //and set the status to "Pending" (or we can discuss other statuses)//(TODO)
    //and discuss Urgency Values(TODO)
    await client.query(
      `
      INSERT INTO Request (CustomerID, Status, DeviceDeliveryMethod, CreatedDate, RequestType, Urgency)
      VALUES ($1, 'Pending', $2, CURRENT_TIMESTAMP, 'Support Request', 'Medium');
    `,
      [CustomerID, DeviceDeliveryMethod]
    );

    res.status(201).json({ message: "Request submitted" });
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=============================/customers/send-service-request========================================
// /customers/send-service-request
export const customerSendServiceRequest = async (req, res) => {
  const { CustomerID, ServiceID, IssueDescription, Method } = req.body;

  //all field required
  if (!CustomerID || !ServiceID || !IssueDescription || !Method) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const estimatedCost = 100.0; //TODO(L): Example cost, replace with actual logic
  const maintenanceTime = 60; // TODO(L): Example time in minutes, replace with actual logic

  try {
    await client.query("BEGIN"); //FROM Tabnine Ai I will test it later

    //insert the new request into the database
    //and set the status to "Pending" (or we can discuss other statuses)//(TODO)
    //and discuss Urgency Values(TODO)
    const requestResult = await client.query(
      `
      INSERT INTO Request (CustomerID, Status, DeviceDeliveryMethod, CreatedDate, RequestType, Urgency)
      VALUES ($1, 'Pending', $2, CURRENT_TIMESTAMP, 'Service Request', 'High') RETURNING ID;
    `,
      [CustomerID, Method]
    );
    //TODO: Hassan--> check if customer id exists or not (CustomerID or ID)
    const requestID = requestResult.rows[0].id;

    //insert the new request into the database
    await client.query(
      `
      INSERT INTO NewRequest (IssueDescription, EstimatedCost, MaintenanceTime, RequestID)
      VALUES ($1, $2, $3, $4);
    `,
      [IssueDescription, estimatedCost, maintenanceTime, requestID]
    );

    await client.query(
      `
      INSERT INTO ServiceRequest (ServiceID, RequestID)
      VALUES ($1, $2);
    `,
      [ServiceID, requestID]
    );

    await client.query("COMMIT"); //FROM Tabnine Ai

    res.status(201).json({ message: "Service requested" });
  } catch (error) {
    await client.query("ROLLBACK"); //FROM Tabnine Ai
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};


//=============================/customers/send-feedback========================================
// /customers/send-feedback
export const customerSendFeedback = async (req, res) => {
  const { CustomerID, ServiceID, Rating, Comment } = req.body;

  //all field required
  if (!CustomerID || !ServiceID || !Rating) {
    return res
      .status(400)
      .json({ error: "CustomerID, ServiceID, and Rating are required" });
  }

  try {
    //insert the new feedback into the database
    await client.query(
      `
      INSERT INTO Feedback (CustomerID, ServiceID, Rating, Comment)
      VALUES ($1, $2, $3, $4);
    `,
      [CustomerID, ServiceID, Rating, Comment]
    );

      
    res.status(201).json({ message: "Feedback submitted" });
  } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};


//=============================/customers/my-requests/:id========================================
// /customers/my-requests/:id
export const customerGetAllRequests = async (req, res) => {
 // const customerId = parseInt(req.params.id);
  const customerId = req.params.id;
    try {
      //get all Requests for customer
      const result = await client.query(
        `
      SELECT * FROM Request WHERE CustomerID = $1;
    `,
        [customerId]
      );

      res.status(200).json(result.rows);
    } catch (error) {
    console.error("Error executing query", error.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};