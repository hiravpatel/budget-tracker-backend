import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, currency } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, name, currency: currency || 'USD' });

    res.status(201).json({ success: true, message: 'User registered successfully', user: { id: user._id.toString(), email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: { id: user._id.toString(), email: user.email, name: user.name, currency: user.currency }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { passwordHash });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
