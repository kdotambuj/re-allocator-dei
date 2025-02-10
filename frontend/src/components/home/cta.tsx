"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function CTA() {
  return (
    <section id="cta" className="py-20 px-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your Resources?</h2>
      <p className="text-sm mb-8 max-w-md mx-auto">
        Join Re-allocator today and transform the way your college manages resources.
      </p>

      <Link href={'/auth/login'}>
      <motion.button
        className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}

      >
        Request a Resource
      </motion.button>
      </Link>

    </section>
  )
}

