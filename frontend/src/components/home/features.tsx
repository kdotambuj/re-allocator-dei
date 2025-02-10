"use client"

import { motion } from "framer-motion"
import { Calendar, Users, BarChart } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book resources with a simple, intuitive interface.",
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "Share and manage resources across departments.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Gain insights into resource utilization and trends.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-12">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <feature.icon size={32} className="mx-auto mb-4 text-red-600 " />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

