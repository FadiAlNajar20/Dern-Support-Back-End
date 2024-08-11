import express from 'express';
import {
    login,
    logout,
    updateSupportRequest,
    getAllRequests,
    getAllFeedback,
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
router.put('/support-requests/update', verifyToken, updateSupportRequest);
router.get('/support-requests/getAll', verifyToken, getAllRequests);
router.get('/feedback/getAll', verifyToken, getAllFeedback);
router.post('/articles/add', verifyToken, addArticle);
router.put('/articles/update', verifyToken, updateArticle);
router.delete('/articles/delete/:id', verifyToken, deleteArticle);
router.get('/spares/getAll', verifyToken, getAllSpares);
router.post('/spares/:id/reorder', verifyToken, reorderSpares);
router.post('/services/add', verifyToken, addService);
router.post('/technicians/createAccount', verifyToken, createTechnicianAccount);

export default router;