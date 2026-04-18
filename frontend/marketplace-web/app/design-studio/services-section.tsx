"use client"

import { motion, useInView } from "framer-motion"
import { Code, Layers, Lightbulb, Palette } from "lucide-react"
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
      style={{ position: "relative", padding: "120px 0 160px", background: "#111827",}}
    >
       <div
          style={{
            position: "relative",
            padding: "100px 0 120px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.2), transparent)",
            }}
          />
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
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
                What We Offer
                <span style={{ width: "32px", height: "1px", background: "#C41E3A", display: "block" }} />
              </span>
              <h2
                style={{
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  color: "#F0F0EE",
                  margin: "0 0 20px",
                }}
              >
                Our <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Services</span>
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(240,240,238,0.4)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
                Comprehensive design solutions tailored to elevate your brand and engage your audience
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              {services.map((service) => (
                <div
                  key={service.title}
                  style={{
                    position: "relative",
                    padding: "40px",
                    borderRadius: "12px",
                    border: "1px solid rgba(240,240,238,0.06)",
                    background: "rgba(240,240,238,0.02)",
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(196,30,58,0.25)";
                    const line = el.querySelector(".top-line") as HTMLElement;
                    if (line) line.style.width = "100%";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(240,240,238,0.07)";
                    const line = el.querySelector(".top-line") as HTMLElement;
                    if (line) line.style.width = "0%";
                  }}
                >
                  <div
                    className="top-line"
                    style={{
                      position: "absolute",
                      top: 0, left: 0,
                      height: "2px",
                      background: "linear-gradient(90deg, #C41E3A, transparent)",
                      width: "0%",
                      transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "10px",
                        background: "rgba(196,30,58,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(196,30,58,0.2)",
                        flexShrink: 0,
                      }}
                    >
                      <service.icon style={{ width: "20px", height: "20px", color: "#C41E3A" }} />
                    </div>
                    <h3
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "#F0F0EE",
                        margin: 0,
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(240,240,238,0.45)", lineHeight: 1.7, marginBottom: "24px" }}>
                    {service.description}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                    {service.details.map((detail) => (
                      <li
                        key={detail}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "13px",
                          color: "rgba(240,240,238,0.5)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "#C41E3A",
                            flexShrink: 0,
                          }}
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}