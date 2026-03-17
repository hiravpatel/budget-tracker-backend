import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Health' | 'Entertainment' | 'Other';
  note?: string;
  date: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: String, // UUID from Postgres
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'],
    required: true,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
