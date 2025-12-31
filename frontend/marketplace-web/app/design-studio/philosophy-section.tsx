"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const principles = [
  {
    number: "01",
    title: "Intention",
    description: "Every design decision is purposeful, serving both aesthetic and functional goals.",
  },
  {
    number: "02",
    title: "Craft",
    description: "Meticulous attention to detail elevates work from good to exceptional.",
  },
  {
    number: "03",
    title: "Clarity",
    description: "Complex ideas distilled into elegant, intuitive experiences.",
  },
]

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="relative py-32 lg:py-40 bg-foreground text-background overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Quote */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-background/60 mb-8">
              <span className="w-8 h-[1px] bg-accent" />
              Our Philosophy
            </span>
            <blockquote className="text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight leading-tight">
              <span className="text-accent">&ldquo;</span>
              Design is not just what it looks like. Design is{" "}
              <span className="italic font-normal text-accent">how it works</span>
              <span className="text-accent">&rdquo;</span>
            </blockquote>
            <motion.div style={{ y }} className="mt-12 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-background/10 overflow-hidden">
                <img src="/minimalist-professional-portrait.png" alt="Founder" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-background">Alexander Chen</p>
                <p className="text-sm text-background/60">Founder & Creative Director</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Principles */}
          <div className="space-y-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.number}
                initial={{ opacity: 0, x: 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <div className="flex gap-6 p-6 rounded-xl transition-colors duration-300 hover:bg-background/5">
                  <span className="text-sm font-mono text-accent">{principle.number}</span>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-medium mb-2 group-hover:text-accent transition-colors duration-300">
                      {principle.title}
                    </h3>
                    <p className="text-background/60 leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 lg:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {[
            { value: "150+", label: "Projects Delivered" },
            { value: "12", label: "Design Awards" },
            { value: "98%", label: "Client Satisfaction" },
            { value: "15", label: "Years Experience" },
          ].map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <p className="text-4xl lg:text-5xl font-medium text-accent mb-2">{stat.value}</p>
              <p className="text-sm text-background/60 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
