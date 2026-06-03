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
    const { role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

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
// ROUTE #6: Update user profile
// METHOD: PATCH
// ENDPOINT: /api/v1/auth/profile
// ACCESS: Private (requires auth)
// ============================================================
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Build update object with only allowed fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;

    // Prevent updating sensitive fields through this route
    if (req.body.password || req.body.email || req.body.role) {
      return res.status(400).json({
        success: false,
        error: 'Cannot update password, email, or role through this route',
      });
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one field to update (name, avatar)',
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to update profile',
    });
  }
};

// ============================================================
// ROUTE #7: Delete user profile (account)
// METHOD: DELETE
// ENDPOINT: /api/v1/auth/profile
// ACCESS: Private (requires auth)
// ============================================================
const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Clear auth cookies
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
      message: 'Account deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to delete account',
    });
  }
};

// ============================================================
// ROUTE #8: Forgot password — generate reset token
// METHOD: POST
// ENDPOINT: /api/v1/auth/forgot-password
// ACCESS: Public
// ============================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address',
      });
    }

    // Generate a 6-digit reset code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the reset token before storing in DB
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token and expiry (10 minutes) to user document
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // In production, you would send this via email
    // For now, return the token in the response for testing
    res.status(200).json({
      success: true,
      message: 'Password reset token generated. In production, this would be sent via email.',
      resetToken,
      expiresIn: '10 minutes',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to process forgot password request',
    });
  }
};

// ============================================================
// ROUTE #9: Reset password — validate token and set new password
// METHOD: POST
// ENDPOINT: /api/v1/auth/reset-password
// ACCESS: Public
// ============================================================
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email, resetToken, and newPassword',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    // Hash the incoming token to compare with stored hash
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Find user with matching email, valid reset token, and non-expired token
    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Set new password (will be auto-hashed by pre-save hook)
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to reset password',
    });
  }
};

// ============================================================
// ROUTE #10: Verify email — generate or validate verification token
// METHOD: POST
// ENDPOINT: /api/v1/auth/verify-email
// ACCESS: Private (requires auth)
// ============================================================
const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.body;

    // ---- CASE 1: No token provided → Generate a new verification token ----
    if (!verificationToken) {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified',
        });
      }

      // Generate a 6-digit verification code
      const token = Math.floor(100000 + Math.random() * 900000).toString();

      const crypto = require('crypto');
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save({ validateBeforeSave: false });

      // In production, send this via email
      return res.status(200).json({
        success: true,
        message: 'Verification token generated. In production, this would be sent via email.',
        verificationToken: token,
        expiresIn: '15 minutes',
      });
    }

    // ---- CASE 2: Token provided → Verify the email ----
    const crypto = require('crypto');
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const user = await User.findOne({
      _id: req.user._id,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to verify email',
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
  updateProfile,
  deleteProfile,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
