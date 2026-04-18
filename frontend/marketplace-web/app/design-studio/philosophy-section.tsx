"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from 'next/image'
import type React from "react"
import { useRef } from "react"

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

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "12", label: "Design Awards" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15", label: "Years Experience" },
]

export function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef as unknown as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  const MotionDiv = motion.div as unknown as React.ComponentType<React.ComponentProps<'div'> & any>

  return (
    <section
      id="philosophy"
      ref={containerRef}
      style={{ position: "relative", padding: "120px 0 160px", background: "#0F1419", overflow: "hidden" }}
    >
      {/* Grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#111827",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top separator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.25), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(196,30,58,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "96px", alignItems: "center" }}>
          {/* Left - Quote */}
          <MotionDiv
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C41E3A",
                marginBottom: "32px",
              }}
            >
              <span style={{ width: "32px", height: "1px", background: "#C41E3A", display: "block" }} />
              Our Philosophy
            </span>

            <blockquote
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "#F0F0EE",
                margin: 0,
              }}
            >
              <span style={{ color: "#C41E3A", fontSize: "1.4em", lineHeight: 1 }}>&ldquo;</span>
              Design is not just what it looks like. Design is{" "}
              <em style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>how it works</em>
              <span style={{ color: "#C41E3A", fontSize: "1.4em", lineHeight: 1 }}>&rdquo;</span>
            </blockquote>

            <MotionDiv
              style={{ y, marginTop: "48px", display: "flex", alignItems: "center", gap: "16px" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(196,30,58,0.25)",
                  position: 'relative'
                }}
              >
                <Image
                  src="/minimalist-professional-portrait.png"
                  alt="Founder"
                  fill
                  sizes="56px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#F0F0EE", margin: "0 0 4px", fontSize: "15px" }}>
                  Alexander Chen
                </p>
                <p style={{ fontSize: "12px", color: "rgba(240,240,238,0.4)", margin: 0, letterSpacing: "0.05em" }}>
                  Founder & Creative Director
                </p>
              </div>
            </MotionDiv>
          </MotionDiv>

          {/* Right - Principles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {principles.map((principle, index) => (
              <MotionDiv
                key={principle.number}
                initial={{ opacity: 0, x: 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group"
              >
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "28px",
                    borderRadius: "10px",
                    border: "1px solid rgba(240,240,238,0.06)",
                    background: "rgba(240,240,238,0.02)",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                  el.style.background = "rgba(196,30,58,0.04)"
                  el.style.borderColor = "rgba(196,30,58,0.18)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "rgba(240,240,238,0.02)"
                    el.style.borderColor = "rgba(240,240,238,0.06)"
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                    color: "#C41E3A",
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                      marginTop: "3px",
                    }}
                  >
                    {principle.number}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "#F0F0EE",
                        margin: "0 0 8px",
                      }}
                    >
                      {principle.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "rgba(240,240,238,0.4)", lineHeight: 1.7, margin: 0 }}>
                      {principle.description}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <MotionDiv
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            marginTop: "96px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(240,240,238,0.07)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(240,240,238,0.07)",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: "40px 32px",
                background: "#111827",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#C41E3A",
                  margin: "0 0 8px",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(240,240,238,0.35)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </MotionDiv>
      </div>
    </section>
  )
}