import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Health' | 'Entertainment' | 'Other';
  limitAmount: number;
  month: number;
  year: number;
  alertThreshold: number;
}

const BudgetSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Other'],
    required: true,
  },
  limitAmount: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  alertThreshold: {
    type: Number,
    default: 0.80, // 80%
  },
}, {
  timestamps: false,
});

BudgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

// We transform _id to id when serializing to keep compatibility with existing frontend checks if needed
BudgetSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
