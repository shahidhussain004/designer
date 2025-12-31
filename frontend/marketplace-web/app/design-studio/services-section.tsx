"use client"

import { motion, useInView } from "framer-motion"
import { ArrowUpRight, Code, Layers, Lightbulb, Palette } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"

const MotionDiv = motion.div as unknown as React.ComponentType<React.ComponentProps<'div'> & any>

const services = [
  {
    icon: Palette,
    number: "01",
    title: "Brand Identity",
    description:
      "Crafting distinctive visual identities that capture essence and create lasting impressions across all touchpoints.",
    details: ["Logo Design", "Visual Systems", "Brand Guidelines", "Art Direction"],
  },
  {
    icon: Code,
    number: "02",
    title: "Digital Experiences",
    description:
      "Building immersive digital products with meticulous attention to interaction design and user experience.",
    details: ["Web Design", "App Design", "Interactive Prototypes", "Motion Design"],
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Creative Strategy",
    description:
      "Developing strategic frameworks that align creative vision with business objectives for maximum impact.",
    details: ["Research & Insights", "Content Strategy", "Campaign Development", "Market Positioning"],
  },
  {
    icon: Layers,
    number: "04",
    title: "Product Design",
    description: "Designing intuitive product experiences that balance beauty with functionality and user needs.",
    details: ["UX Design", "UI Design", "Design Systems", "Usability Testing"],
  },
]

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="services" ref={containerRef} className="relative py-32 lg:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-20 lg:mb-32">
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              Services
            </span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-balance">
              What we do <span className="italic font-normal text-accent">best</span>
            </h2>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-8"
          >
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              We offer a comprehensive suite of design services, each crafted with precision and tailored to elevate
              your brand&apos;s unique story.
            </p>
          </MotionDiv>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <MotionDiv
              key={service.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <div className="relative p-8 lg:p-10 rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-accent/30 hover:shadow-xl overflow-hidden">
                {/* Background glow on hover */}
                <MotionDiv
                  className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
                        <service.icon className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">{service.number}</span>
                    </div>
                    <MotionDiv
                      animate={{
                        x: hoveredIndex === index ? 0 : 10,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-accent" />
                    </MotionDiv>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl lg:text-3xl font-medium tracking-tight mb-4 group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-2">
                    {service.details.map((detail) => (
                      <span
                        key={detail}
                        className="px-3 py-1.5 text-xs tracking-wide rounded-full bg-secondary text-muted-foreground group-hover:bg-accent/10 group-hover:text-foreground transition-colors duration-300"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom line indicator */}
                <MotionDiv
                  className="absolute bottom-0 left-0 h-[2px] bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}
