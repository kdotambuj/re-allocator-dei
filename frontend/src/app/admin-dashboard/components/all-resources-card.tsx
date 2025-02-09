"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MinusCircle, Search, Group } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { motion } from "framer-motion"

interface Department {
  id: number
  name: string
  hodId: string
  createdAt: string
  updatedAt: string
}

interface Resource {
  id: string
  name: string
  description: string
  type: string
  quantity: number
  available: boolean
  createdAt: string
  updatedAt: string
  departmentId: number
  department: Department
}

export default function AllResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingResources, setUpdatingResources] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(null)

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
      toast.error("Failed to fetch resources. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAvailabilityToggle = (id: string) => {
    setResources((prevResources) =>
      prevResources.map((resource) =>
        resource.id === id ? { ...resource, available: !resource.available } : resource,
      ),
    )
  }

  const handleQuantityChange = (id: string, change: number) => {
    setResources((prevResources) =>
      prevResources.map((resource) =>
        resource.id === id ? { ...resource, quantity: Math.max(0, resource.quantity + change) } : resource,
      ),
    )
  }

  const handleUpdate = async (resource: Resource) => {
    setUpdatingResources((prev) => new Set(prev).add(resource.id))
    try {
      const updatingResource = {
        id: resource.id,
        quantity: resource.quantity,
        available: resource.available,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/updateResource`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatingResource),
      })

      if (!response.ok) {
        throw new Error(`Failed to update resource: ${response.statusText}`)
      }

      const data = await response.json()
      toast.success(`${resource.name} has been updated.`)
      console.log("Updated resource:", data)
    } catch (error) {
      console.error("Error updating resource:", error)
      toast.error(`Failed to update ${resource.name}. Please try again.`)
    } finally {
      setUpdatingResources((prev) => {
        const newSet = new Set(prev)
        newSet.delete(resource.id)
        return newSet
      })
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
      <div className="text-center h-[100vh] flex gap-2 items-center justify-center bg-white text-black rounded-lg w-full py-10">
        Loading resources...
        <Group className=" animate-pulse" />
      </div>
    )
  }

  return (
    <Card className="w-full" id="resources">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">All Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Select
              value={departmentFilter || "All Departments"}
              onValueChange={(value) => setDepartmentFilter(value === "All Departments" ? null : value)}
            >
              <SelectTrigger className="w-[200px]">
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
              <SelectTrigger className="w-[200px]">
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
              <SelectTrigger className="w-[200px]">
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
          <motion.div variants={container} initial="hidden" animate="show">
            {filteredResources.map((resource) => (
              <motion.div key={resource.id} variants={item}>
                <Card key={resource.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{resource.name}</h3>
                        <p className="text-sm text-gray-500">{resource.type}</p>
                        <p className="text-sm text-gray-500">{resource.department.name} Department</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Available</span>
                        <Switch
                          checked={resource.available}
                          onCheckedChange={() => handleAvailabilityToggle(resource.id)}
                          className="bg-green-500 data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(resource.id, -1)}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={resource.quantity}
                          onChange={(e) =>
                            handleQuantityChange(resource.id, Number.parseInt(e.target.value) - resource.quantity)
                          }
                          className="w-20 mx-2 text-center"
                        />
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(resource.id, 1)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button onClick={() => handleUpdate(resource)} disabled={updatingResources.has(resource.id)}>
                        {updatingResources.has(resource.id) ? "Updating..." : "Update"}
                      </Button>
                    </div>
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

