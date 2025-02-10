"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const titleRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(titleRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
  }, [])

  return (
    <section className="py-20 px-6 text-center">
      <h1 ref={titleRef} className="text-4xl font-bold mb-4">
        Simplify Resource Sharing
      </h1>
      <p className="text-sm mb-8 max-w-md mx-auto">
        Re-allocator helps colleges manage and share resources efficiently. Streamline your operations and maximize
        resource utilization.
      </p>
      <motion.a
        href="/auth/login"
        className="inline-flex items-center px-4 py-2 border border-black text-sm font-medium hover:bg-red-500 hover:text-white transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started <ArrowRight size={16} className="ml-2" />
      </motion.a>
    </section>
  )
}

