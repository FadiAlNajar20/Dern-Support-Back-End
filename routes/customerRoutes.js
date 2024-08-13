import express from "express";
import {
  testIo,
  customerSignup,
  customerLogin,
  customerLogout,
  customerSendSupportRequest,
  customerSendServiceRequest,
  customerSendFeedback,
  customerGetAllRequests
} from "../controllers/customerController.js";

const router = express.Router();
router.route("/testIo").post(testIo);
router.route("/signup").post(customerSignup);
router.route("/login").post(customerLogin);
router.route("/logout").post(customerLogout);
router.route("/send-support-request").post(customerSendSupportRequest);
router.route("/send-service-request").post(customerSendServiceRequest);
router.route("/send-feedback").post(customerSendFeedback);
router.route("/my-requests/:id").get(customerGetAllRequests);

export default router;
