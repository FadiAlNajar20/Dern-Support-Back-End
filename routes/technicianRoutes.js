import express from 'express';
import {
    technicianLogin,
    technicianLogout,
    updateJobSchedule, 
     GetAssignedJobSchedule
    } from "../controllers/technicianController.js";

    const router = express.Router();
    router.route("/login", technicianLogin);
    router.route("/logout", technicianLogout);
    router.route("/job-schedules", updateJobSchedule);
    router.route("/requests/assigned/:id", GetAssignedJobSchedule);

    export default router;


