"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowUpRight, Send, CheckCircle } from "lucide-react"

export function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" ref={containerRef} className="relative py-32 lg:py-40 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              Contact
            </span>
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight mb-8">
              Let&apos;s create <span className="italic font-normal text-accent">together</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-lg">
              Ready to transform your vision into reality? We&apos;d love to hear about your project and explore how we
              can help bring it to life.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <motion.a
                href="mailto:hello@atelier.design"
                whileHover={{ x: 4 }}
                className="group flex items-center gap-4"
              >
                <span className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
                  <Send className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Email us</p>
                  <p className="text-foreground font-medium group-hover:text-accent transition-colors duration-300">
                    hello@atelier.design
                  </p>
                </div>
              </motion.a>
            </div>

            {/* Social Links */}
            <div className="mt-12 pt-12 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Follow us</p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Dribbble", "Instagram"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="px-4 py-2 rounded-full border border-border text-sm text-foreground hover:border-accent hover:text-accent transition-all duration-300"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-card border border-border"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 text-accent mb-6" />
                </motion.div>
                <h3 className="text-2xl font-medium mb-4">Message Sent!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <motion.label
                      animate={{
                        y: focusedField === "name" || formState.name ? -24 : 0,
                        scale: focusedField === "name" || formState.name ? 0.85 : 1,
                        color: focusedField === "name" ? "var(--accent)" : "var(--muted-foreground)",
                      }}
                      className="absolute left-0 top-4 text-muted-foreground origin-left pointer-events-none transition-all duration-300"
                    >
                      Name
                    </motion.label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                    />
                  </div>
                  <div className="relative">
                    <motion.label
                      animate={{
                        y: focusedField === "email" || formState.email ? -24 : 0,
                        scale: focusedField === "email" || formState.email ? 0.85 : 1,
                        color: focusedField === "email" ? "var(--accent)" : "var(--muted-foreground)",
                      }}
                      className="absolute left-0 top-4 text-muted-foreground origin-left pointer-events-none transition-all duration-300"
                    >
                      Email
                    </motion.label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="relative">
                  <motion.label
                    animate={{
                      y: focusedField === "company" || formState.company ? -24 : 0,
                      scale: focusedField === "company" || formState.company ? 0.85 : 1,
                      color: focusedField === "company" ? "var(--accent)" : "var(--muted-foreground)",
                    }}
                    className="absolute left-0 top-4 text-muted-foreground origin-left pointer-events-none transition-all duration-300"
                  >
                    Company (Optional)
                  </motion.label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <motion.label
                    animate={{
                      y: focusedField === "message" || formState.message ? -24 : 0,
                      scale: focusedField === "message" || formState.message ? 0.85 : 1,
                      color: focusedField === "message" ? "var(--accent)" : "var(--muted-foreground)",
                    }}
                    className="absolute left-0 top-4 text-muted-foreground origin-left pointer-events-none transition-all duration-300"
                  >
                    Tell us about your project
                  </motion.label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={4}
                    className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 resize-none text-foreground"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-full text-sm tracking-wide font-medium transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                    />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
