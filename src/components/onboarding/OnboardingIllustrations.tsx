import type { SVGProps } from 'react'

export function OnboardingHeroIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg" {...props}>
      <defs>
        <linearGradient id="heroBgGrad" x1="40" y1="20" x2="440" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" stopOpacity="0.12" />
          <stop stopColor="#6366f1" stopOpacity="0.04" />
          <stop stopColor="#10b981" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="phoneGrad" x1="180" y1="40" x2="300" y2="250" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e1b4b" />
          <stop stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="waHeaderGrad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="aiCardGrad" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop stopColor="#f5f3ff" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient background glow */}
      <circle cx="240" cy="140" r="130" fill="url(#heroBgGrad)" filter="url(#softGlow)" />
      <circle cx="90" cy="80" r="60" fill="#ede9fe" fillOpacity="0.6" />
      <circle cx="390" cy="200" r="70" fill="#d1fae5" fillOpacity="0.5" />

      {/* Left Floating Card: AI Copilot Handoff */}
      <g transform="translate(40, 50)" className="transition-transform duration-500 hover:translate-y-[-4px]">
        <rect width="150" height="95" rx="14" fill="url(#aiCardGrad)" stroke="#c4b5fd" strokeWidth="1.5" filter="drop-shadow(0 10px 15px rgba(124, 58, 237, 0.1))" />
        <circle cx="28" cy="28" r="14" fill="#8b5cf6" />
        <path d="M24 28h8M28 24v8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        <text x="50" y="25" fill="#1e1b4b" fontSize="11" fontWeight="700" fontFamily="sans-serif">Resolution AI</text>
        <text x="50" y="38" fill="#10b981" fontSize="9" fontWeight="600" fontFamily="sans-serif">98.4% Auto-Resolved</text>
        <rect x="18" y="52" width="114" height="6" rx="3" fill="#e2e8f0" />
        <rect x="18" y="52" width="94" height="6" rx="3" fill="#8b5cf6" />
        <rect x="18" y="68" width="60" height="14" rx="7" fill="#ede9fe" />
        <text x="26" y="79" fill="#6d28d9" fontSize="8" fontWeight="600" fontFamily="sans-serif">Native-70B</text>
      </g>

      {/* Center Phone Display - WhatsApp Cloud API */}
      <g transform="translate(175, 25)">
        {/* Phone Body */}
        <rect width="130" height="230" rx="22" fill="url(#phoneGrad)" stroke="#334155" strokeWidth="3" />
        {/* Notch */}
        <rect x="42" y="6" width="46" height="8" rx="4" fill="#0f172a" />
        {/* Screen */}
        <rect x="6" y="18" width="118" height="204" rx="14" fill="#0b141a" />

        {/* WhatsApp App Bar */}
        <rect x="6" y="18" width="118" height="34" rx="14" fill="url(#waHeaderGrad)" />
        <circle cx="22" cy="35" r="9" fill="#ffffff" fillOpacity="0.25" />
        <circle cx="22" cy="35" r="5" fill="#ffffff" />
        <text x="36" y="33" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="sans-serif">ReSolution Support</text>
        <text x="36" y="42" fill="#d1fae5" fontSize="7" fontWeight="500" fontFamily="sans-serif">Official Business API</text>

        {/* Message bubble from customer */}
        <path d="M12 66h76a8 8 0 018 8v16a8 8 0 01-8 8H20l-8 6V74a8 8 0 018-8z" fill="#1f2c34" />
        <text x="18" y="79" fill="#e9edef" fontSize="7.5" fontFamily="sans-serif">Where is my order #9821?</text>
        <text x="74" y="93" fill="#8696a0" fontSize="6" fontFamily="sans-serif">10:42 AM</text>

        {/* Message bubble from AI Agent */}
        <path d="M118 108H38a8 8 0 00-8 8v28a8 8 0 008 8h72l8 6v-42a8 8 0 00-8-8z" fill="#005c4b" />
        <text x="36" y="122" fill="#e9edef" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">Hi Sarah! 📦 Out for delivery</text>
        <text x="36" y="133" fill="#d1fae5" fontSize="7" fontFamily="sans-serif">with DHL Express. Est: 2 PM today.</text>
        <path d="M100 146l3 3 5-5" stroke="#53bdeb" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M104 146l3 3 5-5" stroke="#53bdeb" strokeWidth="1.2" strokeLinecap="round" />

        {/* Bottom Quick Reply Chips */}
        <rect x="14" y="162" width="48" height="15" rx="7.5" fill="#1f2c34" stroke="#00a884" strokeWidth="1" />
        <text x="20" y="172.5" fill="#25d366" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">Track Live</text>
        <rect x="66" y="162" width="52" height="15" rx="7.5" fill="#1f2c34" stroke="#8696a0" strokeWidth="0.5" />
        <text x="72" y="172.5" fill="#8696a0" fontSize="6.5" fontFamily="sans-serif">Talk to Agent</text>
      </g>

      {/* Right Floating Card: Real-time CSAT / Analytics */}
      <g transform="translate(320, 120)">
        <rect width="135" height="95" rx="14" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" filter="drop-shadow(0 10px 15px rgba(16, 185, 129, 0.12))" />
        <circle cx="26" cy="26" r="12" fill="#10b981" />
        <path d="M21 26l3.5 3.5 6-6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="46" y="24" fill="#0f172a" fontSize="10.5" fontWeight="700" fontFamily="sans-serif">CSAT Score</text>
        <text x="46" y="36" fill="#64748b" fontSize="8" fontFamily="sans-serif">WhatsApp Average</text>
        <text x="18" y="66" fill="#10b981" fontSize="22" fontWeight="800" fontFamily="sans-serif">4.9</text>
        <text x="56" y="65" fill="#94a3b8" fontSize="11" fontWeight="600" fontFamily="sans-serif">/ 5.0</text>
        <path d="M96 56l8-8 8 4 10-10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="78" width="100" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="18" y="78" width="94" height="5" rx="2.5" fill="#10b981" />
      </g>

      {/* Floating Sparkles & Connectors */}
      <g transform="translate(140, 160)">
        <circle cx="0" cy="0" r="12" fill="#7c3aed" fillOpacity="0.1" />
        <path d="M0 -7v14M-7 0h14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(325, 45)">
        <polygon points="6,0 8,4 12,6 8,8 6,12 4,8 0,6 4,4" fill="#f59e0b" />
      </g>
    </svg>
  )
}

