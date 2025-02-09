import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express"
import { availableMemory } from "process";
import {z} from 'zod'



const prisma = new PrismaClient();



const createResourceSchema = z.object({
    name: z.string().nonempty("Name must be there"),
    description: z.string().nonempty("Description must be there"),
    type:z.string().nonempty("Type must be there"),
    departmentId: z.number().int("Number only").positive(),
    quantity: z.number().int("Number only").positive(),
    available: z.boolean()
})


const updateResourceSchema = z.object({
    id:z.string().nonempty("Id must be there"),
    quantity: z.number().int("Number only").positive(),
    available: z.boolean()
})




export const createResource = async (req:Request,res:Response):Promise<any> => { 
    
    
    try{

        const parsed = createResourceSchema.safeParse(req.body);
        if (!parsed.success){
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }

        const {name,description,type,departmentId,quantity,available} = parsed.data;


        const addedResource = {name,description,type,departmentId,quantity,available};


        const existingResource = await prisma.resource.findUnique({
            where:{
                "department_resource":{name,departmentId}
            }
        })

        if (existingResource){
            return res.status(400).json({ success: false, message: "Resource already exists with this name in this department" });
        }



        const newResource = await prisma.resource.create({
            data:addedResource,
            include:{
                department:{
                    include:{
                        hod:true
                    }
                   
                }
            }
        })
        return res.status(201).json({ success: true, data: newResource, message: "Resource created successfully" });
    }

    catch(error){
        console.error("Error in createResource:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export const getResourceById = async (req:Request,res:Response):Promise<any> => {

    try {

        const {resourceId} = req.params;

        const resource = await prisma.resource.findUnique({
            where:{
                id:resourceId
            },
            include:{
                department:{
                    include:{
                        hod:true
                    }
                }
            }
        })

        if (!resource){
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        return res.status(200).json({ success: true, data: resource, message: "Resource fetched successfully" });

    }
    catch(error){
        console.error("Error in getResourceById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }



}



export const getAllResources = async (req:Request,res:Response):Promise<any> => {

    try {
        const resources = await prisma.resource.findMany({
            include:{
                department:true
            }
        })

        if (!resources){
            return res.status(404).json({ success: false, message: "No resources found" });
        }

        return res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" });

    }
    catch(error){   
        console.error("Error in getAllResources:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}



export const updateResource = async (req:Request,res:Response):Promise<any> => {

    try{

        const parsed = updateResourceSchema.safeParse(req.body);
        if (!parsed.success){
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }

        const {id,quantity,available} = parsed.data;

        const updatedResource = await prisma.resource.update({
            where:{
                id
            },
            data:{
                quantity,
                available
            },
            select:{
                id:true,
                name:true,
                description:true,
                type:true,
                departmentId:true,
                quantity:true,
                available:true
            }
        })

        return res.status(200).json({ success: true, data: updatedResource, message: "Resource updated successfully" });




    }
    catch (error){
        console.error("Error in createResource:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }


}



export const getResourcesByDepartmentId = async (req:Request,res:Response):Promise<any> => {


    try {

        const departmentId = parseInt(req.params.departmentId);

        const resources = await prisma.resource.findMany({
            where:{
                departmentId
            },

        })

        if (!resources){
            return res.status(404).json({ success: false, message: "No resources found" });
        }

        return res.status(200).json({ success: true, data: resources, message: "Resources fetched successfully" });

    }

    catch(error){
        console.error("Error in getResourcesByDepartmentId:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}