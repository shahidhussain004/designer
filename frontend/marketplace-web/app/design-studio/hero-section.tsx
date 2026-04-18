"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const MotionDiv = motion.div as any
const MotionH1 = motion.h1 as any
const MotionP = motion.p as any
const MotionA = motion.a as any
const MotionImg = motion.img as any
const MotionSpan = motion.span as any

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef as unknown as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const mouseX = useSpring(0, springConfig)
  const mouseY = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      mouseX.set((clientX - innerWidth / 2) / 50)
      mouseY.set((clientY - innerHeight / 2) / 50)
      setMousePosition({ x: clientX, y: clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0A0B0F" }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,197,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,197,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,197,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Animated background orbs */}
      <MotionDiv
        style={{ x: mouseX, y: mouseY }}
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(0,229,197,0.03)",
          filter: "blur(80px)",
        }}
      />
      <MotionDiv
        style={{ x: useTransform(mouseX, (v) => -v * 0.7), y: useTransform(mouseY, (v) => -v * 0.7) }}
        className="absolute pointer-events-none"
        style={{
          bottom: "20%",
          right: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "rgba(99,102,241,0.04)",
          filter: "blur(100px)",
        }}
      />

      <MotionDiv style={{ y, opacity, scale }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow tag */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  border: "1px solid rgba(0,229,197,0.3)",
                  borderRadius: "100px",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#00E5C5",
                  background: "rgba(0,229,197,0.06)",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00E5C5", display: "inline-block" }} />
                Design Studio
              </span>
            </MotionDiv>

            {/* Main headline */}
            <MotionH1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(52px, 8vw, 96px)",
                fontWeight: 600,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: "#F0F0EE",
                margin: 0,
              }}
            >
              <span style={{ display: "block" }}>Optimal</span>
              <span style={{ display: "block", marginTop: "4px" }}>craft meets</span>
              <span
                style={{
                  display: "block",
                  marginTop: "4px",
                  color: "#00E5C5",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                exquisite
              </span>
              <span style={{ display: "block", marginTop: "4px", color: "#F0F0EE" }}>design</span>
            </MotionH1>

            {/* Description */}
            <MotionP
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: "17px",
                color: "rgba(240,240,238,0.55)",
                maxWidth: "520px",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Transform your vision into functional works of art with bespoke design solutions.
              We craft digital experiences that resonate and endure.
            </MotionP>

            {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              <MotionA
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  background: "#00E5C5",
                  color: "#0A0B0F",
                  borderRadius: "100px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #00E5C5",
                }}
              >
                <span>View Our Work</span>
                <ArrowUpRight style={{ width: "14px", height: "14px" }} />
              </MotionA>
              <MotionA
                href="#services"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  background: "transparent",
                  color: "rgba(240,240,238,0.8)",
                  borderRadius: "100px",
                  fontSize: "13px",
                  letterSpacing: "0.05em",
                  fontWeight: 500,
                  textDecoration: "none",
                  border: "1px solid rgba(240,240,238,0.2)",
                }}
              >
                <span>Our Services</span>
              </MotionA>
            </MotionDiv>
          </div>

          {/* Right - Featured Image */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(0,229,197,0.15)",
              }}
            >
              <MotionImg
                src="/elegant-minimalist-interior-design-wooden-furnitur.jpg"
                alt="Featured design work"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(10,11,15,0.5) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Floating stat badge */}
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                position: "absolute",
                left: "-28px",
                bottom: "48px",
                background: "#12141A",
                padding: "20px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(0,229,197,0.2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(0,229,197,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(0,229,197,0.2)",
                  }}
                >
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "#00E5C5" }}>15</span>
                </div>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 600, color: "#F0F0EE", margin: 0, lineHeight: 1 }}>Years</p>
                  <p style={{ fontSize: "12px", color: "rgba(240,240,238,0.4)", margin: "4px 0 0", letterSpacing: "0.08em" }}>
                    of Excellence
                  </p>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>

        {/* Scroll indicator */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          style={{
            position: "absolute",
            bottom: "48px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,240,238,0.3)" }}>
            Scroll to explore
          </span>
          <MotionDiv animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown style={{ width: "16px", height: "16px", color: "rgba(0,229,197,0.5)" }} />
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>

      {/* Side navigation dots */}
      <div
        style={{
          display: "none",
          position: "fixed",
          right: "32px",
          top: "50%",
          transform: "translateY(-50%)",
          flexDirection: "column",
          gap: "16px",
          zIndex: 50,
        }}
        className="xl:flex"
      >
        {["hero", "services", "work", "philosophy", "testimonials", "contact"].map((section, i) => (
          <MotionA
            key={section}
            href={`#${section}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="group"
            style={{ position: "relative", display: "flex", alignItems: "center" }}
          >
            <MotionSpan
              style={{
                position: "absolute",
                right: "24px",
                padding: "4px 10px",
                background: "#00E5C5",
                color: "#0A0B0F",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                borderRadius: "4px",
                opacity: 0,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
              }}
              className="group-hover:opacity-100 transition-opacity duration-300"
            >
              {section}
            </MotionSpan>
            <span
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(240,240,238,0.2)", display: "block" }}
              className="group-hover:bg-[#00E5C5] transition-colors duration-300"
            />
          </MotionA>
        ))}
      </div>
    </section>
  )
}