export function BusinessProfileIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32" {...props}>
      <circle cx="100" cy="80" r="65" fill="#ede9fe" fillOpacity="0.5" />
      {/* Building / Office Workspace */}
      <rect x="55" y="45" width="90" height="80" rx="8" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
      {/* Roof accent */}
      <path d="M50 48L100 22L150 48" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Windows */}
      <rect x="68" y="60" width="16" height="14" rx="3" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1.2" />
      <rect x="92" y="60" width="16" height="14" rx="3" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1.2" />
      <rect x="116" y="60" width="16" height="14" rx="3" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1.2" />
      {/* Door */}
      <rect x="88" y="92" width="24" height="33" rx="4" fill="#7c3aed" />
      <circle cx="106" cy="108" r="2" fill="#ffffff" />
      {/* Global badge */}
      <circle cx="145" cy="105" r="18" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
      <path d="M138 105a7 7 0 1014 0 7 7 0 10-14 0z" stroke="#10b981" strokeWidth="1.2" />
      <path d="M145 98v14M138 105h14" stroke="#10b981" strokeWidth="1" />
    </svg>
  )
}

export function WhatsAppConnectIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32" {...props}>
      <circle cx="100" cy="80" r="65" fill="#d1fae5" fillOpacity="0.4" />
      {/* Phone */}
      <rect x="65" y="30" width="70" height="105" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <rect x="70" y="42" width="60" height="82" rx="8" fill="#ffffff" />
      {/* WhatsApp Official Logo shape */}
      <circle cx="100" cy="72" r="20" fill="#25d366" />
      <path d="M92 78l1-4c-1-1.5-1.5-3-1.5-5a8.5 8.5 0 1114.5 6 8.5 8.5 0 01-4.8 1.5l-9.2 1.5z" fill="#ffffff" />
      <path d="M97 68c.2-.5.5-.5.7-.5h.6c.2 0 .4 0 .6.4.2.4.7 1.7.7 1.9 0 .1 0 .3-.1.4l-.4.5c-.1.2-.3.3-.2.5.3.6.8 1.4 1.5 1.9.4.4.9.7 1.4.9.2.1.4 0 .5-.1l.6-.7c.1-.2.3-.2.5-.1.2.1 1.3.6 1.5.7.2.1.3.2.3.3 0 .4-.3 1.2-1.3 1.3-.9.1-2.4-.2-4.1-1.8-1.9-1.8-2.6-3.7-2.7-4.6 0-.8.4-1.3.6-1.5z" fill="#25d366" />
      {/* Signal / Cloud Sync Waves */}
      <path d="M142 55c6 5 9 13 9 22s-3 17-9 22" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <path d="M152 48c9 8 14 20 14 32s-5 24-14 32" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
      {/* Verified Badge */}
      <circle cx="125" cy="118" r="12" fill="#059669" />
      <path d="M121 118l3 3 5-5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AIAgentSetupIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32" {...props}>
      <circle cx="100" cy="80" r="65" fill="#ede9fe" fillOpacity="0.4" />
      {/* Bot Head */}
      <rect x="65" y="45" width="70" height="62" rx="16" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" />
      {/* Antenna */}
      <line x1="100" y1="45" x2="100" y2="30" stroke="#7c3aed" strokeWidth="2.5" />
      <circle cx="100" cy="27" r="5" fill="#34d399" />
      {/* Visor */}
      <rect x="74" y="58" width="52" height="24" rx="8" fill="#1e1b4b" />
      {/* Eyes */}
      <circle cx="88" cy="70" r="4" fill="#38bdf8" />
      <circle cx="112" cy="70" r="4" fill="#38bdf8" />
      {/* Smile / soundwave */}
      <path d="M92 94c3 3 13 3 16 0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      {/* Ear nodes */}
      <rect x="57" y="64" width="8" height="18" rx="4" fill="#5b21b6" />
      <rect x="135" y="64" width="8" height="18" rx="4" fill="#5b21b6" />
      {/* Sparkles */}
      <path d="M146 36l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#f59e0b" />
      <path d="M48 95l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#8b5cf6" />
      {/* Bottom badge */}
      <rect x="68" y="118" width="64" height="18" rx="9" fill="#ffffff" stroke="#c4b5fd" strokeWidth="1.2" />
      <text x="76" y="130" fill="#6d28d9" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">Native-70B</text>
    </svg>
  )
}

