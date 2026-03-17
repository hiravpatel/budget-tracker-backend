import { Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = { userId };
    
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    
    // Sort by date descending
    const transactions = await Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limit);
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { type, amount, category, note, date, tags } = req.body;

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      note,
      date: date || new Date(),
      tags
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user!.id });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user!.id });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user!.id });
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
