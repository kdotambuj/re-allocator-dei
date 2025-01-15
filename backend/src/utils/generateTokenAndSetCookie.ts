import jwt from 'jsonwebtoken';
import { Response } from 'express';

interface User {
  id: string;
  role: string;
  [key: string]: any; // Allows additional fields
}

const generateTokenAndSetCookie = (user: User, res: Response): void => {
  const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

  if (JWT_SECRET === "default-secret-key" && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is not set!");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '24h',
  });

  const { password, ...userWithoutSensitiveData } = user;

 // HTTP-only cookie
  res
    .cookie('jwt', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false, // Prevent XSS attacks
      sameSite: 'strict', // Prevent CSRF attacks
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    })
    .status(200)
    .json({
      success: true,
      data: {
        user: userWithoutSensitiveData,
        token,
      },
      message: "Signed in successfully",
    });
};

export default generateTokenAndSetCookie;