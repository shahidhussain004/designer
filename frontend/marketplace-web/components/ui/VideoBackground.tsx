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
        <source src="/videos/designer-ai-video.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
