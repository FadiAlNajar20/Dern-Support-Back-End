import express from "express";
import {
  testIo,
  customerSignup,
  customerLogin,
  customerLogout,
  customerGetEstimatedTimeAndCost,
  customerSendServiceRequest,
  customerSendFeedback,
  customerGetAllRequests,
  customerSenApprovedSupportRequest,
  customerGetFeedback,
  customerVerifyEmail,
} from "../controllers/customerController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../config/upload.js";

const router = express.Router();
router.route("/testIo").post(testIo);
router.route("/signup").post(customerSignup);
router.route("/login").post(customerLogin);
router.route("/logout").post(customerLogout);
// router.route("/send-support-request").post(customerSendSupportRequest);
router.route("/send-service-request").post(customerSendServiceRequest);
router.route("/send-feedback").post(customerSendFeedback);
router.route("/my-requests/:id").get(customerGetAllRequests);

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.post("/logout", verifyToken, customerLogout);
router.get("/verify-email",  customerVerifyEmail);
// image
router.post(
  "/send-support-request",
  verifyToken,
  customerGetEstimatedTimeAndCost
);
router.post("/send-service-request", verifyToken, customerSendServiceRequest);
router.post("/send-feedback", verifyToken, customerSendFeedback);
router.get("/my-requests/:id", verifyToken, customerGetAllRequests);
router.post(
  "/final-approval-support-request",
  verifyToken,
  upload.single("image"), //image upload
  customerSenApprovedSupportRequest
);
router.get("/getFeedback", verifyToken, customerGetFeedback);

export default router;
