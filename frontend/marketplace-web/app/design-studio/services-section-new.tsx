"use client"

import { Code, Layers, Lightbulb, Palette } from "lucide-react"
import { useEffect, useState } from "react"
import styles from './design-studio.module.css'

const services = [
  {
    icon: Palette,
    number: "01",
    title: "Brand Identity & Visual Systems",
    description:
      "We craft distinctive brand identities that capture your essence and create lasting impressions. From conceptual exploration to comprehensive visual systems, we ensure consistency across every touchpoint.",
    details: ["Brand Strategy", "Logo & Iconography", "Visual Guidelines", "Art Direction", "Print Collateral"],
  },
  {
    icon: Code,
    number: "02",
    title: "Digital Product Design",
    description:
      "Building immersive digital experiences with meticulous attention to interaction design, accessibility, and user-centered thinking. We create products that people love to use.",
    details: ["UX Research & Strategy", "Interface Design", "Interactive Prototypes", "Design Systems", "Responsive Web"],
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Creative Strategy & Insights",
    description:
      "Strategic frameworks that align creative vision with business objectives. We combine research, market analysis, and creative thinking to develop strategies that drive measurable impact.",
    details: ["User Research", "Content Strategy", "Campaign Development", "Market Analysis", "Positioning"],
  },
  {
    icon: Layers,
    number: "04",
    title: "Experience Design",
    description:
      "Holistic design thinking that considers every user interaction. We design intuitive experiences that balance aesthetic beauty with functional excellence and human needs.",
    details: ["Service Design", "Usability Testing", "Journey Mapping", "Information Architecture", "Accessibility"],
  },
]

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('services')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesContainer}>
        {/* Header */}
        <div className={styles.servicesHeader}>
          <div className={styles.philosophyLabel}>What We Do</div>
          <h2 className={styles.philosophyTitle}>
            Comprehensive <span className={styles.philosophyTitleAccent}>Design Services</span>
          </h2>
          <p className={styles.philosophyDescription}>
            From brand strategy to digital execution, we offer integrated design services
            that transform ambitious ideas into compelling realities.
          </p>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={service.number}
                className={styles.serviceCard}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animation: isVisible ? 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                  opacity: isVisible ? 1 : 0
                }}
              >
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>
                    <IconComponent size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.serviceNumber}>{service.number}</div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                  </div>
                </div>

                <p className={styles.serviceDescription}>{service.description}</p>

                <div className={styles.serviceDetails}>
                  {service.details.map((detail) => (
                    <span key={detail} className={styles.serviceTag}>
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '80px',
          textAlign: 'center',
          padding: '64px 48px',
          background: 'rgba(196, 30, 58, 0.05)',
          border: '1px solid rgba(196, 30, 58, 0.2)',
          borderRadius: '20px'
        }}>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#F0F0EE',
            marginBottom: '16px'
          }}>
            Ready to Start Your Project?
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'rgba(240, 240, 238, 0.6)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Let&apos;s discuss how we can help bring your vision to life with strategic design thinking and creative excellence.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '18px 36px',
              background: '#C41E3A',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '15px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 16px rgba(196, 30, 58, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#A01828'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#C41E3A'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Get in Touch
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
