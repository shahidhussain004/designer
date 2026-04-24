"use client"

import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import styles from './design-studio.module.css'

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className={styles.hero}>
      {/* Animated grid background */}
      <div className={styles.heroGrid} />
      
      {/* Radial gradient overlay */}
      <div className={styles.heroGradient} />
      
      {/* Floating orbs - pure CSS */}
      <div className={styles.orb} style={{ top: '20%', left: '10%' }} />
      <div className={styles.orb} style={{ top: '60%', right: '15%' }} />
      <div className={styles.orb} style={{ bottom: '20%', left: '25%' }} />

      <div className={`${styles.heroContent} ${isLoaded ? styles.loaded : ''}`}>
        <div className={styles.heroLabel}>
          <span className={styles.dot} />
          Design Studio
        </div>

        <h1 className={styles.heroTitle}>
          Crafting Digital
          <br />
          <span className={styles.heroTitleAccent}>Experiences</span>
          <br />
          That Matter
        </h1>

        <p className={styles.heroSubtitle}>
          We transform ambitious ideas into compelling digital realities through
          <br />
          strategic thinking, meticulous craft, and innovative design solutions.
        </p>

        <div className={styles.heroActions}>
          <a href="#services" className={styles.heroCta}>
            Explore Our Work
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#philosophy" className={styles.heroCtaSecondary}>
            Our Approach
          </a>
        </div>

        {/* Stats ticker */}
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>150+</div>
            <div className={styles.heroStatLabel}>Projects Delivered</div>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>98%</div>
            <div className={styles.heroStatLabel}>Client Satisfaction</div>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <div className={styles.heroStatValue}>15+</div>
            <div className={styles.heroStatLabel}>Years Experience</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#philosophy" className={styles.heroScroll}>
        <ArrowDown className={styles.heroScrollIcon} />
        <span>Scroll to explore</span>
      </a>
    </section>
  )
}
