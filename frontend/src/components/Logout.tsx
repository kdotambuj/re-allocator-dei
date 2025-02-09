import { useAppDispatch } from "@/lib/store/hooks"
import { LogOut} from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { clearUser } from "@/lib/store/features/user/userSlice"
import Cookies from "js-cookie"



const Logout = ()=>{

    const dispatch = useAppDispatch()
    const router = useRouter()


    const handleLogout = ()=>{
        router.push('/auth/login')
        Cookies.remove('jwt');
        dispatch(clearUser())
    }



    return (
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-black hover:bg-red-600 hover:text-white">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
   
    )


}

export default Logout