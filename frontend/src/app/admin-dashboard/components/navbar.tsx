"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronDown, Menu, X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logout from "@/components/Logout"
import Icon from "@/components/Icon"

const navItems = [
  { name: "User Dashboard", href: "#user-dashboard", icon: "LayoutDashboard" },
  { name: "Resources", href: "#resources", icon: "Box" },
  { name: "Create Resource", href: "#create-resource", icon: "FileBox" },
  { name: "Products", href: "/products", icon: "ShoppingBag" },
  { name: "Settings", href: "/settings", icon: "Settings" },
]

export function AdminNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-red-200 bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold ">Re-Allocator <span className="text-sm text-red-600">Admin</span></span>
              </motion.div>
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            {navItems.map((item, index) => (
              <NavItem  key={item.name}  item={item} isActive={pathname === item.href} index={index} />
            ))}

          <Logout />
          </div>

         
          <div className="flex items-center">
            <UserNav />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="px-2 text-red-600 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-white p-0">
                <MobileNav items={navItems} setIsOpen={setIsOpen} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavItem({ item, isActive, index }: { item: typeof navItems[number]; isActive: boolean; index: number }) {


  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-red-600",
        isActive ? "text-red-600" : "text-gray-700"
      )}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <React.Suspense fallback={<div className="h-4 w-4" />}>
         <Icon name={item.icon} classname="h-4 w-4" />
        </React.Suspense>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
      >
        {item.name}
      </motion.span>
    </Link>
  )
}

function MobileNav({ items, setIsOpen }: { items: typeof navItems; setIsOpen: (open: boolean) => void }) {
  return (
    <ScrollArea className="h-full py-6">
      <div className="flex items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
          <span className="text-2xl font-bold text-red-600">Admin</span>
        </Link>
        <Button variant="ghost" onClick={() => setIsOpen(false)} className="px-2 text-red-600">
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <div className="mt-6">
        {items.map((item, index) => (
          <MobileNavItem key={item.name} item={item} setIsOpen={setIsOpen} index={index} />
        ))}
      </div>
    </ScrollArea>
  )
}

function MobileNavItem({
  item,
  setIsOpen,
  index,
}: {
  item: typeof navItems[number]
  setIsOpen: (open: boolean) => void
  index: number
}) {
  

  return (
    <Link
      href={item.href}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
      onClick={() => setIsOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <React.Suspense fallback={<div className="h-4 w-4" />}>
          <Icon name={item.icon} className="h-4 w-4" />
        </React.Suspense>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
      >
        {item.name}
      </motion.span>
    </Link>
  )
}

function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <motion.img
            className="h-8 w-8 rounded-full"
            src="/placeholder.svg?height=32&width=32"
            alt="User avatar"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex items-center space-x-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Profile
          <ChevronDown className="ml-auto h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
