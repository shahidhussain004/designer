"use client"

import Image from 'next/image'
import { useEffect, useState } from "react"
import styles from './design-studio.module.css'

const principles = [
  {
    number: "01",
    title: "Strategic Intent",
    description: "Every design decision is grounded in strategic thinking, serving both aesthetic vision and measurable business outcomes.",
  },
  {
    number: "02",
    title: "Meticulous Craft",
    description: "We believe in the transformative power of detail—where precision and care elevate experiences from functional to exceptional.",
  },
  {
    number: "03",
    title: "Purposeful Clarity",
    description: "Complex challenges distilled into elegant, intuitive solutions that resonate with users and drive meaningful engagement.",
  },
]

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "12", label: "Design Awards" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "15", label: "Years Experience" },
]

export function PhilosophySection() {
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

    const element = document.getElementById('philosophy')
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
    <section id="philosophy" className={styles.philosophy}>
      {/* Grid texture */}
      <div className={styles.philosophyGrid} />

      {/* Top separator */}
      <div className={styles.philosophyDivider} />

      {/* Ambient glow */}
      <div className={styles.philosophyGlow} />

      <div className={styles.philosophyContainer}>
        {/* Header */}
        <div className={styles.philosophyHeader}>
          <div className={styles.philosophyLabel}>Our Philosophy</div>
          <h2 className={styles.philosophyTitle}>
            Design With <span className={styles.philosophyTitleAccent}>Purpose</span>
          </h2>
          <p className={styles.philosophyDescription}>
            We approach every project as a unique opportunity to create meaningful impact.
            Our philosophy is built on three fundamental principles that guide our work.
          </p>
        </div>

        {/* Principles */}
        <div className={styles.principlesGrid}>
          {principles.map((principle, index) => (
            <div
              key={principle.number}
              className={styles.principleCard}
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: isVisible ? 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
              }}
            >
              <div className={styles.principleNumber}>{principle.number}</div>
              <h3 className={styles.principleTitle}>{principle.title}</h3>
              <p className={styles.principleDescription}>{principle.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={styles.statItem}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: isVisible ? 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
              }}
            >
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Image showcase */}
        <div style={{
          marginTop: '80px',
          position: 'relative',
          height: '400px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(240, 240, 238, 0.1)'
        }}>
          <Image
            src="/placeholder-studio.jpg"
            alt="Design studio workspace"
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(196,30,58,0.2) 0%, rgba(17, 24, 39, 0.6) 100%)'
          }} />
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
