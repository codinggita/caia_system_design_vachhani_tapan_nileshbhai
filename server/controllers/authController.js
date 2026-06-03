const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ============================================================
// ROUTE #1: Register a new user
// METHOD: POST
// ENDPOINT: /api/v1/auth/register
// ACCESS: Public
// ============================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // 3. Create user (password is auto-hashed via pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 5. Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 7. Respond (exclude password from response)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to register user',
    });
  }
};

// ============================================================
// ROUTE #2: Login user
// METHOD: POST
// ENDPOINT: /api/v1/auth/login
// ACCESS: Public
// ============================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // 2. Find user and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials — email not found',
      });
    }

    // 3. Compare passwords
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials — incorrect password',
      });
    }

    // 4. Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 5. Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Respond
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to login',
    });
  }
};

// ============================================================
// ROUTE #3: Logout user
// METHOD: POST
// ENDPOINT: /api/v1/auth/logout
// ACCESS: Private (requires auth)
// ============================================================
const logoutUser = async (req, res) => {
  try {
    // 1. Clear the refresh token from the database
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    });

    // 2. Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to logout',
    });
  }
};

// ============================================================
// ROUTE #4: Refresh JWT access token
// METHOD: POST
// ENDPOINT: /api/v1/auth/refresh-token
// ACCESS: Public (uses refresh token)
// ============================================================
const refreshToken = async (req, res) => {
  try {
    // 1. Get refresh token from body or cookies (trim whitespace from copy-paste)
    const incomingRefreshToken =
      (req.body.refreshToken || req.cookies?.refreshToken || '').trim();

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        error: 'No refresh token provided',
      });
    }

    // 2. Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is invalid or expired',
      });
    }

    // 3. Find user and check stored refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found — invalid refresh token',
      });
    }

    // DEBUG: Log both tokens to compare (remove in production)
    console.log('🔍 DB token:', user.refreshToken);
    console.log('🔍 Incoming token:', incomingRefreshToken);
    console.log('🔍 Match:', user.refreshToken === incomingRefreshToken);

    if (user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token has been revoked',
      });
    }

    // 4. Generate new token pair (token rotation)
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // 5. Update stored refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Set new cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to refresh token',
    });
  }
};

// ============================================================
// ROUTE #5: Fetch user profile
// METHOD: GET
// ENDPOINT: /api/v1/auth/profile
// ACCESS: Private (requires auth)
// ============================================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to fetch profile',
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getProfile,
};
