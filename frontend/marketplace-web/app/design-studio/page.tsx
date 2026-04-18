"use client"

import { PageLayout } from '@/components/ui';
import { ArrowRight, Code, Layers, Lightbulb, Palette, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Palette,
    title: "Brand Identity",
    description: "Crafting distinctive visual identities that capture your essence and create lasting impressions across all touchpoints.",
    details: ["Logo Design & Concepts", "Visual Systems & Guidelines", "Brand Art Direction"],
  },
  {
    icon: Code,
    title: "Digital Experiences",
    description: "Building immersive digital products with meticulous attention to interaction design and user experience.",
    details: ["Web & App Design", "Interactive Prototypes", "Motion Design"],
  },
  {
    icon: Lightbulb,
    title: "Strategy & Insights",
    description: "Developing strategic frameworks that align creative vision with business objectives for maximum impact.",
    details: ["Research & User Analysis", "Content Strategy", "Market Positioning"],
  },
  {
    icon: Layers,
    title: "Product Design",
    description: "Designing intuitive product experiences that balance beauty with functionality and user needs.",
    details: ["UX & UI Design", "Design Systems", "Usability Testing"],
  },
];

const features = [
  {
    icon: Users,
    title: "Expert Team",
    description: "Experienced designers and strategists dedicated to your project's success",
    stat: "15+",
    statLabel: "Specialists",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Efficient processes that deliver results without compromising quality",
    stat: "2×",
    statLabel: "Faster Delivery",
  },
  {
    icon: Shield,
    title: "Reliable Support",
    description: "Ongoing partnership and support throughout your project lifecycle",
    stat: "98%",
    statLabel: "Satisfaction",
  },
];

const processSteps = [
  { number: "01", title: "Discovery", description: "Understanding your needs, goals, and target audience" },
  { number: "02", title: "Strategy", description: "Developing strategy and creative direction" },
  { number: "03", title: "Design", description: "Creating beautiful, functional designs" },
  { number: "04", title: "Delivery", description: "Delivering polished results and ongoing support" },
];

