import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies.jwt;
    
    const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

    if (JWT_SECRET === "default-secret-key" && process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not set!");
    }
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new Error('User not found'));
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
};

// Role authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(new Error('Not authorized to access this route'));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
