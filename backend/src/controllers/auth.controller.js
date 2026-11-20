import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import walletService from '../services/wallet.service.js';
import env from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'An account with this email address already exists.',
          requestId: req.id,
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
    });
    await user.save();

    // Create wallet with initial 0 balance
    const wallet = await walletService.getOrCreateWallet(user._id);

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      wallet: wallet.balances,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Invalid email or password.',
          requestId: req.id,
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Invalid email or password.',
          requestId: req.id,
        },
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_NOT_ELIGIBLE',
          message: 'This account has been suspended.',
          requestId: req.id,
        },
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const wallet = await walletService.getOrCreateWallet(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      wallet: wallet.balances,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const wallet = await walletService.getOrCreateWallet(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
      },
      wallet: wallet.balances,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  getMe,
};
