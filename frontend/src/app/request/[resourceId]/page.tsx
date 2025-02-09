"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { FolderSync, Loader2, Clock, User, Briefcase, Package, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAppSelector } from "@/lib/store/hooks"
import { format, parse, addHours } from "date-fns"
import { Calendar } from "@/components/ui/calendar"

// Utility functions
const generateTimeSlots = () => {
  const slots = []
  const start = parse("08:00", "HH:mm", new Date())
  const end = parse("20:00", "HH:mm", new Date())
  let current = start

  while (current < end) {
    const slotEnd = addHours(current, 1)
    slots.push(`${format(current, "HH:mm")} - ${format(slotEnd, "HH:mm")}`)
    current = slotEnd
  }

  return slots
}

const TIME_SLOTS = generateTimeSlots()

interface Resource {
  id: string
  name: string
  description: string
  quantity: number
  available: boolean
  departmentId: string
  department: {
    name: string
    hod: {
      name: string
    }
  }
}

interface Availability {
  [key: string]: number
}

const RequestPage = () => {
  const [loading, setLoading] = useState(true)
  const [resource, setResource] = useState<Resource | null>(null)
  const [quantity, setQuantity] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [availability, setAvailability] = useState<Availability>({})
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const { resourceId } = useParams()
  const router = useRouter()
  const user = useAppSelector((state) => state.user)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getResource = async () => {
    try {
      const response = await axios.get<{ data: Resource }>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/resource/${resourceId}`,
        { withCredentials: true },
      )
      setResource(response.data.data)
    } catch (error) {
      console.error("Error fetching resource:", error)
      toast.error("Failed to fetch resource. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async () => {
    try {
      var date = format(selectedDate || new Date(), "yyyy-MM-dd")
     

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/availability/${resourceId}/${date}`,
        { withCredentials: true },
      )
      const availabilityData = response?.data?.availability
    

      // Initialize availability for all time slots
      const initialAvailability: Availability = {}

      TIME_SLOTS.forEach((slot) => {
        initialAvailability[slot] = availabilityData[slot] || 0
      })

      setAvailability(initialAvailability)
    } catch (error) {
      console.error("Error fetching availability:", error)
      toast.error("Failed to fetch availability. Please try again.")
    }
  }

  const handleSelectedDate = (date: Date | undefined) => {
    setSelectedDate(date)
    console.log(date)
  }

  const handleSlotSelection = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      // If deselecting, remove it from selection
      const updatedSlots = selectedSlots.filter((s) => s !== slot);
  
      // If no slots left, reset everything
      if (updatedSlots.length === 0) {
        setSelectedSlots([]);
        setStartTime("");
        setEndTime("");
        return;
      }
  
      // Check if remaining slots are continuous
      let isContinuous = true;
      for (let i = 1; i < updatedSlots.length; i++) {
        const prevEnd = updatedSlots[i - 1].split(" - ")[1];
        const currentStart = updatedSlots[i].split(" - ")[0];
  
        if (prevEnd !== currentStart) {
          isContinuous = false;
          break;
        }
      }
  
      if (!isContinuous) {
        // If discontinuity found, reset selection to only the clicked slot
        setSelectedSlots([slot]);
        setStartTime(slot.split(" - ")[0]);
        setEndTime(slot.split(" - ")[1]);
        return;
      }
  
      // If still continuous, update selection
      setSelectedSlots(updatedSlots);
      setStartTime(updatedSlots[0].split(" - ")[0]);
      setEndTime(updatedSlots[updatedSlots.length - 1].split(" - ")[1]);
  
      return;
    }
  
    // Ensure continuity when adding new slots
    if (selectedSlots.length > 0) {
      const lastSelected = selectedSlots[selectedSlots.length - 1];
      const lastEndTime = lastSelected.split(" - ")[1];
  
      const [newStartTime, newEndTime] = slot.split(" - ");
  
      if (lastEndTime !== newStartTime) {
        toast.error("You can only select continuous time slots.");
        return;
      }
    }
  
    // Add slot and update time range
    const updatedSlots = [...selectedSlots, slot].sort();
    setSelectedSlots(updatedSlots);
    setStartTime(updatedSlots[0].split(" - ")[0]);
    setEndTime(updatedSlots[updatedSlots.length - 1].split(" - ")[1]);
  };
  
  

  useEffect(() => {
    fetchAvailability()
  }, [selectedDate])

  useEffect(() => {
    getResource()
  }, [resourceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (!resource || selectedSlots.length === 0) {
      toast.error("Please select a time slot")
      setSubmitting(false)
      return
    }

    const requestedQuantity = Number(quantity)
    if (requestedQuantity <= 0 || requestedQuantity > resource.quantity) {
      toast.error("Invalid quantity")
      setSubmitting(false)
      return
    }

    const selectedSlot = selectedSlots[0] // Assuming only one slot can be selected for now

    if (!availability[selectedSlot] || availability[selectedSlot] < requestedQuantity) {
      toast.error("Requested quantity is not available for the selected time slot")
      setSubmitting(false)
      return
    }

    try {
      const [startTime, endTime] = selectedSlot.split(" - ")

      const startTimeISO = format(new Date(selectedDate || new Date()), "yyyy-MM-dd") + "T" + startTime + ":00"
      const endTimeISO = format(new Date(selectedDate || new Date()), "yyyy-MM-dd") + "T" + endTime + ":00"



      const ticketDetails = {
        userId: user.id,
        departmentId: resource.departmentId,
        requestedQuantity,
        startTime: startTimeISO,
        endTime: endTimeISO,
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/createTicket/${resourceId}`,
        ticketDetails,
        { withCredentials: true },
      )

      console.log(response.data)
      toast.success(response.data.message)
      router.push("/student-dashboard")
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error("Failed to submit request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin h-8 w-8 text-red-600" />
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-center text-red-600 text-sm">Resource not found</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-md border-red-100">
          <CardHeader className="bg-red-50 py-4">
            <CardTitle className="text-red-800 text-lg flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Request: {resource.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <Label className="text-red-700 text-xs flex items-center">
                  <Briefcase className="mr-1 h-3 w-3" /> Department
                </Label>
                <p className="text-gray-600 text-sm">{resource.department.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-red-700 text-xs flex items-center">
                  <Package className="mr-1 h-3 w-3" /> Available Quantity
                </Label>
                <p className="text-gray-600 text-sm">{resource.quantity}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-red-700 text-xs flex items-center">
                  {resource.available ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  Availability Status
                </Label>
                <p className="text-gray-600 text-sm">{resource.available ? "Available" : "Not Available"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-red-700 text-xs flex items-center">
                  <User className="mr-1 h-3 w-3" /> Department Head
                </Label>
                <p className="text-gray-600 text-sm">{resource.department.hod.name}</p>
              </div>
            </div>

            <div className="flex gap-10 justify-center items-center ">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => handleSelectedDate(date)}
                className="rounded-md border"
              />


              <div>
                <Label className="text-red-700 text-xs flex items-center">
                  <Clock className="mr-1 h-3 w-3" /> Available Time Slots
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      onClick={() => handleSlotSelection(slot)}
                      disabled={!availability[slot]}
                      className={`text-sm py-2 ${
                        selectedSlots.includes(slot) ? "bg-red-600 text-white hover:bg-red-600" : "bg-gray-100 hover:bg-red-600 hover:text-white text-gray-800"
                      }`}
                    >
                      {slot} ({availability[slot] || 0} available)
                    </Button>
                  ))}
                </div>
              </div>



            </div>

            

            <form onSubmit={handleSubmit} className="space-y-3">


              <div className="mt-4">
                <Label htmlFor="quantity" className="text-red-700 text-xs flex items-center">
                  <Package className="mr-1 h-3 w-3" /> Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                  max={resource.quantity}
                  required
                  className="border-red-200 focus:border-red-400 focus:ring-red-400 text-sm"
                />
              </div>




              
              {selectedSlots.length > 0 && (
                <div className="mt-4">
                  <Label className="text-red-700 text-xs flex items-center">
                    <Clock className="mr-1 h-3 w-3" /> Selected Time Range
                  </Label>
                  <p className="text-sm text-gray-600">
                    {startTime} - {endTime}
                  </p>
                </div>
              )}
              <Button
                type="submit"
                disabled={submitting || selectedSlots.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-sm py-2"
              >
                {submitting ? (
                  <>
                    <FolderSync className="mr-2 h-3 w-3 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FolderSync className="mr-2 h-3 w-3" />
                    Raise a Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default RequestPage

