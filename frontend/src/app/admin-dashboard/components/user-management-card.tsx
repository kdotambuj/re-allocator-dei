"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, ChevronUp, ChevronDown,Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";




interface User {
  id: string
  name: string
  email: string
  role: string
  departmentId: string
  department: {
    name: string
  }
}

type SortKey = "name" | "email" | "role" | "department"

export default function UserManagementCard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filterRole, setFilterRole] = useState("All Roles");
const [filterDepartment, setFilterDepartment] = useState("All Departments");

const [isLoading, setIsLoading] = useState(false);

const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    departmentId: "",
  });


const fetchAllUsers = async () => {
    try {

        setIsLoading(true);
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/getAllUsers`, {
        withCredentials: true,
      });
      const sortedUsers = response.data.data.sort((a:any, b:any) =>
        a.name.localeCompare(b.name)
      );
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    finally{
        setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
        (user) =>
          (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (filterRole === "All Roles" || user.role === filterRole) &&
          (filterDepartment === "All Departments" || user.department?.name === filterDepartment)
      );
      

    const sorted = [...filtered].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    setFilteredUsers(sorted)
  }, [users, searchTerm, sortKey, sortOrder, filterRole, filterDepartment])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }


 const createUser = async ()=>{
    try {
        setIsLoading(true);

        console.log({...newUser, departmentId: parseInt(newUser.departmentId)});
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/createUser`, {
            ...newUser,
            departmentId: parseInt(newUser.departmentId)
        },
        {
            withCredentials: true
        }
    );


        fetchAllUsers();

        toast.success('User created successfully');

        setNewUser({
            name: "",
            email: "",
            password: "",
            role: "",
            departmentId: "",
        })




    }
    catch(error){
        console.log(error);

    }
    finally{
        setIsLoading(false);
    }
 }




  

  const roles = Array.from(new Set(users.map((user) => user.role)))
  const departments = Array.from(new Set(users.map((user) => user.department?.name)))

  return (
    <div className="h-[80vh]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card id='user-dashboard'>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle  className="text-2xl">Admin Dashboard</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createUser();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">STUDENT</SelectItem>
                        <SelectItem value="HOD">HOD</SelectItem>
                        <SelectItem value="PROFESSOR">PROFESSOR</SelectItem>
                        <SelectItem value="LAB_ASSISTANT">LAB_ASSISTANT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="departmentId">Department</Label>
                    <Select
                      value={newUser.departmentId}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, departmentId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Electrical</SelectItem>
                        <SelectItem value="2">Mechanical</SelectItem>
                        <SelectItem value="3">Footwear</SelectItem>
                        <SelectItem value="4">Civil</SelectItem>
                        <SelectItem value="5">Agriculture</SelectItem>
                        <SelectItem value="6">Science</SelectItem>
                        <SelectItem value="7">Arts</SelectItem>
                        <SelectItem value="8">Commerce</SelectItem>
                        <SelectItem value="9">Social Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    {isLoading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
  
          <CardDescription>Manage users and their roles</CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[60vh]">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Select
              value={filterRole}
              onValueChange={(value) => setFilterRole(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterDepartment}
              onValueChange={(value) => setFilterDepartment(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                {departments?.map((dept,index) => (
                  <SelectItem key={index} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("name")}
                  className="cursor-pointer"
                >
                  Name{" "}
                  {sortKey === "name" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="inline" />
                    ) : (
                      <ChevronDown className="inline" />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("email")}
                  className="cursor-pointer"
                >
                  Email{" "}
                  {sortKey === "email" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="inline" />
                    ) : (
                      <ChevronDown className="inline" />
                    ))}
                </TableHead>
                <TableHead
                  onClick={() => handleSort("role")}
                  className="cursor-pointer"
                >
                  Role{" "}
                  {sortKey === "role" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="inline" />
                    ) : (
                      <ChevronDown className="inline" />
                    ))}
                </TableHead>
                <TableHead className="cursor-pointer">
                  Department{" "}
                  {sortKey === "department" &&
                    (sortOrder === "asc" ? (
                      <ChevronUp className="inline" />
                    ) : (
                      <ChevronDown className="inline" />
                    ))}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {isLoading && (
          <div>
            <div className="flex w-full justify-center items-center p-3 ">
              <Loader2Icon className="animate-spin" />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  </div>
  
  )
}

