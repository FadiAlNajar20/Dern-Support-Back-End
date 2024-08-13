import express from 'express';
import {
    technicianLogin,
    technicianLogout,
    updateJobSchedule, 
     GetAssignedJobSchedule
    } from "../controllers/technicianController.js";
    import { verifyToken } from "../middlewares/authMiddleware.js";

    //router.post('/login', login);

    const router = express.Router();
    router.post("/login", technicianLogin);
    router.post("/logout",verifyToken, technicianLogout);
    router.put("/job-schedules",verifyToken, updateJobSchedule);
    router.get("/requests/assigned/:id",verifyToken, GetAssignedJobSchedule);

    export default router;


