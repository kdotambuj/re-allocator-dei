import {Request, Response} from 'express';
import {z} from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie';


const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  });


const prisma = new PrismaClient();

export const signin = async (req: Request, res: Response):Promise<any> => {

    try {

        const parsed = signinSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }

        const { email, password } = parsed.data;


        const user = await prisma.user.findUnique({
            where: { email },
          });
      
          if (!user) {
            return res.status(401).json({
              success: false,
              message: "Invalid credentials",
            });
          }
      
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(401).json({
              success: false,
              message: "Invalid credentials",
            });
          }


          return generateTokenAndSetCookie(user, res);
    }

    catch(error){
        console.error("Error in signin controller:", (error as Error).message);
        res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
        

    }
}