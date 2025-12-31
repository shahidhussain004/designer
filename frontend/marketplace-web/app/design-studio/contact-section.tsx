"use client"

import { ArrowUpRight, CheckCircle, Send } from "lucide-react"
import type React from "react"

import { useState } from "react"

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="relative py-32 lg:py-40 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Info */}
          <div>
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
              <a href="mailto:hello@atelier.design" className="group flex items-center gap-4 w-full hover:translate-x-1 transition-transform duration-200">
                <span className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-all duration-300">
                  <Send className="w-5 h-5 text-foreground group-hover:text-accent transition-colors duration-300" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Email us</p>
                  <p className="text-foreground font-medium group-hover:text-accent transition-colors duration-300">
                    hello@atelier.design
                  </p>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="mt-12 pt-12 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Follow us</p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Dribbble", "Instagram"].map((social) => (
                  <div key={social} className="inline-block transition-transform duration-150 hover:-translate-y-0.5">
                    <a
                      href="#"
                      className="inline-block px-4 py-2 rounded-full border border-border text-sm text-foreground hover:border-accent hover:text-accent transition-all duration-300"
                    >
                      {social}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-card border border-border">
                <div>
                  <CheckCircle className="w-16 h-16 text-accent mb-6" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Message Sent!</h3>
                <p className="text-muted-foreground max-w-sm">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="relative">
                      <label className="absolute left-0 top-4 origin-left pointer-events-none transition-all duration-300 text-muted-foreground">
                        Name
                      </label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      
                      required
                      className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute left-0 top-4 origin-left pointer-events-none transition-all duration-300 text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      
                      required
                      className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="relative">
                  <label className="absolute left-0 top-4 origin-left pointer-events-none transition-all duration-300 text-muted-foreground">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    
                    className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 text-foreground"
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label className="absolute left-0 top-4 origin-left pointer-events-none transition-all duration-300 text-muted-foreground">
                    Tell us about your project
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    
                    required
                    rows={4}
                    className="w-full pt-4 pb-3 bg-transparent border-b-2 border-border focus:border-accent outline-none transition-colors duration-300 resize-none text-foreground"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-5 bg-foreground text-background rounded-full text-sm tracking-wide font-medium transition-all duration-300 hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
