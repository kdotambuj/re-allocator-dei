import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

import {z} from 'zod'



const createDepartmentSchema = z.object({
    id:z.number().int("Number only").positive(),
    name: z.string().nonempty("Name must be there"),
    hodId: z.string().nonempty("HodId must be there")
})



const prisma =  new PrismaClient()

export const createDepartment = async (req:Request,res:Response):Promise<any>=>{


    try {

      const parsed = createDepartmentSchema.safeParse(req.body);
      if (!parsed.success) {
          return res.status(400).json({ success: false, error: parsed.error.errors });
      }

      const {id,name,hodId} = parsed.data;

      const existingDepartment = await prisma.department.findUnique({
          where:{hodId}
      })

      if (existingDepartment){
          return res.status(400).json({ success: false, message: "Department already exists with this hodId" });
      }


      const newDepartment = await prisma.department.create({
          data:{
              id,
              name,
              hodId
          },
          select:{
              id:true,
              name:true,
              hodId:true,
              createdAt:true
          }
      })


      return res.status(201).json({ success: true, data: newDepartment, message: "Department created successfully" });

    }

    catch(error){
        console.error("Error in signin controller:", (error as Error).message);
        res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
}
}





export const getAllDepartments = async (req:Request,res:Response):Promise<any>=>{

    try{
        const departments = await prisma.department.findMany({
            select:{
                id:true,
                name:true,
                hodId:true,
                createdAt:true
            }
        });


        if (!departments){
            return res.status(404).json({ success: false, message: "No departments found" });
        }

        return res.status(200).json({ success: true, data: departments });

    }
    catch(error){
        console.error("Error in getAllDepartments:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}


export const getDepartmentById = async (req:Request,res:Response):Promise<any>=>{

    try{

        const {id} = req.params;

        const department = await prisma.department.findUnique({
            where:{id:Number(id)},
            include:{
                hod:{
                    select:{
                        name:true,
                        email:true
                    }
                }
            }
        });

        if (!department){
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        return res.status(200).json({ success: true, data: department });

    }
    catch(error){
        console.error("Error in getDepartmentById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}
