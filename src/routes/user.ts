import express from 'express';
import { getUser} from '../services/userService';

const router = express.Router();

router.get('/getUser', getUser);

export default router;
