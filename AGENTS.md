## Nova AI Landing Page

A stunning, modern landing page for Nova AI (https://novacoder13.lovable.app) - an AI coding assistant.

This is a **static landing page** showcasing Nova AI's features, pricing, and information. It's designed to convert visitors and drive them to the actual Nova AI application.

### Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Design System

**Color Palette:**
- Nova brand: Deep indigo/purple (#6366f1, #4f46e5, #312e81)
- Aurora accents: Cyan (#22d3ee), Teal (#14b8a6), Purple (#a855f7), Pink (#ec4899)
- Dark backgrounds: Near-black (#020617) to slate tones

**Fonts (Google Fonts):**
- Display/Headings: Space Grotesk
- Body: Inter
- Code: JetBrains Mono

**60+ Custom Animations:**
- Apple-inspired (30): fade-in variants, scale animations, slide animations, blur effects, reveal animations, text animations, parallax/3D, morph effects
- Custom Nova (30+): glow effects, floating/levitation, particle effects, wave effects, gradient animations, typewriter, loading states, entrance specials, interactive effects, background effects, card effects

### Pages

- **HomePage** - Full landing page with:
  - Animated navbar with glass morphism on scroll
  - Hero section with particle field, glowing orbs, typewriter effect, mouse parallax
  - Features grid with 6 feature cards
  - Live demo section with browser mockup
  - Testimonials with 3 cards
  - Pricing with 3 tiers (Free, Pro, Enterprise)
  - About section with company story, values, stats, and team
  - CTA section
  - Full footer with navigation links to Terms and Privacy

- **TermsPage** - Terms of Service with 14 sections covering:
  - Agreement, Services, Account, Acceptable Use, IP, Payments, Disclaimers, Liability, etc.

- **PrivacyPage** - Privacy Policy with 12 sections covering:
  - Information collection, Code data & AI processing, Usage, Sharing, Security, Rights, etc.

- **NotFoundPage** - 404 error page

### Key Features

- Scroll-triggered animations using Intersection Observer
- Mouse parallax effects
- Glass morphism UI components
- Gradient text effects with shimmer animation
- Typewriter text effect
- Custom hooks: `useScrollAnimation()`, `useMouseParallax()`
- All CTAs link to: https://novacoder13.lovable.app

### Project Structure

```
/
├── src/
│   └── client/
│       ├── assets/          # Images and SVG files
│       ├── components/      # Reusable UI components
│       │   └── ui/          # Base UI components (Button, Card, Input, Label)
│       ├── lib/             # Utility functions
│       ├── pages/           # Page components
│       ├── index.css        # Design system with CSS variables, glass styles, gradients
│       ├── index.html       # HTML entry point
│       ├── index.tsx        # React app entry point
│       └── router.tsx       # React Router configuration
├── tailwind.config.js       # Extended with 60+ animations, custom colors, fonts
├── vite.config.ts           # Vite configuration
└── package.json             # Dependencies and scripts
```

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Notes

- Pure static site - no backend required
- Uses Lucide React for icons
- No external animation libraries - all CSS/Tailwind animations
- Responsive design with mobile-first approach
- Dark theme throughout
