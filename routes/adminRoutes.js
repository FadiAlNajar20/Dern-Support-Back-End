import express from 'express';
import {
    login,
    logout,
    updateSupportRequestStatus,
    getAllRequests,
    getAllFeedback,
    getAllFeedbackRelatedToService,
    getAVGForAllFeedbackRelatedToService,
    addArticle, 
    updateArticle,
    deleteArticle,
    getAllSpares,
    reorderSpares,
    addService,
    createTechnicianAccount
} from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout);
router.put('/support-requests/update', verifyToken, updateSupportRequestStatus);
router.get('/support-requests/getAll', verifyToken, getAllRequests);
router.get('/feedback/getAll', verifyToken, getAllFeedback);
router.get('/feedback/relatedToService/:id', verifyToken, getAllFeedbackRelatedToService);
router.get('/feedback/relatedToService/avg/:id', verifyToken, getAVGForAllFeedbackRelatedToService);
router.post('/articles/add', verifyToken, addArticle);
router.put('/articles/update', verifyToken, updateArticle);
router.delete('/articles/delete/:id', verifyToken, deleteArticle);
router.get('/spares/getAll', verifyToken, getAllSpares);
router.post('/spares/:id/reorder', verifyToken, reorderSpares);
router.post('/services/add', verifyToken, addService);
router.post('/technicians/createAccount', verifyToken, createTechnicianAccount);

export default router;