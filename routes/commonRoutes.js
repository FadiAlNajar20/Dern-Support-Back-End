import express from 'express';
import {
    getAllServices,
    getAllArticles
} from '../controllers/commonController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/services/getAll', verifyToken, getAllServices);
router.get('/articles/getAll', verifyToken, getAllArticles);


export default router;