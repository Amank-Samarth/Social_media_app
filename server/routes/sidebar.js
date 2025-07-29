import express from 'express';
import { getTrendingTopics, getSuggestions } from '../controllers/sidebar.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/trending', verifyToken, getTrendingTopics);
router.get('/suggestions', verifyToken, getSuggestions);

export default router;
