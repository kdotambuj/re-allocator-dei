"use client"

import { useAppSelector } from "@/lib/store/hooks"
import axios from "axios"
import { useEffect, useState } from "react"
import { Loader2, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Ticket {
  id: string
  resource: { name: string }
  requestedQuantity: number
  status: string
  departmentId: string
  startTime: string
  endTime: string
  createdAt: string
}

const CompactUserTickets = () => {
  const user = useAppSelector((state) => state.user)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/user-tickets/${user.id}`, {
          withCredentials: true,
        })
        setTickets(response.data.tickets)
        setError(null)
      } catch (error) {
        console.error(error)
        setError("Failed to fetch tickets. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserTickets()
  }, [user.id])

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-red-600">Your Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-16">
            <Loader2 className="h-6 w-6 animate-spin text-red-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-sm">{error}</div>
        ) : (
          <ScrollArea className="h-[400px]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="p-2">Resource</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Start</th>
                  <th className="p-2">End</th>
                  <th className="p-2">Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="p-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">{ticket.resource.name}</span>
                      </div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      <Badge
                        variant={ticket.status === "Approved" ? "default" : "secondary"}
                        className={`${ticket.status === "APPROVED" ? "bg-green-500" : ticket.status === "COMPLETED" ? "bg-green-500" : "bg-yellow-400"} text-white hover:text-black text-xs`}
                      >
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-2 whitespace-nowrap text-sm text-gray-500">{ticket.requestedQuantity}</td>
                    <td className="p-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="p-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="p-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default CompactUserTickets

