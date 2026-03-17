import webpush from 'web-push';
import 'dotenv/config';
import { logger } from './logger';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@smartspend.app',
  process.env.VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export const sendNotification = async (subscription: any, payload: any) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    logger.info('Push notification sent');
  } catch (error) {
    logger.error('Error sending push notification', error);
  }
};
