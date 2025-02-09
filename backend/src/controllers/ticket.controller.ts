import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";
import {z} from 'zod';

const prisma = new PrismaClient();



const createTicketSchema = z.object({
    userId: z.string().cuid(), // Ensures a valid cuid string
    departmentId: z.number().int("Should be a number").positive(), // Ensures a positive integer
    requestedQuantity: z.number().int("Should be a number").positive(), // Ensures a positive integer
    startTime: z.coerce.date(), // Ensures a valid date
    endTime: z.coerce.date()
  });


  export const createTicket = async (req: Request, res: Response):Promise<any>  => {
    try {
        // Validate request body
        const parsed = createTicketSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, error: parsed.error.errors });
        }

        const { resourceId } = req.params;
        const { userId, departmentId, requestedQuantity, startTime, endTime } = parsed.data;

        // Check if the resource exists and is available
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
        });

        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        if (!resource.available) {
            return res.status(400).json({ success: false, message: "Resource is currently unavailable" });
        }

        if (resource.quantity < requestedQuantity) {
            return res.status(400).json({ success: false, message: "Not enough resource quantity available" });
        }

        // Create a new ticket
        const ticket = await prisma.ticket.create({
            data: {
                userId,
                resourceId,
                departmentId,
                requestedQuantity,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                status: "PENDING",
            },
        });

        return res.status(201).json({ success: true, ticket,message:"Ticket created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getAllTickets = async (req:Request,res:Response):Promise<any>=>{
    try{

        const tickets = await prisma.ticket.findMany({
            include:{
                resource:true,
                user:true
            }
        })

        return res.status(200).json({success:true,tickets})

    }

    catch(error){
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export const getTicketById = async (req:Request,res:Response):Promise<any>=>{
    try{


        const {ticketId} = req.params;

        const ticket = await prisma.ticket.findUnique({
            where:{
                id:ticketId
            }
        })

        if (!ticket){
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }


        return res.status(200).json({success:true,ticket})

    }

    catch(error){
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export const getDailyAvailability = async (req: Request, res: Response):Promise<any> => {
    try {
        const { resourceId, date } = req.params; // Expect date in YYYY-MM-DD format
        const selectedDate = new Date(date);

        // Fetch approved tickets for the given day
        const tickets = await prisma.ticket.findMany({
            where: {
                resourceId,
                status: "APPROVED",
                startTime: { gte: selectedDate, lt: new Date(selectedDate.getTime() + 86400000) }, // Get tickets on that day
            },
            select: { startTime: true, endTime: true, requestedQuantity: true },
        });
 
        // Get total resource quantity
        const resource = await prisma.resource.findUnique({
            where: { id: resourceId },
            select: { quantity: true },
        });

        if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });

        // Generate time slots (e.g., every hour from 00:00 to 23:59)
        const timeSlots: Record<string, number> = {};
        for (let hour = 0; hour < 24; hour++) {
            const formattedHour = hour.toString().padStart(2, '0');
            const nextHour = (hour + 1).toString().padStart(2, '0');
            const timeKey = `${formattedHour}:00 - ${nextHour}:00`;
            timeSlots[timeKey] = resource.quantity; // Default availability
        }

        // Adjust availability based on bookings
        tickets.forEach(ticket => {
            const startHour = ticket.startTime.getHours();
            const endHour = ticket.endTime.getHours();

            for (let hour = startHour; hour < endHour; hour++) {
                const timeKey = `${hour}:00 - ${hour + 1}:00`;
                timeSlots[timeKey] -= ticket.requestedQuantity; // Reduce available count
            }
        });

        return res.status(200).json({ success: true, availability: timeSlots });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getTicketsByHodId = async (req:Request,res:Response):Promise<any>=>{

    try{

        const {hodId} = req.params;

        const tickets = await prisma.ticket.findMany({
            where:{
                department:{
                    hodId
                }
            },
            include:{
                resource:true,
                user:true
            }
        })

        return res.status(200).json({success:true,tickets})

    }

    catch(error){
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export const getTicketsByUserId = async (req:Request,res:Response):Promise<any>=>{

    try {
        
        const {userId} = req.params;

        const tickets = await prisma.ticket.findMany({
            where:{
                userId
                
            },
            include:{
                resource:true,
                user:true
            }
        })

        return res.status(201).json({success:true,tickets})
    }
    
    catch(error){
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}