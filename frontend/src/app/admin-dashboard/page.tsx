

'use client'

import { Toaster } from "react-hot-toast"
import CreateResourceCard from "./components/create-resource-card"
import UserManagementCard from "./components/user-management-card"
import AllResources from "./components/all-resources-card"
import { AdminNavbar } from "./components/navbar"
import { useAppSelector } from "@/lib/store/hooks"
import { stat } from "fs"
import NoAccessPage from "../no-access/page"


const AdminDashboard = () => {

    const user = useAppSelector((state) => state.user);


    if (user && user.role !== "ADMIN") {
        return <NoAccessPage />
    }




    return (
            
        <div className="flex flex-col gap-4  relative bg-slate-300" >
        <AdminNavbar />
            
            <div className="flex gap-4 p-4 mt-20">
            <CreateResourceCard/>
            <AllResources />
            </div>


            <div className="p-4 pt-0 pb-0">
            <UserManagementCard/>
            </div>

        </div>
        
    )


}

export default AdminDashboard