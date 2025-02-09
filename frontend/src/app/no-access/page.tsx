'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, AlertTriangle } from 'lucide-react'

export default function NoAccessPage() {
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowError(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader>
          <motion.div 
            className="mx-auto rounded-full bg-destructive/10 p-3 w-fit"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <LockIcon className="h-8 w-8 text-destructive" aria-hidden="true" />
            </motion.div>
          </motion.div>
          <CardTitle className="text-center text-2xl font-bold mt-4">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-2 text-destructive mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">Error: Insufficient Permissions</span>
                </div>
                <p className="text-center text-muted-foreground">
                  Oops! It looks like you don't have permission to view this page.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="destructive">
            <Link href="/auth/login">
              <LockIcon className="mr-2 h-4 w-4" />
              Go to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