export function TeamInviteIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32" {...props}>
      <circle cx="100" cy="80" r="65" fill="#e0e7ff" fillOpacity="0.4" />
      {/* Center Member */}
      <g transform="translate(80, 45)">
        <circle cx="20" cy="20" r="20" fill="#6366f1" />
        <circle cx="20" cy="15" r="8" fill="#ffffff" />
        <path d="M8 34c0-6 6-9 12-9s12 3 12 9" fill="#ffffff" />
      </g>
      {/* Left Member */}
      <g transform="translate(42, 65)">
        <circle cx="16" cy="16" r="16" fill="#8b5cf6" />
        <circle cx="16" cy="12" r="6" fill="#ffffff" />
        <path d="M6 28c0-5 5-7 10-7s10 2 10 7" fill="#ffffff" />
      </g>
      {/* Right Member */}
      <g transform="translate(126, 65)">
        <circle cx="16" cy="16" r="16" fill="#10b981" />
        <circle cx="16" cy="12" r="6" fill="#ffffff" />
        <path d="M6 28c0-5 5-7 10-7s10 2 10 7" fill="#ffffff" />
      </g>
      {/* Paper airplane invite */}
      <g transform="translate(130, 25)">
        <path d="M0 12l24-12-10 22-3-8z" fill="#7c3aed" />
        <path d="M11 14l-3 6v-4" stroke="#5b21b6" strokeWidth="1" />
      </g>
      {/* Connecting dashed arc */}
      <path d="M58 80c10-22 74-22 84 0" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  )
}

