"use client"

import { useAppSelector } from "@/lib/store/hooks"
import { motion } from "framer-motion"
import { Box, Package, Share2 } from "lucide-react"
import { Lexend } from "next/font/google"
import Link from "next/link"


const lexend = Lexend({ subsets: ['latin'], weight: '400' })





export default function Header() {


  const user = useAppSelector((state) => state.user)

  var dashboardRoute = '/auth/login'

  switch (user.role) {
    case 'ADMIN':
      dashboardRoute = '/admin-dashboard'
      break
    case 'STUDENT':
      dashboardRoute = '/student-dashboard'
      break
    case 'HOD':
      dashboardRoute = '/hod-dashboard'
      break
    default:
      dashboardRoute = '/auth/login'
      break
  }




  return (
    <motion.header
      className="py-4 px-6 flex justify-between items-center border-b border-black"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="flex items-center space-x-2">
        <Package className="animate-bounce text-red-600 " size={32} />
        <span className={`font-extrabold text-xl  ${lexend.className}`}>Re-Allocator</span>
      </Link>
      <nav>
        <ul className="flex items-center gap-8">
        <li>
            <Link href={dashboardRoute} className="text-sm  hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="#features" className="text-sm  hover:underline">
              Features
            </Link>
          </li>
          <li>
            <Link href="/departments" className="text-sm hover:underline">
              Departments
            </Link>
          </li>
          <li>
            <Link href="/auth/login" className="text-red-500 text-lg  hover:underline">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  )
}

