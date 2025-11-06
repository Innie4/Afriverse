interface AuroraBackgroundProps {
  className?: string
}

export default function AuroraBackground({ className = "" }: AuroraBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            conic-gradient(
              from 0deg at 50% 50%,
              oklch(0.65 0.18 160) 0deg,
              oklch(0.75 0.15 50) 60deg,
              oklch(0.65 0.18 250) 120deg,
              oklch(0.75 0.15 50) 180deg,
              oklch(0.65 0.18 160) 240deg,
              oklch(0.75 0.15 50) 300deg,
              oklch(0.65 0.18 160) 360deg
            )
          `,
          filter: "blur(80px)",
          transform: "scale(1.2)",
        }}
      />
      {/* Secondary layer for more depth */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-15"
        style={{
          background: `
            conic-gradient(
              from 180deg at 30% 70%,
              oklch(0.7 0.15 200) 0deg,
              oklch(0.8 0.12 60) 90deg,
              oklch(0.7 0.15 280) 180deg,
              oklch(0.8 0.12 40) 270deg,
              oklch(0.7 0.15 200) 360deg
            )
          `,
          filter: "blur(100px)",
          transform: "scale(1.5)",
        }}
      />
    </div>
  )
}

