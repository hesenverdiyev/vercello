import mongoose from 'mongoose';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';


const createUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase().trim();
    const user = await User.create(req.body);

    const token = createToken(user._id);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 720,
    });

    req.session.authenticated = true;
    const returnTo = req.session.returnTo || '/';

    res.status(201).json({
      message: 'success',
      returnTo
    });
  } catch (error) {
    console.log('ERROR', error);

    let errors2 = {};

    if (error.code === 11000) {
      errors2.email = 'Bu email ile daha önce kayıt yapılmış';
    }

    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach((key) => {
        errors2[key] = error.errors[key].message;
      });
    }

    res.status(400).json(errors2);
  }
};


const UserFromFacebook = async (req, res) => {
  try {
    const code = req.query.code;
    const accessTokenResponse = await axios.post('https://graph.facebook.com/v13.0/oauth/access_token', {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: process.env.FACEBOOK_APP_CALLBACKURL,
      code: code,
    });
    const accessToken = accessTokenResponse.data.access_token;
    const profileResponse = await axios.get(`https://graph.facebook.com/v13.0/me?fields=email,location,hometown&access_token=${accessToken}`);
    
    let cityfrom = 'belirtilmemis';
    if (profileResponse.data.location && profileResponse.data.location.name) {
      cityfrom = profileResponse.data.location.name.toLowerCase();
    } else if (profileResponse.data.hometown && profileResponse.data.hometown.name) {
      cityfrom = profileResponse.data.hometown.name.toLowerCase();
    }
    const email = profileResponse.data.email;
    const password = profileResponse.data.id;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // User already exists, log them in
      const token = createToken(existingUser._id);

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 720,
      });

      res.redirect('/');
    }else{
    const user = await User.create({ cityfrom, email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 720,
    });
    res.status(201).redirect('/');
  }
  } catch (error) {
    console.log('ERROR', error);
    res.status(400).json({
      message: 'Error',
    });
  }
};



const loginUser = async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase().trim();
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succeeded: false,
        error: 'Böyle bir kullanıcı bulunmadı',
      });
    }

    if (same) {
      const token = createToken(user._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 720,
      });

      res.json({
        succeeded: true,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        succeeded: false,
        error: 'Şifre yanlış',
      });
    }
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};


export const createToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  return token;
};



const resetPassword = async (req, res) => {

  const { email, newPassword, otpCode } = req.body;

  const user = await User.findByEmail(email);

  const otp = await OTP.findOne({ email, otp: otpCode });

  if (!otp) {
    res.status(400).send('Invalid or expired OTP code');
    return;
  }

  await user.changePassword(newPassword);

  res.status(200).send('Password updated successfully');
};

export {
  createUser,
  loginUser,
  resetPassword,
  UserFromFacebook,
};
