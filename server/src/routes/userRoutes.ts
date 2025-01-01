import express from 'express';
import * as UserController from '../controllers/userController';

const router = express.Router();

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.get('/email/:email', UserController.getByEmail);
router.get('/:id/plans', UserController.getPlansById);
router.post('/', UserController.create);

export default router;