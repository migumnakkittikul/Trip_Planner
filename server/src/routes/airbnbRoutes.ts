import express from 'express';
import * as AirbnbController from '../controllers/airbnbController';

const router = express.Router();

router.get('/:id', AirbnbController.getById);
router.post('/', AirbnbController.getAll);

export default router;