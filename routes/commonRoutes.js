import express from 'express';
import {
    getAllServices,
    getAllArticles,
    getServicesById
} from '../controllers/commonController.js';

const router = express.Router();

router.get('/services/getAll', getAllServices);
router.get('/articles/getAll', getAllArticles);
router.get('/services/:id', getServicesById);

export default router;