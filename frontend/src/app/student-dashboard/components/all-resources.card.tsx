"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Search, ArrowRight, Group, CheckCircle, XCircle, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  name: string
  description: string
  type: string
  quantity: number
  available: boolean
  department: {
    name: string
  }
}

export default function AllResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null)

  const [isLoading,setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/resources`, {
        withCredentials: true,
      })
      setResources(response.data.data)
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment =
        !departmentFilter || departmentFilter === "All Departments" || resource.department.name === departmentFilter
      const matchesType = !typeFilter || typeFilter === "All Types" || resource.type === typeFilter
      const matchesAvailability = availabilityFilter === null || resource.available === availabilityFilter

      return matchesSearch && matchesDepartment && matchesType && matchesAvailability
    })
  }, [resources, searchQuery, departmentFilter, typeFilter, availabilityFilter])

  const departments = useMemo(() => {
    return Array.from(new Set(resources.map((resource) => resource.department.name)))
  }, [resources])

  const types = useMemo(() => {
    return Array.from(new Set(resources.map((resource) => resource.type)))
  }, [resources])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="text-center flex h-screen gap-2 items-center justify-center bg-red-50 text-red-700 rounded-lg w-full py-10">
        Loading resources...
        <Group className="animate-pulse" />
      </div>
    )
  }



  const handleRequestPage = async (resourceId: string) => {
    setIsLoading(true);

    router.push(`/request/${resourceId}`);
    setIsLoading(false);
  }





  return (
    <Card className="w-full bg-white" id="resources">
      <CardContent className="p-6">
        <div className="mb-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border-red-200 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Select
              value={departmentFilter || "All Departments"}
              onValueChange={(value) => setDepartmentFilter(value === "All Departments" ? null : value)}
            >
              <SelectTrigger className="w-[200px] border-red-200 focus:ring-red-500 focus:border-red-500">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={typeFilter || "All Types"}
              onValueChange={(value) => setTypeFilter(value === "All Types" ? null : value)}
            >
              <SelectTrigger className="w-[200px] border-red-200 focus:ring-red-500 focus:border-red-500">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={availabilityFilter === null ? "All" : availabilityFilter.toString()}
              onValueChange={(value) => setAvailabilityFilter(value === "All" ? null : value === "true")}
            >
              <SelectTrigger className="w-[200px] border-red-200 focus:ring-red-500 focus:border-red-500">
                <SelectValue placeholder="Filter by Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="true">Available</SelectItem>
                <SelectItem value="false">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="h-[600px] pr-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredResources.map((resource) => (
              <motion.div key={resource.id} variants={item}>
                <Card className="h-full bg-white border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-3 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                      <h3 className="text-xl font-semibold truncate">{resource.name}</h3>
                      <p className="text-medium text-gray-500 truncate">{resource.department.name}</p>
                     <p className="text-sm text-gray-500 truncate">{resource.type}</p>
                        
                        
                        <p className="text-xs text-gray-500 truncate">{resource.description}</p>
                       
                      </div>
                      <div
                        className={`text-sm font-medium ${resource.available ? "text-green-600" : "text-red-600"} flex items-center`}
                      >
                        {resource.available ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Unavailable
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 text-red-700">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">{resource.quantity}</span>
                      </div>
                    </div>
                    <Button
                      className="mt-2 w-full text-sm text-white bg-gradient-to-r from-black via-gray-500 to-black hover:bg-black"
                      onClick={()=>handleRequestPage(resource.id)}
                    >
                      
                      Request it
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

