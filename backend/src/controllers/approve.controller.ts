import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient();





export const approveTicket = async (req:Request,res:Response):Promise<any>=>{


    try {


        const {hodId,ticketId} = req.params;


          // Find the ticket
          const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { resource: true, department: true }
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Check if the ticket is already approved/rejected
        if (ticket.status !== "PENDING") {
            return res.status(400).json({ success: false, message: "Ticket is already processed" });
        }

        // Ensure HOD belongs to the correct department
        const department = await prisma.department.findUnique({
            where: { id: ticket.departmentId },
        });

        if (!department || department.hodId !== hodId) {
            return res.status(403).json({ success: false, message: "You are not authorized to approve this ticket" });
        }

        // Check if enough resources are available
        if (ticket.resource.quantity < ticket.requestedQuantity) {
            return res.status(400).json({ success: false, message: "Not enough resources available" });
        }

        // Approve the ticket and update resource quantity
        await prisma.$transaction([
            prisma.ticket.update({
                where: { id: ticketId },
                data: { status: "APPROVED" },
            }),
            prisma.approval.create({
                data: {
                    ticketId,
                    hodId,
                    status: "APPROVED",
                },
            }),
        ]);

        return res.status(200).json({ success: true, message: "Ticket approved successfully" });

    }

    catch (error){

        console.log(error);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}



export const completeTicket = async(req:Request,res:Response):Promise<any>=>{

    try {

        const {ticketId} = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        if (ticket.status !== "APPROVED") {
            return res.status(400).json({ success: false, message: "Ticket is not approved" });
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "COMPLETED" },
        });

        return res.status(200).json({ success: true, message: "Ticket completed successfully" });

    }
    catch (error){
        
        console.log(error);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }

}


export const rejectTicket = async(req:Request,res:Response):Promise<any>=>{

    try{
        
        const {ticketId} = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
        });

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        if (ticket.status !== "PENDING") {
            return res.status(400).json({ success: false, message: "Ticket is already processed" });
        }

        await prisma.ticket.update({
            where: { id: ticketId },
            data: { status: "REJECTED" },
        });

        return res.status(200).json({ success: true, message: "Ticket rejected successfully" });

    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Internal Server Error"})

    }


}