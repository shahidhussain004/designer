"use client"

export function VideoBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/landing-poster.svg"
        className="h-full w-full object-cover">
        <source src="/videos/1766537892312202694-0_839a2992.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