export function CelebrationIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-52 h-40" {...props}>
      <defs>
        <linearGradient id="trophyGrad" x1="90" y1="40" x2="150" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="90" r="75" fill="#fef3c7" fillOpacity="0.4" />

      {/* Confetti pieces */}
      <circle cx="50" cy="40" r="3" fill="#8b5cf6" />
      <rect x="70" y="25" width="6" height="3" rx="1.5" fill="#ec4899" transform="rotate(25 70 25)" />
      <rect x="175" y="30" width="7" height="3.5" rx="1.5" fill="#10b981" transform="rotate(-30 175 30)" />
      <circle cx="190" cy="55" r="3" fill="#3b82f6" />
      <rect x="40" y="90" width="8" height="3" rx="1.5" fill="#f59e0b" transform="rotate(45 40 90)" />
      <rect x="200" y="105" width="7" height="3.5" rx="1.5" fill="#8b5cf6" transform="rotate(-20 200 105)" />

      {/* Trophy Body */}
      <path d="M85 50h70v30c0 20-15 35-35 35s-35-15-35-35V50z" fill="url(#trophyGrad)" stroke="#b45309" strokeWidth="2" />
      {/* Handles */}
      <path d="M85 58H72c-5 0-8 4-8 9 0 10 7 17 17 18" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M155 58h13c5 0 8 4 8 9 0 10-7 17-17 18" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Stem */}
      <rect x="114" y="115" width="12" height="18" fill="#d97706" />
      {/* Base */}
      <rect x="94" y="133" width="52" height="14" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      <rect x="100" y="136" width="40" height="8" rx="2" fill="#fbbf24" />
      {/* Star emblem */}
      <path d="M120 68l2.5 5 5.5.8-4 3.8 1 5.4-5-2.6-5 2.6 1-5.4-4-3.8 5.5-.8z" fill="#ffffff" />

      {/* Big Sparkle */}
      <path d="M165 45l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f59e0b" />
    </svg>
  )
}

export function EmptyTicketsQueueIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 h-40" {...props}>
      <defs>
        <linearGradient id="emptyGlow" x1="50" y1="30" x2="230" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ede9fe" />
          <stop stopColor="#f5f3ff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="140" cy="100" r="85" fill="url(#emptyGlow)" />
      {/* In-tray body */}
      <rect x="70" y="90" width="140" height="55" rx="10" fill="#ffffff" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M70 115h40l8 12h44l8-12h40" stroke="#8b5cf6" strokeWidth="2" fill="none" />
      {/* Floating check bubble */}
      <circle cx="140" cy="65" r="24" fill="#10b981" />
      <path d="M131 65l6 6 12-12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Small floating chat badge */}
      <circle cx="85" cy="55" r="10" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1.5" />
      <path d="M82 55h6" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      {/* Small WhatsApp badge */}
      <circle cx="195" cy="60" r="12" fill="#d1fae5" stroke="#10b981" strokeWidth="1.5" />
      <path d="M191 60l2.5 2.5 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      {/* Shadow */}
      <ellipse cx="140" cy="158" rx="60" ry="7" fill="#e2e8f0" />
    </svg>
  )
}
