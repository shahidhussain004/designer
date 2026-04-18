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
    <section
      id="services"
      ref={containerRef}
      style={{ position: "relative", padding: "120px 0 160px", background: "#0A0B0F" }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,229,197,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,197,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
        {/* Section Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", marginBottom: "80px" }}>
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
                marginBottom: "24px",
              }}
            >
              <span style={{ width: "32px", height: "1px", background: "#00E5C5", display: "block" }} />
              Services
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
              What we do{" "}
              <span style={{ color: "#00E5C5", fontStyle: "italic", fontWeight: 300 }}>best</span>
            </h2>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ paddingTop: "32px" }}
          >
            <p
              style={{
                fontSize: "17px",
                color: "rgba(240,240,238,0.5)",
                lineHeight: 1.7,
                maxWidth: "480px",
                margin: 0,
              }}
            >
              We offer a comprehensive suite of design services, each crafted with precision and tailored to elevate
              your brand's unique story.
            </p>
          </MotionDiv>
        </div>

        {/* Services Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          {services.map((service, index) => (
            <MotionDiv
              key={service.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ position: "relative" }}
            >
              <div
                style={{
                  position: "relative",
                  padding: "40px",
                  borderRadius: "12px",
                  background: hoveredIndex === index ? "#12141A" : "#0E1016",
                  border: `1px solid ${hoveredIndex === index ? "rgba(0,229,197,0.25)" : "rgba(240,240,238,0.07)"}`,
                  transition: "all 0.4s ease",
                  overflow: "hidden",
                }}
              >
                {/* Top cyan line on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #00E5C5, transparent)",
                    width: hoveredIndex === index ? "100%" : "0%",
                    transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        background: hoveredIndex === index ? "rgba(0,229,197,0.1)" : "rgba(240,240,238,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${hoveredIndex === index ? "rgba(0,229,197,0.25)" : "rgba(240,240,238,0.08)"}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <service.icon
                        style={{
                          width: "18px",
                          height: "18px",
                          color: hoveredIndex === index ? "#00E5C5" : "rgba(240,240,238,0.5)",
                          transition: "color 0.3s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "monospace",
                        color: "rgba(240,240,238,0.25)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {service.number}
                    </span>
                  </div>
                  <div
                    style={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      transform: `translateX(${hoveredIndex === index ? 0 : 8}px)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <ArrowUpRight style={{ width: "18px", height: "18px", color: "#00E5C5" }} />
                  </div>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: hoveredIndex === index ? "#00E5C5" : "#F0F0EE",
                    marginBottom: "12px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: "14px", color: "rgba(240,240,238,0.45)", lineHeight: 1.7, marginBottom: "24px" }}>
                  {service.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {service.details.map((detail) => (
                    <span
                      key={detail}
                      style={{
                        padding: "5px 12px",
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                        borderRadius: "100px",
                        background: hoveredIndex === index ? "rgba(0,229,197,0.08)" : "rgba(240,240,238,0.04)",
                        color: hoveredIndex === index ? "#00E5C5" : "rgba(240,240,238,0.35)",
                        border: `1px solid ${hoveredIndex === index ? "rgba(0,229,197,0.2)" : "rgba(240,240,238,0.07)"}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}