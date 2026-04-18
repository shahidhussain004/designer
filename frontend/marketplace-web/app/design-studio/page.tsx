"use client"

import { PageLayout } from '@/components/ui';
import { ArrowRight, Code, Layers, Lightbulb, Palette, Shield, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { DesignProcess } from './design-process';
import { HeroSection } from './hero-section';
import { PhilosophySection } from './philosophy-section';
import { ServicesSection } from './services-section';
import { TestimonialsSection } from './testimonials-section';
import { WorkShowcase } from './work-showcase';

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

export default function DesignStudioPage() {
  return (
    <PageLayout>
      <HeroSection />
      <PhilosophySection />
      <ServicesSection />
      <WorkShowcase />
      <TestimonialsSection />
      <DesignProcess />
      <div style={{ background: "#111827", color: "#F0F0EE" }}>


        {/* ─── WHY CHOOSE US ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            padding: "100px 0 120px",
            background: "#111827",
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
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    padding: "48px 40px",
                    background: "#111827",
                    textAlign: "center",
                    transition: "background 0.3s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1F2937" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#111827" }}
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
            background: "#111827",
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
      </div>
    </PageLayout>
  );
}

