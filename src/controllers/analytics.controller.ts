import { Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middlewares/auth.middleware';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const getMonthlyAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const months = parseInt(req.query.months as string) || 6;
    
    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, months - 1));

    const pipeline: any[] = [
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ];

    const results = await Transaction.aggregate(pipeline);
    
    const timeline = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      
      const incomeItem = results.find(r => r._id.year === year && r._id.month === month && r._id.type === 'income');
      const expenseItem = results.find(r => r._id.year === year && r._id.month === month && r._id.type === 'expense');

      const monthName = d.toLocaleString('default', { month: 'short' });

      timeline.push({
        name: monthName,
        year,
        income: incomeItem ? incomeItem.total : 0,
        expense: expenseItem ? expenseItem.total : 0
      });
    }

    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    next(error);
  }
};

export const getCategoryAnalytics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const formatted = expenses.map(e => ({ name: e._id, value: e.total }));

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};
