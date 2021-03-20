import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../model/userModel';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    // 1. Create a User
    const user: IUser = await User.create({ email, password });

    // 2. Create JWT Token
    //    Do I need to set expires in ?

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!);

    // 3. Set token in cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      signed: true,
    });

    // 4. Send Response

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    // 1. Check if email or password exist
    if (!email || !password) {
      return next(new AppError('Email or Password is missing', 400));
    }

    // 2. Check if user exist in db
    const user: IUser | null = await User.findOne({ email }).select(
      '+password'
    );
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect Email or Password', 401));
    }

    // 2. Create JWT Token
    //    Do I need to set expires in ?

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!);

    // 3. Set token in cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "test",
      secure: true,
      signed: true,
    });

    // 4. Send Response

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Check if the the jwt token exist in cookie
  res.cookie('jwt', 'loggedOut');

  res.status(200).json({
    status: 'success',
  });
};

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if the the jwt token exist in cookie
    // const token = req.cookies.jwt;
    const token = req.signedCookies.jwt;
    if (!token) {
      return next(new AppError('You are not authorised', 401));
    }
    console.log(token);

    // 2. Verify if the token is correct
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    // 3. Send token
    // req.user =
    // res.locals.user =
    res.status(200).json({
      status: 'success',
      data: {
        currentUser: decoded,
      },
    });
  } catch (err) {
    next(err);
  }
};

//--------------------------------------//
//              UTILITY                 //
//--------------------------------------//
