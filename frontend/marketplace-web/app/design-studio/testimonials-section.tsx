"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
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
  },
  {
    id: 2,
    quote:
      "The level of craft and intentionality in their work is unmatched. They don't just design—they create experiences that resonate deeply with users.",
    author: "Michael Torres",
    role: "Founder, Meridian Finance",
    image: "/professional-man-portrait-business-executive.jpg",
  },
  {
    id: 3,
    quote:
      "Atelier brought a perfect balance of creativity and strategy to our project. The results speak for themselves—our engagement increased by 300%.",
    author: "Emma Nakamura",
    role: "Creative Director, Atlas Architecture",
    image: "/creative-professional-woman.png",
  },
]

export function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef as unknown as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" ref={containerRef} className="relative py-32 lg:py-40 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24"
        >
          <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
            <span className="w-8 h-[1px] bg-accent" />
            Testimonials
            <span className="w-8 h-[1px] bg-accent" />
          </span>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight">
            Client <span className="italic font-normal text-accent">voices</span>
          </h2>
        </MotionDiv>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2"
          >
            <Quote className="w-16 h-16 text-accent/20" />
          </MotionDiv>

          {/* Testimonial Content */}
          <div className="relative min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p className="text-2xl lg:text-3xl xl:text-4xl font-medium tracking-tight leading-relaxed text-foreground mb-12">
                  &ldquo;{testimonials[activeIndex].quote}&rdquo;
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-accent/20 ring-offset-4 ring-offset-background">
                    <img
                      src={testimonials[activeIndex].image || "/placeholder.svg"}
                      alt={testimonials[activeIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">{testimonials[activeIndex].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-transparent transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </MotionButton>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-8 bg-accent" : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <MotionButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-transparent transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </MotionButton>
          </div>
        </div>
      </div>
    </section>
  )
}
