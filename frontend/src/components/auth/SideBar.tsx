import { Home, Calendar, BarChart, BookOpen, Award, Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { motion } from "framer-motion"
import { Audiowide } from 'next/font/google'
import { Lexend } from 'next/font/google'

const lexend = Lexend({ subsets: ['latin'], weight: '400' })


export function Sidebar() {
  return (
    <aside className="w-[50%] bg-background hidden md:flex justify-center  border-r border-border h-screen sticky top-0 overflow-y-auto bg-white text-black">
      
    <div className='flex-col justify-center flex items-center h-[100vh]'>
        <div><Image
      src="/dei-logo.jpg"
      width={150}
      height={150}
      alt="DRDO LOGO"
      quality={100}
      priority
    /></div>
    


    <div className='flex items-center justify-center flex-col p-5'>

    <h1 className={`font-bold text-3xl ${lexend.className}`}>Re-allocator</h1>

      <h2 className='mt-5 font-bold text-xl'>Unlock Potential Through Smart Sharing.</h2>
     <h2 className='text-sm mt-3'>Resource Sharing & Management at ease</h2>
     </div>



</div>







      

    </aside>
  )
}

