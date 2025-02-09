'use client'

import { useAppSelector } from "@/lib/store/hooks";
import AllResources from "./components/all-resources.card"
import NoAccessPage from "../no-access/page";
import UserTickets from "./components/user-tickets";
import { StudentNavbar } from "./components/navbar";




const StudentDashboard = ()=>{


    const user = useAppSelector((state) => state.user);

    if (user.role !== "STUDENT" && user.role !== "ADMIN") {
        return <NoAccessPage />
    }



    return (


        <div>
            <StudentNavbar />
            <div className="flex flex-col gap-4 ">
            <AllResources/>
            <UserTickets />
            </div>
            
        </div>
    )
}

export default StudentDashboard