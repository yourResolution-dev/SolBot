import type { SVGProps } from 'react'

export function EmptyTicketsIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-36" {...props}>
      <defs>
        <linearGradient id="violetGlow" x1="40" y1="20" x2="200" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop stopColor="#c4b5fd" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="ticketGradient" x1="70" y1="40" x2="170" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop stopColor="#f5f3ff" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="90" r="72" fill="url(#violetGlow)" />
      
      {/* Background ticket */}
      <rect x="58" y="52" width="124" height="78" rx="14" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5" transform="rotate(-6 120 90)" />
      
      {/* Main Ticket */}
      <rect x="54" y="44" width="132" height="88" rx="14" fill="url(#ticketGradient)" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.5" />
      
      {/* Ticket notches */}
      <circle cx="54" cy="88" r="6" fill="#f8fafc" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="186" cy="88" r="6" fill="#f8fafc" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="68" y1="88" x2="172" y2="88" stroke="#ddd6fe" strokeWidth="1.5" strokeDasharray="4 4" />
      
      {/* Content lines */}
      <rect x="72" y="60" width="46" height="6" rx="3" fill="#7c3aed" />
      <rect x="72" y="72" width="80" height="4" rx="2" fill="#cbd5e1" />
      <rect x="72" y="102" width="60" height="5" rx="2.5" fill="#94a3b8" />
      <circle cx="156" cy="106" r="10" fill="#ecfdf5" />
      <path d="M152 106L155 109L161 103" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EmptyAutomationsIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-36" {...props}>
      <defs>
        <linearGradient id="autoGradient" x1="30" y1="30" x2="210" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" stopOpacity="0.2" />
          <stop stopColor="#ede9fe" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="90" r="70" fill="url(#autoGradient)" />
      
      {/* Nodes */}
      <rect x="42" y="72" width="44" height="36" rx="10" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.5" />
      <path d="M56 86h16M56 94h10" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      
      <rect x="154" y="44" width="48" height="36" rx="10" fill="#ffffff" stroke="#10b981" strokeWidth="1.5" />
      <circle cx="178" cy="62" r="6" fill="#d1fae5" />
      
      <rect x="154" y="100" width="48" height="36" rx="10" fill="#ffffff" stroke="#6366f1" strokeWidth="1.5" />
      <path d="M168 118h20" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

      {/* Connectors */}
      <path d="M86 90C114 90 120 62 154 62" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M86 90C114 90 120 118 154 118" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="3 3" />
      
      <circle cx="120" cy="90" r="14" fill="#7c3aed" />
      <path d="M116 86l8 4-8 4v-8z" fill="#ffffff" />
    </svg>
  )
}

export function ResolutionLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="resLogoGradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" stopOpacity="0.8" />
          <stop stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#resLogoGradient)" />
      <rect x="2" y="2" width="32" height="32" rx="8" stroke="url(#accentGlow)" strokeWidth="1" strokeOpacity="0.5" />
      {/* Central R + Chat Spark */}
      <path d="M11 10h7a5 5 0 015 5c0 3.5-2.5 5-5 5h-7V10z" fill="#ffffff" />
      <path d="M16 19l6.5 8h-4.5L13 20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="15" r="2.2" fill="#7c3aed" />
      {/* Sparkle */}
      <path d="M26 8l1 2.5L29.5 11.5 27 12.5 26 15l-1-2.5L22.5 11.5 25 10.5 26 8z" fill="#34d399" />
    </svg>
  )
}
