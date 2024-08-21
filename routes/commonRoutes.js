import express from 'express';
import {
    getAllServices,
    getAllArticles,
    getAllSpares,
    getServicesById
    
} from '../controllers/commonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/services/getAll', getAllServices);
router.get('/articles/getAll', getAllArticles);
router.get('/services/:id', getServicesById);
router.get('/spares/getAll', verifyToken, getAllSpares);


export default router;