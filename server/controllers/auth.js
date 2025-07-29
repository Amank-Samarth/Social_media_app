import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import path from 'path';

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    // Comprehensive input validation
    if (!firstName || firstName.length < 2 || firstName.length > 50) {
      return res.status(400).json({ error: "Invalid first name" });
    }
    if (!lastName || lastName.length < 2 || lastName.length > 50) {
      return res.status(400).json({ error: "Invalid last name" });
    }
    if (!email || email.length > 50 || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!password || password.length < 5) {
      return res.status(400).json({ error: "Password too short" });
    }
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }
    if (!occupation) {
      return res.status(400).json({ error: "Occupation is required" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Handle file upload separately with more robust checks
    let picturePath = '';
    if (req.file) {
      // Validate file type manually
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type', 
          details: 'Only JPEG, JPG, PNG, and GIF files are allowed',
          receivedType: req.file.mimetype
        });
      }

      // Construct full path for logging and frontend use
      picturePath = path.join('assets', req.file.filename);
      
      // Log image upload details
      console.log('Image uploaded:', {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: picturePath
      });
    } else {
      console.warn('No image uploaded during registration');
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends: friends || [],
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    try {
      const savedUser = await newUser.save();
      console.log('User saved successfully:', {
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName
      });
      
      // Remove password from response
      const userResponse = savedUser.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse
      });
    } catch (saveError) {
      console.error('Database save error:', saveError);
      
      // Handle specific Mongoose validation errors
      if (saveError.name === 'ValidationError') {
        const errors = Object.values(saveError.errors).map(err => err.message);
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: errors 
        });
      }

      // Generic database save error
      res.status(500).json({ 
        error: 'Failed to save user to database', 
        details: saveError.message 
      });
    }
  } catch (err) {
    console.error('Registration process error:', err);
    
    // Handle file upload errors
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ 
        error: 'Invalid file type', 
        details: 'Only JPEG, JPG, PNG, and GIF files are allowed' 
      });
    }

    res.status(500).json({ 
      error: 'Registration process failed', 
      details: err.message 
    });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body); // Log incoming login request

    const { email, password } = req.body;
    
    // Validate input
    if (!email) {
      console.warn('Login failed: Missing email');
      return res.status(400).json({ 
        msg: "Email is required", 
        error: "MISSING_EMAIL" 
      });
    }
    if (!password) {
      console.warn('Login failed: Missing password');
      return res.status(400).json({ 
        msg: "Password is required", 
        error: "MISSING_PASSWORD" 
      });
    }

    // Find user with more detailed logging
    const user = await User.findOne({ email: email });
    if (!user) {
      console.warn(`Login failed: User not found for email ${email}`);
      return res.status(400).json({ 
        msg: "User does not exist", 
        error: "USER_NOT_FOUND" 
      });
    }

    // Verify password with detailed logging
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`Login failed: Invalid credentials for email ${email}`);
      return res.status(400).json({ 
        msg: "Invalid credentials", 
        error: "INVALID_CREDENTIALS" 
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h' // Add token expiration
    });

    // Prepare user response (safely remove password)
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log(`Successful login for user: ${email}`);
    
    res.status(200).json({ 
      token, 
      user: userResponse,
      msg: "Login successful" 
    });
  } catch (err) {
    console.error('Login process error:', err);
    res.status(500).json({ 
      error: 'Login process failed', 
      details: err.message 
    });
  }
};
