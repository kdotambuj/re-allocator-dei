"use client"

import { useAppSelector } from "@/lib/store/hooks"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, CheckCircle, XCircle, CalendarCheck, Loader2, Rotate3D } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { set } from "date-fns"
import NoAccessPage from "../no-access/page"



interface Ticket {
    id: string;
    resource: {
        name: string;
    };
    user: {
        name: string;
    };
    departmentId: number;
    requestedQuantity: number;
    status: string;
    startTime: string;
    endTime: string;
    dateRequested: string;
    createdAt: string;
}

const HodDashboard = () => {
  const user = useAppSelector((state) => state.user)
  const [tickets, setTickets] = useState([])
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("")


  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({status:false,message:""});

  if (user.role !== "HOD" && user.role !== "ADMIN") {
    return (
      <NoAccessPage />
    )
  }

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/tickets`, {
        withCredentials: true,
      })
      setTickets(response.data.tickets)
    } catch (error) {
      console.error(error)
    }
    finally {
        setLoading(false)
        }
  }

  useEffect(() => {
    fetchTickets()
  }, [user.departmentId])

  const handleApproveTicket = async (ticketId:string) => {
    try {
        setUpdatingStatus((prev)=>({...prev,status:true,message:"Approving Ticket"}))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/approve/${user.id}/${ticketId}`, {}, {withCredentials:true})
        toast.success(response.data.message)
        fetchTickets()
    } catch (error) {
      console.error(error)
    }
    finally {
        setUpdatingStatus((prev)=>({...prev,status:false,message:""}))
    }
  }

  const handleRejectTicket = async (ticketId:string) => {
    try {
        
        setUpdatingStatus((prev)=>({...prev,status:true,message:"Rejecting Ticket"}))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/reject/${ticketId}`, {}, {withCredentials:true})
        toast.success(response.data.message)
        fetchTickets()
    } catch (error) {
      console.error(error)
    }
    finally{
        setUpdatingStatus((prev)=>({...prev,status:false,message:""}))
    }
  }

  const handleCompleteTicket = async (ticketId:string) => {
    try {
        setUpdatingStatus((prev)=>({...prev,status:true,message:"Completing Ticket"}))
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/complete/${ticketId}`, {}, {withCredentials:true})
        toast.success(response.data.message)
     
      fetchTickets()
    } catch (error) {
      console.error(error)
    }
    finally{
        setUpdatingStatus((prev)=>({...prev,status:false,message:""}))
    }
  }

  const filteredTickets = tickets.filter(
    (ticket:Ticket) =>
      ticket.departmentId === user.departmentId &&
      (statusFilter === "ALL" || ticket.status === statusFilter) &&
      (searchQuery === "" ||
        ticket.resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()))  
      )


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  

  return (

    
    !updatingStatus.status?<motion.div className="container mx-auto p-6" initial="hidden" animate="visible" variants={containerVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">HOD Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by resource or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 border-gray-200 focus:border-gray-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-8 border-gray-200 focus:border-gray-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm">Resource</TableHead>
                  <TableHead className="text-sm">Requested By</TableHead>
                  <TableHead className="text-sm">Quantity</TableHead>
                  <TableHead className="text-sm">Status</TableHead>
                  <TableHead className="text-sm">Date Requested</TableHead>
                  <TableHead className="text-sm">Time Slot</TableHead>
                  <TableHead className="text-sm">Created At</TableHead>
                  <TableHead className="text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket:Ticket, index) => (
                  <motion.tr
                    key={ticket.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <TableCell className="text-sm">{ticket?.resource?.name}</TableCell>
                    <TableCell className="text-sm">{ticket?.user?.name}</TableCell>
                    <TableCell className="text-sm">{ticket?.requestedQuantity}</TableCell>
                    <TableCell className="text-sm">
                      <Badge
                        variant={
                          ticket?.status === "APPROVED"
                            ? "default"
                            : ticket?.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {ticket?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{ticket.dateRequested}</TableCell>
                    <TableCell className="text-sm">
                      {ticket.startTime} - {ticket.endTime}
                    </TableCell>
                    <TableCell className="text-sm">{new Date(ticket.createdAt).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex space-x-2">
                        {ticket.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveTicket(ticket.id)}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectTicket(ticket.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {ticket.status === "APPROVED" && (


                         
                          < Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteTicket(ticket.id)}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <CalendarCheck className="h-4 w-4 mr-1" />
                            Mark as Completed
                          </Button>


                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
    
              
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center mt-4">
            {loading &&  <Loader2 className="animate-spin" /> }
            </div>
        </CardContent>
      </Card>
    </motion.div>
    :
    <div className="flex justify-center items-center h-screen gap-4 ">
         <Rotate3D className="animate-spin " />
        <p className="text-gray-500 text-sm ml-2">{updatingStatus.message}</p>
    </div>


    



  )
}

export default HodDashboard