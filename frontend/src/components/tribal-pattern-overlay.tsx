interface TribalPatternOverlayProps {
  className?: string
}

export default function TribalPatternOverlay({ className = "" }: TribalPatternOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full opacity-[0.05]"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* African tribal pattern motifs */}
        <defs>
          <pattern id="tribal-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Geometric shapes inspired by African patterns */}
            <path
              d="M50 50 L150 50 L100 150 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground"
            />
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
            <path
              d="M30 100 L170 100 M100 30 L100 170"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground"
            />
            {/* Diamond patterns */}
            <path
              d="M50 100 L100 50 L150 100 L100 150 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-foreground"
            />
            {/* Chevron patterns */}
            <path
              d="M20 100 L50 130 L50 110 L80 130 L80 70 L50 90 L50 70 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground"
            />
            <path
              d="M120 70 L150 90 L150 110 L180 130 L180 100 L150 130 L150 100 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tribal-pattern)" />
      </svg>
    </div>
  )
}

