import express from "express";
import {
  customerSignup,
  customerLogin,
  customerLogout,
  customerSendSupportRequest,
  customerSendServiceRequest,
  customerSendFeedback,
  customerGetAllRequests,
} from "../controllers/customerController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.post("/logout", verifyToken, customerLogout);
router.post("/send-support-request", verifyToken, customerSendSupportRequest);
router.post("/send-service-request", verifyToken, customerSendServiceRequest);
router.post("/send-feedback", verifyToken, customerSendFeedback);
router.get("/my-requests/:id", verifyToken, customerGetAllRequests);

export default router;
