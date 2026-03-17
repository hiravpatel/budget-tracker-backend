import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  currency: string;
  notificationsEnabled: boolean;
  pushSubscription?: any;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
    maxlength: 3,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  pushSubscription: {
    type: Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', UserSchema);
