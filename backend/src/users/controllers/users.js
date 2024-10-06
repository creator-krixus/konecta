const userSchema = require('../models/users')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../models/users');
const mongoose = require('mongoose');
const { body, query, param, validationResult } = require('express-validator');
require('dotenv').config()

const roundSalt = 10;

const controller = {};

controller.createUser = [
  body('nombre').isString().trim().notEmpty().withMessage('Nombre is required'),
  body('email').isEmail().normalizeEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').exists().withMessage('Confirm Password is required'),
  body('role').optional().isString().trim(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const { nombre, email, password, confirmPassword, role } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ isOk: false, msg: 'Passwords do not match' });
      }

      const existingUser = await userSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ isOk: false, msg: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, roundSalt);

      const newUser = new userSchema({
        nombre,
        email,
        role,
        password: hashedPassword
      });

      await newUser.save();

      const token = jwt.sign({ nombre, email }, process.env.SIGNATURE, { expiresIn: 3600 });

      return res.status(201).json({
        isOk: true,
        msg: 'User created successfully',
        user: { nombre, email, role },
        token
      });

    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ isOk: false, msg: 'Internal server error' });
    }
  }
];


controller.loginUser = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email is not valid'),
  body('password')
    .exists()
    .withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await users.findOne({ email });
      if (!user) {
        return res.status(401).json({ isOk: false, msg: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ isOk: false, msg: "Invalid credentials" });
      }

      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.SIGNATURE,
        { expiresIn: 3600 }
      );

      const userResponse = {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        token
      };

      return res.status(200).json({ isOk: true, user: userResponse });

    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ isOk: false, msg: "Internal server error" });
    }
  }
];

controller.getAllUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const users = await userSchema.find();
      const count = await userSchema.countDocuments();

      return res.status(200).json({
        isOk: true,
        total: count,
        users,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ isOk: false, msg: "Error fetching users", error: error.message });
    }
  }
];

controller.getOneUser = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID');
      }
      return true;
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;

      const user = await userSchema.findById(id);

      if (!user) {
        return res.status(404).json({ isOk: false, msg: 'User not found' });
      }

      return res.status(200).json({ isOk: true, user });

    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ isOk: false, msg: 'Internal server error', error: error.message });
    }
  }
];


controller.updateUser = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID');
      }
      return true;
    }),

  body()
    .notEmpty()
    .withMessage('No data provided for update')
    .custom((value) => {
      if (value.nombre && typeof value.nombre !== 'string') {
        throw new Error('Nombre must be a string');
      }
      if (value.email && !/\S+@\S+\.\S+/.test(value.email)) {
        throw new Error('Email is not valid');
      }
      return true;
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await userSchema.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ isOk: false, msg: 'User not found' });
      }

      return res.status(200).json({
        isOk: true,
        msg: 'User updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ isOk: false, msg: 'Internal server error', error: error.message });
    }
  }
];


controller.deleteUser = [
  param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .custom(value => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid user ID');
      }
      return true;
    }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ isOk: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;

      const deletedUser = await userSchema.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ isOk: false, msg: 'User not found' });
      }

      return res.status(200).json({
        isOk: true,
        msg: 'User deleted successfully',
        user: deletedUser
      });

    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ isOk: false, msg: 'Internal server error', error: error.message });
    }
  }
];


module.exports = controller;