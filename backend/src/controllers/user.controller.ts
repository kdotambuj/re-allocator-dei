import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {z} from "zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const createUserSchema = z.object({
    name: z.string().min(2,"Name must be atleast 2 characters long"),
    email: z.string().email("Invalid Email Format").nonempty("Email must be there"),
    password: z.string().min(6,"Password must be atleast 6 characters long"),
    role: z.enum(["ADMIN","STUDENT","PROFESSOR","LAB_ASSISTANT","HOD"]),
})


export const createUser = async (req: Request, res: Response):Promise<any> => {

    try{
        const parsed  = createUserSchema.safeParse(req.body);
        if (!parsed.success){
            return res.status(400).json({ success: false, error: parsed.error.errors })
        } 

        const {name,email,password,role} = parsed.data;

        const existingUser = await prisma.user.findUnique({
            where:{ email }
        });

        if (existingUser){
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            },
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        return res.status(201).json({ success: true, data: newUser, message: "User created successfully" });




        

    }
    catch(error){
        console.error("Error in createUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}