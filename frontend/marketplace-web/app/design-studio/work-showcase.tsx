"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"

const MotionDiv = motion.div as unknown as React.ComponentType<React.ComponentProps<'div'> & any>
const MotionA = motion.a as unknown as React.ComponentType<React.ComponentProps<'a'> & any>
const MotionImg = motion.img as unknown as React.ComponentType<React.ComponentProps<'img'> & any>

const projects = [
  {
    id: 1,
    title: "Horizon Ventures",
    category: "Brand Identity",
    year: "2024",
    image: "/luxury-brand-identity-design-dark-elegant.jpg",
    color: "from-amber-500/20",
  },
  {
    id: 2,
    title: "Meridian Finance",
    category: "Digital Experience",
    year: "2024",
    image: "/fintech-app-design-modern-clean-interface.jpg",
    color: "from-emerald-500/20",
  },
  {
    id: 3,
    title: "Atlas Architecture",
    category: "Web Design",
    year: "2023",
    image: "/architecture-portfolio-website-minimalist-design.jpg",
    color: "from-slate-500/20",
  },
  {
    id: 4,
    title: "Lumière Studios",
    category: "Creative Direction",
    year: "2023",
    image: "/creative-agency-branding-photography-studio.jpg",
    color: "from-rose-500/20",
  },
]

export function WorkShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [activeProject, setActiveProject] = useState<number | null>(null)

  return (
    <section id="work" ref={containerRef} className="relative py-32 lg:py-40 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-24">
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              Selected Work
            </span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight">
              Featured <span className="italic font-normal text-accent">projects</span>
            </h2>
          </MotionDiv>
          <MotionA
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group flex items-center gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span>View all projects</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MotionA>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <MotionDiv
              key={project.id}
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              className="group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                <MotionImg
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${project.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Hover Action */}
                <AnimatePresence>
                  {activeProject === project.id && (
                    <MotionDiv
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-2xl">
                        <Plus className="w-6 h-6 text-foreground" />
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full text-xs tracking-wide text-foreground">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-medium tracking-tight group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mt-1">{project.year}</p>
                </div>
                <MotionDiv
                  animate={{
                    x: activeProject === project.id ? 0 : -10,
                    opacity: activeProject === project.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-6 h-6 text-accent" />
                </MotionDiv>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}
