import express from 'express';
import { startCronJob, stopCronJob, getCronJobStatus } from '../services/cronJob';

const router = express.Router();

router.post('/start', startCronJob); 
router.post('/stop', stopCronJob);   
router.get('/status', getCronJobStatus); 

export default router;
