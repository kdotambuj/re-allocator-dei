'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Building2, Loader2, Mail, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Department {
  id: string
  name: string
  hod: {
    name: string
    email: string
  }
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(()=>{
    getDepartments()
  },[])
 

  const getDepartments = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<{ data: Department[] }>(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/departments`,
        { withCredentials: true }
      )
      setDepartments(response.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <h1 className="text-3xl font-bold mb-6">Departments</h1> */}
      </motion.div>

    

      {
        isLoading && <div className="flex h-[100vh] items-center justify-center">
             <Loader2 className="h-6 w-6 animate-spin text-red-600" />
             </div>
      }

      {departments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>HOD</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.id}</TableCell>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {department.hod.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      {department.hod.email}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  )
}

export default DepartmentsPage
