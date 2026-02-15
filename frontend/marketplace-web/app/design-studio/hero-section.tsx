"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Suppress TypeScript errors for framer-motion components - motion provides proper runtime types
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <MotionDiv
          style={{ x: mouseX, y: mouseY }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl"
        />
        <MotionDiv
          style={{ x: useTransform(mouseX, (v) => -v * 0.5), y: useTransform(mouseY, (v) => -v * 0.5) }}
          className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] rounded-full bg-muted/50 blur-3xl"
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      <MotionDiv style={{ y, opacity, scale }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}>
              <span className="w-12 h-[1px] bg-accent" />
              <span className="text-sm tracking-[0.2em] uppercase text-muted-foreground">Design Studio</span>
            </MotionDiv>

            {/* Main headline */}
            <div className="space-y-2">
              <MotionH1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[0.95] text-balance"
              >
                <span className="block">Optimal craft</span>
                <span className="block mt-2">
                  meets <span className="italic font-normal text-accent">exquisite</span>
                </span>
                <span className="block mt-2">design</span>
              </MotionH1>
            </div>

            {/* Description */}
            <MotionP
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Transform your vision into functional works of art with our bespoke design solutions. We craft digital
              experiences that resonate and endure.
            </MotionP>

            {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}>
              <MotionA
                href="#work"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full text-sm tracking-wide font-medium transition-all duration-300 hover:bg-foreground/90"
              >
                <span>View Our Work</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MotionA>
              <MotionA
                href="#services"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-border rounded-full text-sm tracking-wide font-medium transition-all duration-300 hover:bg-secondary"
              >
                <span>Our Services</span>
              </MotionA>
            </MotionDiv>
          </div>

          {/* Right content - Featured Image */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <MotionImg
                src="/elegant-minimalist-interior-design-wooden-furnitur.jpg"
                alt="Featured design work"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -left-6 bottom-12 bg-card p-6 rounded-xl shadow-2xl border border-border/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-xl font-medium text-accent">15</span>
                </div>
                <div>
                  <p className="text-2xl font-medium text-foreground">Years</p>
                  <p className="text-sm text-muted-foreground">of Excellence</p>
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
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Scroll to explore</span>
          <MotionDiv
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>

      {/* Side navigation dots */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        {[
          "hero",
          "services",
          "work",
          "philosophy",
          "testimonials",
          "contact",
        ].map((section, i) => (
          <MotionA
            key={section}
            href={`#${section}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="group relative flex items-center"
          >
            <MotionSpan className="absolute right-6 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </MotionSpan>
            <span className="w-2 h-2 rounded-full bg-border group-hover:bg-accent transition-colors duration-300" />
          </MotionA>
        ))}
      </div>
    </section>
  )
}
