"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"

const MotionDiv = motion.div as unknown as React.ComponentType<React.ComponentProps<'div'> & any>
const MotionButton = motion.button as unknown as React.ComponentType<React.ComponentProps<'button'> & any>

const testimonials = [
  {
    id: 1,
    quote:
      "Working with Atelier transformed our brand completely. Their attention to detail and creative vision exceeded every expectation we had.",
    author: "Sarah Mitchell",
    role: "CEO, Horizon Ventures",
    image: "/professional-woman-portrait-business.png",
    metric: { value: "3×", label: "Brand Recognition" },
  },
  {
    id: 2,
    quote:
      "The level of craft and intentionality in their work is unmatched. They don't just design—they create experiences that resonate deeply with users.",
    author: "Michael Torres",
    role: "Founder, Meridian Finance",
    image: "/professional-man-portrait-business-executive.jpg",
    metric: { value: "89%", label: "User Satisfaction" },
  },
  {
    id: 3,
    quote:
      "Atelier brought a perfect balance of creativity and strategy to our project. The results speak for themselves—our engagement increased by 300%.",
    author: "Emma Nakamura",
    role: "Creative Director, Atlas Architecture",
    image: "/creative-professional-woman.png",
    metric: { value: "300%", label: "Engagement Increase" },
  },
]

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prevTestimonial = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section
      id="testimonials"
      ref={containerRef}
      style={{ position: "relative", padding: "120px 0 160px", background: "#111827" }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(196,30,58,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.025) 1px, transparent 1px)",
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
          background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.2), transparent)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
        {/* Section Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "80px" }}
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
              marginBottom: "20px",
            }}
          >
            <span style={{ width: "32px", height: "1px", background: "#C41E3A", display: "block" }} />
            Testimonials
            <span style={{ width: "32px", height: "1px", background: "#C41E3A", display: "block" }} />
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
            Client{" "}
            <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>voices</span>
          </h2>
        </MotionDiv>

        {/* Testimonial Area */}
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          {/* Large quote mark */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "48px",
            }}
          >
            <Quote style={{ width: "48px", height: "48px", color: "rgba(196,30,58,0.15)" }} />
          </MotionDiv>

          {/* Content */}
          <div style={{ minHeight: "280px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center", width: "100%" }}
              >
                <p
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 30px)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.5,
                    color: "rgba(240,240,238,0.85)",
                    marginBottom: "48px",
                  }}
                >
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </p>

                {/* Author + metric */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid rgba(196,30,58,0.25)",
                      }}
                    >
                      <Image
                        src={testimonials[activeIndex].image}
                        alt={testimonials[activeIndex].author}
                        width={56}
                        height={56}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: "#F0F0EE", margin: "0 0 4px" }}>
                        {testimonials[activeIndex].author}
                      </p>
                      <p style={{ fontSize: "12px", color: "rgba(240,240,238,0.4)", margin: 0, letterSpacing: "0.05em" }}>
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: "1px", height: "60px", background: "rgba(240,240,238,0.1)" }} />

                  {/* Stat */}
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "40px",
                        fontWeight: 700,
                        color: "#C41E3A",
                        margin: "0 0 4px",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {testimonials[activeIndex].metric.value}
                    </p>
                    <p style={{ fontSize: "12px", color: "rgba(240,240,238,0.35)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {testimonials[activeIndex].metric.label}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "56px" }}>
            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTestimonial}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(240,240,238,0.15)",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "rgba(240,240,238,0.6)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = "rgba(196,30,58,0.4)"
                el.style.color = "#C41E3A"
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = "rgba(240,240,238,0.15)"
                el.style.color = "rgba(240,240,238,0.6)"
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft style={{ width: "18px", height: "18px" }} />
            </MotionButton>

            {/* Progress dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    height: "6px",
                    borderRadius: "100px",
                    border: "none",
                    background: index === activeIndex ? "#C41E3A" : "rgba(240,240,238,0.15)",
                    width: index === activeIndex ? "28px" : "6px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTestimonial}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(240,240,238,0.15)",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "rgba(240,240,238,0.6)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = "rgba(196,30,58,0.4)"
                el.style.color = "#C41E3A"
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = "rgba(240,240,238,0.15)"
                el.style.color = "rgba(240,240,238,0.6)"
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight style={{ width: "18px", height: "18px" }} />
            </MotionButton>
          </div>
        </div>
      </div>
    </section>
  )
}