export default function DesignStudioPage() {
  return (
    <PageLayout>
      <div style={{ background: "#0A0B0F", color: "#F0F0EE" }}>

        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "96px 0 120px",
            overflow: "hidden",
            background: "#0A0B0F",
          }}
        >
          {/* Grid texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(196,30,58,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(196,30,58,0.07) 0%, transparent 70%)",
            }}
          />

          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
            {/* Eyebrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  border: "1px solid rgba(196,30,58,0.3)",
                  borderRadius: "100px",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#C41E3A",
                  background: "rgba(196,30,58,0.06)",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C41E3A", display: "inline-block" }} />
                Design Studio
              </span>
            </div>

            <div style={{ maxWidth: "760px" }}>
              <h1
                style={{
                  fontSize: "clamp(48px, 7vw, 88px)",
                  fontWeight: 700,
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  color: "#F0F0EE",
                  margin: "0 0 32px",
                }}
              >
                Design{" "}
                <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Studio</span>
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  color: "rgba(240,240,238,0.5)",
                  lineHeight: 1.7,
                  maxWidth: "540px",
                  margin: "0 0 48px",
                }}
              >
                Professional design services crafted for modern businesses. From brand identity to digital
                experiences, we create solutions that resonate with your audience.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 28px",
                    background: "#C41E3A",
                    color: "#FFFFFF",
                    borderRadius: "100px",
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Get Started
                  <ArrowRight style={{ width: "14px", height: "14px" }} />
                </button>
                <Link
                  href="/contact"
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
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SERVICES ─────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "100px 0 120px",
            background: "#0D0E14",
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
              {services.map((service, index) => (
                <div
                  key={service.title}
                  style={{
                    position: "relative",
                    padding: "40px",
                    borderRadius: "12px",
                    background: "#0A0B0F",
                    border: "1px solid rgba(240,240,238,0.07)",
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

        {/* ─── WHY CHOOSE US ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "100px 0 120px",
            background: "#070809",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(196,30,58,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.2), transparent)",
            }}
          />
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
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
                Why Us
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
                Why Choose Our{" "}
                <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Studio</span>
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(240,240,238,0.4)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                We bring expertise, creativity, and dedication to every project
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(240,240,238,0.07)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(240,240,238,0.07)" }}>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  style={{
                    padding: "48px 40px",
                    background: "#0A0B0F",
                    textAlign: "center",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#0D0E14" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#0A0B0F" }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                    background: "rgba(196,30,58,0.08)",
                    border: "1px solid rgba(196,30,58,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <feature.icon style={{ width: "24px", height: "24px", color: "#C41E3A" }} />
                  </div>
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
                    {feature.stat}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(240,240,238,0.3)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: "0 0 20px",
                    }}
                  >
                    {feature.statLabel}
                  </p>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#F0F0EE", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "rgba(240,240,238,0.4)", lineHeight: 1.7, margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── CTA BANNER ───────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "100px 0",
            background: "#0A0B0F",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(196,30,58,0.07) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.3), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.3), transparent)",
            }}
          />

          <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px", textAlign: "center", position: "relative" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                border: "1px solid rgba(196,30,58,0.3)",
                borderRadius: "100px",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C41E3A",
                background: "rgba(196,30,58,0.06)",
                marginBottom: "32px",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C41E3A", display: "inline-block" }} />
              Start a Project
            </span>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "#F0F0EE",
                margin: "0 0 24px",
              }}
            >
              Ready to Transform Your{" "}
              <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Design?</span>
            </h2>
            <p style={{ fontSize: "17px", color: "rgba(240,240,238,0.45)", margin: "0 0 48px", lineHeight: 1.7 }}>
              Lets collaborate on a project that brings your vision to life with professional design excellence.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
                  background: "#C41E3A",
                  color: "#ffffff",
                  borderRadius: "100px",
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Your Project
                <ArrowRight style={{ width: "14px", height: "14px" }} />
              </button>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 32px",
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
                Get in Touch
              </Link>
            </div>
          </div>
        </div>

        {/* ─── PROCESS ──────────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "100px 0 120px",
            background: "#0D0E14",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(196,30,58,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(196,30,58,0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,30,58,0.2), transparent)",
            }}
          />
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
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
                How We Work
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
                Our Design{" "}
                <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Process</span>
              </h2>
              <p style={{ fontSize: "16px", color: "rgba(240,240,238,0.4)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
                A collaborative approach that ensures your vision becomes reality
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", position: "relative" }}>
              {/* Connector line */}
              <div
                style={{
                  position: "absolute",
                  top: "40px",
                  left: "12.5%",
                  right: "12.5%",
                  height: "1px",
                  background: "linear-gradient(90deg, #C41E3A, rgba(196,30,58,0.1))",
                  zIndex: 0,
                }}
              />

              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "0 20px",
                    textAlign: "center",
                  }}
                >
                  {/* Number circle */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                    background: index === 0 ? "#C41E3A" : "#0A0B0F",
                    border: `2px solid ${index === 0 ? "#C41E3A" : "rgba(196,30,58,0.3)"}`,  
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 32px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "#C41E3A";
                      el.style.borderColor = "#C41E3A";
                      const num = el.querySelector("span") as HTMLElement;
                      if (num) num.style.color = "#0A0B0F";
                    }}
                    onMouseLeave={(e) => {
                      if (index !== 0) {
                        const el = e.currentTarget as HTMLElement;
                        el.style.background = "#0A0B0F";
                        el.style.borderColor = "rgba(196,30,58,0.3)";
                        const num = el.querySelector("span") as HTMLElement;
                        if (num) num.style.color = "#C41E3A";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: index === 0 ? "#0A0B0F" : "#C41E3A",
                        letterSpacing: "0.05em",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: "#F0F0EE",
                      margin: "0 0 12px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "rgba(240,240,238,0.4)", lineHeight: 1.7, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}

