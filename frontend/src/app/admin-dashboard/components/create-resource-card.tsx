"use client"

import { useState } from "react"
import axios from "axios"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Projector, FileText, Box, Building2, Hash, ToggleLeft, Loader2, Package2, Package } from "lucide-react"
import toast from "react-hot-toast"
import Error from "next/error"

const departments = [
  { id: 1, name: "ELECTRICAL" },
  { id: 2, name: "MECHANICAL" },
  { id: 3, name: "FOOTWEAR" },
  { id: 4, name: "CIVIL" },
  { id: 5, name: "AGRICULTURE" },
  { id: 6, name: "SCIENCE" },
  { id: 7, name: "ARTS" },
  { id: 8, name: "COMMERCE" },
  { id: 9, name: "SOCIAL_SCIENCE" },
]

const CreateResourceCard = () => {

  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    type: "",
    departmentId: "",
    quantity: "",
    available: true,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setNewResource((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true)
    event.preventDefault();
  
    if (!newResource.departmentId) {
      toast.error("Please select a department.");
      return;
    }
  
    try {
      const newResourceTobeAdded = {
        ...newResource,
        departmentId: parseInt(newResource.departmentId),
        quantity: parseInt(newResource.quantity),
      };
  
      console.log(newResourceTobeAdded);
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/createResource`,
        newResourceTobeAdded,
        { withCredentials: true }
      );
  
      toast.success("Resource created successfully");
  
      // Reset form
      setNewResource({
        name: "",
        description: "",
        type: "",
        departmentId: "",
        quantity: "",
        available: true,
      });
  
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong. Please try again.";
      
      toast.error(errorMessage);
      console.error("Error creating resource:", error);
    }
    finally{
      setLoading(false)
    }
  };
  

  return (
    <Card className="w-full max-w-md" id="create-resource">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Resource</CardTitle>
        <CardDescription>Add a new resource to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Projector className="w-4 h-4" />
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Projector"
              value={newResource.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="High-resolution projector for presentations"
              value={newResource.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Type
            </Label>
            <Input
              id="type"
              name="type"
              placeholder="e.g. Electronic"
              value={newResource.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Department
            </Label>
            <Select
              name="departmentId"
              required
              value={newResource.departmentId}
              onValueChange={(value) => { setNewResource((prev) => ({ ...prev, departmentId: value })) }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Quantity
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={newResource.quantity}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              name="available"
              checked={newResource.available}
              onCheckedChange={(checked) =>
                setNewResource((prev) => ({ ...prev, available: checked }))
              }
              className="bg-green-500 data-[state=checked]:bg-green-600"
            />

            <Label htmlFor="available" className="flex items-center gap-2">

              Available
            </Label>
          </div>

          <Button type="submit" className="w-full bg-red-600">
           {loading?<Package className="animate-spin"/>:"Create Resource"} 
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateResourceCard
