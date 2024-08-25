import express from "express";
import * as adminController from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../config/upload.js";

const router = express.Router();

router.post("/login", adminController.login);
router.post("/logout", verifyToken, adminController.logout);

router.put(
  "/support-requests/update",
  verifyToken,
  adminController.updateSupportRequestStatus
);
router.put(
  "/support-requests-timeAndCost/update",
  verifyToken,
  adminController.updateSupportRequestTimeAndCost
);
router.get(
  "/support-requests/getAll",
  verifyToken,
  adminController.getAllRequests
);
router.get(
  "/support-requests/requestsPerDay",
  verifyToken,
  adminController.getRequestsPerDay
);

router.get("/feedback/getAll", verifyToken, adminController.getAllFeedback);
router.get(
  "/feedback/relatedToService/:id",
  verifyToken,
  adminController.getAllFeedbackRelatedToService
);
router.get(
  "/feedback/relatedToService/avg/:id",
  verifyToken,
  adminController.getAVGForAllFeedbackRelatedToService
);

router.post(
  "/articles/add",
  verifyToken,
  upload.single("image"),
  adminController.addArticle
);
router.put("/articles/update", verifyToken, adminController.updateArticle);
router.delete(
  "/articles/delete/:id",
  verifyToken,
  adminController.deleteArticle
);

router.post("/spares/add", verifyToken, adminController.addSpare);
router.put("/spares/update", verifyToken, adminController.updateSpare);
router.delete("/spares/delete/:id", verifyToken, adminController.deleteSpare);
router.post("/spares/:id/reorder", verifyToken, adminController.reorderSpares);
router.get("/spares/getAll", verifyToken, adminController.getAllSpares);

router.post(
  "/services/add",
  verifyToken,
  upload.single("image"),
  adminController.addService
);
router.put(
  "/services/update",
  verifyToken,
  upload.single("image"),
  adminController.updateService
);
router.delete(
  "/services/delete/:id",
  verifyToken,
  adminController.deleteService
);
router.get(
  "/services/usageRate",
  verifyToken,
  adminController.getServicesUsage
);
router.get(
  "/services/getRatings",
  verifyToken,
  adminController.getServicesRatings
);
router.get(
  "/services/servicesPerDay",
  verifyToken,
  adminController.getServicesPerDay
);

router.post(
  "/technicians/createAccount",
  verifyToken,
  adminController.createTechnicianAccount
);
// router.post('/technicians/createAccount', adminController.createTechnicianAccount);
router.get(
  "/reports/request/:id",
  verifyToken,
  adminController.getReportForRequest
);


router.get("/users/:id", verifyToken, adminController.getUserNameAndEmail);


export default router;
