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
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    paddingTop: "20px",
    paddingBottom: "12px",
    background: "transparent",
    borderBottom: `1px solid ${focusedField === field ? "#00E5C5" : "rgba(240,240,238,0.1)"}`,
    outline: "none",
    color: "#F0F0EE",
    fontSize: "15px",
    transition: "border-color 0.3s ease",
    boxSizing: "border-box" as const,
  })

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "rgba(240,240,238,0.35)",
    marginBottom: "0px",
  }

  return (
    <section
      id="contact"
      style={{ position: "relative", padding: "120px 0 160px", background: "#0D0E14" }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,229,197,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,197,0.025) 1px, transparent 1px)",
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
          background: "linear-gradient(90deg, transparent, rgba(0,229,197,0.25), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(0,229,197,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "96px" }}>
          {/* Left Info */}
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#00E5C5",
                marginBottom: "24px",
              }}
            >
              <span style={{ width: "32px", height: "1px", background: "#00E5C5", display: "block" }} />
              Contact
            </span>
            <h2
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "#F0F0EE",
                margin: "0 0 32px",
              }}
            >
              Let's create{" "}
              <span style={{ color: "#00E5C5", fontStyle: "italic", fontWeight: 300 }}>together</span>
            </h2>
            <p
              style={{
                fontSize: "17px",
                color: "rgba(240,240,238,0.45)",
                lineHeight: 1.7,
                maxWidth: "400px",
                margin: "0 0 56px",
              }}
            >
              Ready to transform your vision into reality? We'd love to hear about your project and explore how we can
              bring it to life.
            </p>

            {/* Email link */}
            <a
              href="mailto:hello@atelier.design"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "16px",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(4px)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateX(0)" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(240,240,238,0.04)",
                  border: "1px solid rgba(240,240,238,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send style={{ width: "18px", height: "18px", color: "#00E5C5" }} />
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "rgba(240,240,238,0.35)", margin: "0 0 4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Email us
                </p>
                <p style={{ fontSize: "15px", color: "#F0F0EE", margin: 0, fontWeight: 500 }}>
                  hello@atelier.design
                </p>
              </div>
            </a>

            {/* Social */}
            <div style={{ marginTop: "56px", paddingTop: "40px", borderTop: "1px solid rgba(240,240,238,0.07)" }}>
              <p style={{ fontSize: "11px", color: "rgba(240,240,238,0.3)", marginBottom: "16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Follow us
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["Twitter", "LinkedIn", "Dribbble", "Instagram"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    style={{
                      display: "inline-block",
                      padding: "7px 16px",
                      borderRadius: "100px",
                      border: "1px solid rgba(240,240,238,0.1)",
                      fontSize: "12px",
                      color: "rgba(240,240,238,0.5)",
                      textDecoration: "none",
                      letterSpacing: "0.05em",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = "rgba(0,229,197,0.4)"
                      el.style.color = "#00E5C5"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = "rgba(240,240,238,0.1)"
                      el.style.color = "rgba(240,240,238,0.5)"
                    }}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div>
            {isSubmitted ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "64px 48px",
                  borderRadius: "12px",
                  background: "#0A0B0F",
                  border: "1px solid rgba(0,229,197,0.2)",
                }}
              >
                <CheckCircle style={{ width: "56px", height: "56px", color: "#00E5C5", marginBottom: "24px" }} />
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#F0F0EE", margin: "0 0 12px" }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize: "15px", color: "rgba(240,240,238,0.45)", maxWidth: "280px", lineHeight: 1.7, margin: 0 }}>
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                {/* Name & Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={inputStyle("name")}
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      required
                      style={inputStyle("email")}
                    />
                  </div>
                </div>

                {/* Company */}
                <div style={{ marginBottom: "32px" }}>
                  <label style={labelStyle}>Company (Optional)</label>
                  <input
                    type="text"
                    value={formState.company}
                    onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("company")}
                  />
                </div>

                {/* Message */}
                <div style={{ marginBottom: "40px" }}>
                  <label style={labelStyle}>Tell us about your project</label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={4}
                    style={{
                      ...inputStyle("message"),
                      resize: "none",
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    padding: "16px 32px",
                    background: isSubmitting ? "rgba(0,229,197,0.6)" : "#00E5C5",
                    color: "#0A0B0F",
                    borderRadius: "100px",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                    fontWeight: 700,
                    border: "none",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#00CCB1"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = "#00E5C5"
                    }
                  }}
                >
                  {isSubmitting ? (
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid rgba(10,11,15,0.3)",
                        borderTop: "2px solid #0A0B0F",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowUpRight style={{ width: "14px", height: "14px" }} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}