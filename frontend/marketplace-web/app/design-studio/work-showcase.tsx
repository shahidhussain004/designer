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
    accent: "#00E5C5",
  },
  {
    id: 2,
    title: "Meridian Finance",
    category: "Digital Experience",
    year: "2024",
    image: "/fintech-app-design-modern-clean-interface.jpg",
    accent: "#6366F1",
  },
  {
    id: 3,
    title: "Atlas Architecture",
    category: "Web Design",
    year: "2023",
    image: "/architecture-portfolio-website-minimalist-design.jpg",
    accent: "#00E5C5",
  },
  {
    id: 4,
    title: "Lumière Studios",
    category: "Creative Direction",
    year: "2023",
    image: "/creative-agency-branding-photography-studio.jpg",
    accent: "#6366F1",
  },
]

export function WorkShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [activeProject, setActiveProject] = useState<number | null>(null)

  return (
    <section
      id="work"
      ref={containerRef}
      style={{ position: "relative", padding: "120px 0 160px", background: "#0D0E14" }}
    >
      {/* Diagonal separator line at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0,229,197,0.2), transparent)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "32px",
            marginBottom: "80px",
          }}
        >
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#00E5C5",
                marginBottom: "20px",
              }}
            >
              <span style={{ width: "32px", height: "1px", background: "#00E5C5", display: "block" }} />
              Selected Work
            </span>
            <h2
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "#F0F0EE",
                margin: 0,
              }}
            >
              Featured{" "}
              <span style={{ color: "#00E5C5", fontStyle: "italic", fontWeight: 300 }}>projects</span>
            </h2>
          </MotionDiv>
          <MotionA
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              color: "rgba(240,240,238,0.4)",
              textDecoration: "none",
              paddingBottom: "8px",
              borderBottom: "1px solid rgba(240,240,238,0.12)",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            <span>View all projects</span>
            <ArrowUpRight style={{ width: "14px", height: "14px" }} />
          </MotionA>
        </div>

        {/* Projects Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "32px" }}>
          {projects.map((project, index) => (
            <MotionDiv
              key={project.id}
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Image Container */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/10",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  border: `1px solid ${activeProject === project.id ? `${project.accent}30` : "rgba(240,240,238,0.07)"}`,
                  transition: "border-color 0.4s ease",
                }}
              >
                <MotionImg
                  src={project.image}
                  alt={project.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Dark overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, transparent 40%, rgba(10,11,15,${activeProject === project.id ? 0.5 : 0.2}) 100%)`,
                    transition: "all 0.5s ease",
                  }}
                />

                {/* Hover circle */}
                <AnimatePresence>
                  {activeProject === project.id && (
                    <MotionDiv
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          background: "rgba(10,11,15,0.85)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${project.accent}40`,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <Plus style={{ width: "20px", height: "20px", color: project.accent }} />
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>

                {/* Category badge */}
                <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      background: "rgba(10,11,15,0.8)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "100px",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      color: "rgba(240,240,238,0.8)",
                      border: "1px solid rgba(240,240,238,0.12)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project info */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: activeProject === project.id ? project.accent : "#F0F0EE",
                      margin: "0 0 6px",
                      transition: "color 0.3s ease",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(240,240,238,0.3)", margin: 0, letterSpacing: "0.05em" }}>
                    {project.year}
                  </p>
                </div>
                <div
                  style={{
                    opacity: activeProject === project.id ? 1 : 0,
                    transform: `translateX(${activeProject === project.id ? 0 : -10}px)`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowUpRight style={{ width: "22px", height: "22px", color: project.accent }} />
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}