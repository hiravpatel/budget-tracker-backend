import { Response, NextFunction } from 'express';
import { Budget } from '../models/Budget';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getBudgets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const budgets = await Budget.find({ userId, month, year });

    res.status(200).json({ success: true, data: budgets });
  } catch (error) {
    next(error);
  }
};

export const setBudget = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { category, limitAmount, month, year, alertThreshold } = req.body;

    // Use findOne + update or create instead of upsert directly to ensure safe creation without conflicts
    // if the unique constraint relies on multiple fields.
    const monthVal = month || new Date().getMonth() + 1;
    const yearVal = year || new Date().getFullYear();

    let budget = await Budget.findOne({ userId, category, month: monthVal, year: yearVal });

    if (budget) {
      budget.limitAmount = limitAmount;
      if (alertThreshold) budget.alertThreshold = alertThreshold;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId,
        category,
        limitAmount,
        month: monthVal,
        year: yearVal,
        alertThreshold: alertThreshold || 0.8
      });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

export const getBudgetSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const budgets = await Budget.find({ userId, month, year });

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
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    const summary = budgets.map(b => {
      const expense = expenses.find(e => e._id === b.category);
      const spent = expense ? expense.totalSpent : 0;
      
      return {
        id: b.id,
        category: b.category,
        limitAmount: b.limitAmount,
        spent,
        remaining: Number(b.limitAmount) - spent,
        percentUsed: (spent / Number(b.limitAmount)) * 100,
        alertThreshold: b.alertThreshold
      };
    });

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};
