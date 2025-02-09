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
    expiresIn: "24h",
  });

  const { password, ...userWithoutSensitiveData } = user;

  // Set HTTP-only secure cookie
  res
    .cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true, // Prevent JavaScript access
      sameSite: "none", // Allow cross-site requests
      secure: true, // Ensure HTTPS (Render uses HTTPS by default)
    })
    .status(200)
    .json({
      success: true,
      data: {
        user: userWithoutSensitiveData,
      },
      message: "Signed in successfully",
    });
};

export default generateTokenAndSetCookie;