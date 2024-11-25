import { Request, Response } from 'express';
import cron from 'node-cron';
import { generateRandomTransaction } from '../cron/transactionCron'; 
let task: cron.ScheduledTask | null = null;
let isRunning = false;

export const startCronJob = (req: Request, res: Response) => {
  const {user} = req.body;
  const userId = user.id;
  if (isRunning) {
    return res.status(400).json({ success:false, message: 'CRON job is already running.' });
  }


  task = cron.schedule('* * * * * *', async () => {
    try {
      await generateRandomTransaction(); 
    } catch (error) {
      console.error('Error during cron job execution:', error);
    }
  });

  isRunning = true;
  res.status(200).json({success:true, message: 'CRON job started.' });
};

export const stopCronJob = (req: Request, res: Response) => {
  if (!isRunning) {
    return res.status(400).json({ success:false, message: 'CRON job is not running.' });
  }

  task?.stop();
  task = null;
  isRunning = false;

  res.status(200).json({ success:true,message: 'CRON job stopped.' });
};

export const getCronJobStatus = (req: Request, res: Response) => {
  res.status(200).json({ success:true, cronJobStatus: isRunning, message:"Status Fetched Successfully" });
};
