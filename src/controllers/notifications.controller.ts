import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendNotification } from '../utils/notifications';

export const subscribe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const subscription = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.pushSubscription = subscription;
    await user.save();

    res.status(200).json({ success: true, message: 'Subscribed to push notifications' });
  } catch (error) {
    next(error);
  }
};

export const testNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await User.findById(userId);

    const subscription = user?.pushSubscription;
    
    if (!subscription) {
      return res.status(400).json({ success: false, message: 'User not subscribed' });
    }

    await sendNotification(subscription, {
      title: 'SmartSpend Test',
      body: 'Push notifications are working!',
      icon: '/icon-192x192.png'
    });

    res.status(200).json({ success: true, message: 'Test notification sent' });
  } catch (error) {
    next(error);
  }
};
