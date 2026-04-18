"use client"

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description: "We align on goals, audience, constraints, and the business context behind the brief.",
  },
  {
    number: "02",
    title: "Define",
    description: "We shape strategy, establish direction, and prioritize what the experience must accomplish.",
  },
  {
    number: "03",
    title: "Design",
    description: "We translate ideas into sharp visual systems, interfaces, and brand moments with intent.",
  },
  {
    number: "04",
    title: "Deliver",
    description: "We refine, finalize, and hand off production-ready outcomes built to move confidently into launch.",
  },
]

export function DesignProcess() {

  return (
    <section
      id="design-process"
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
          top: 0,
          left: 0,
          right: 0,
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
            Our Design <span style={{ color: "#C41E3A", fontStyle: "italic", fontWeight: 300 }}>Process</span>
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(240,240,238,0.4)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            A collaborative approach that ensures your vision becomes reality
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", position: "relative" }}>
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
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: index === 0 ? "#C41E3A" : "#111827",
                  border: `2px solid ${index === 0 ? "#C41E3A" : "rgba(196,30,58,0.3)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#C41E3A"
                  el.style.borderColor = "#C41E3A"
                  const num = el.querySelector("span") as HTMLElement | null
                  if (num) num.style.color = "#F0F0EE"
                }}
                onMouseLeave={(e) => {
                  if (index !== 0) {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = "#111827"
                    el.style.borderColor = "rgba(196,30,58,0.3)"
                    const num = el.querySelector("span") as HTMLElement | null
                    if (num) num.style.color = "#C41E3A"
                  }
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: index === 0 ? "#F0F0EE" : "#C41E3A",
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
    </section>
  )
}