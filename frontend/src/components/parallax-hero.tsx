import React from "react"
import Tilt from "react-parallax-tilt"

interface ParallaxHeroProps {
  imageSrc: string
  alt: string
}

export default function ParallaxHero({ imageSrc, alt }: ParallaxHeroProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const starsRef = React.useRef<HTMLDivElement>(null)
  const [stars, setStars] = React.useState<Array<{ left: number; top: number; size: number; opacity: number; duration: number }>>([])

  React.useEffect(() => {
    // Generate stars once
    const starArray = Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 3 + 2,
    }))
    setStars(starArray)
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && starsRef.current) {
        const scrolled = window.scrollY
        const rate = scrolled * 0.5
        containerRef.current.style.transform = `translateY(${rate}px)`
        starsRef.current.style.transform = `translateY(${scrolled * 0.3}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative w-full h-96 sm:h-[500px] overflow-hidden rounded-2xl">
      {/* Stars background */}
      <div ref={starsRef} className="absolute inset-0 z-10">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s infinite`,
            }}
          />
        ))}
      </div>

      {/* African landscape silhouette */}
      <div className="absolute inset-0 z-20">
        <svg
          viewBox="0 0 1200 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
        >
          {/* Mountain silhouette */}
          <path
            d="M0,600 L100,500 L200,450 L300,400 L400,380 L500,350 L600,370 L700,340 L800,360 L900,330 L1000,350 L1100,380 L1200,400 L1200,600 Z"
            fill="oklch(0.15 0.02 245)"
            className="dark:fill-[oklch(0.25_0.02_245)]"
          />
          {/* Acacia tree silhouette */}
          <g transform="translate(400, 380)">
            <path
              d="M0,220 Q-20,200 -30,180 Q-40,160 -30,140 Q-20,120 0,100 Q20,120 30,140 Q40,160 30,180 Q20,200 0,220 Z"
              fill="oklch(0.15 0.02 245)"
              className="dark:fill-[oklch(0.25_0.02_245)]"
            />
            <rect x="-5" y="100" width="10" height="120" fill="oklch(0.15 0.02 245)" className="dark:fill-[oklch(0.25_0.02_245)]" />
          </g>
          <g transform="translate(800, 360)">
            <path
              d="M0,240 Q-25,220 -35,190 Q-45,160 -35,130 Q-25,100 0,80 Q25,100 35,130 Q45,160 35,190 Q25,220 0,240 Z"
              fill="oklch(0.15 0.02 245)"
              className="dark:fill-[oklch(0.25_0.02_245)]"
            />
            <rect x="-6" y="80" width="12" height="160" fill="oklch(0.15 0.02 245)" className="dark:fill-[oklch(0.25_0.02_245)]" />
          </g>
        </svg>
      </div>

      {/* Parallax image */}
      <Tilt
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        perspective={1000}
        transitionSpeed={2000}
        className="absolute inset-0 z-0"
      >
        <div ref={containerRef} className="relative w-full h-full">
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
      </Tilt>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </div>
  )
}

