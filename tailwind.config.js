/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/client/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nova: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        aurora: {
          cyan: '#22d3ee',
          teal: '#14b8a6',
          purple: '#a855f7',
          pink: '#ec4899',
        },
        dark: {
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'nova-lg': '0 0 80px -20px rgba(99, 102, 241, 0.6)',
      },
      // Essential animations + extras for variety
      animation: {
        // Fade animations
        'fade-in': 'fadeIn 0.8s ease-out both',
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
        'fade-in-down': 'fadeInDown 0.8s ease-out both',
        'fade-in-left': 'fadeInLeft 0.8s ease-out both',
        'fade-in-right': 'fadeInRight 0.8s ease-out both',
        
        // Scale animations
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-up': 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'zoom-in': 'zoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        
        // Slide animations
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-down': 'slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-right': 'slideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        
        // Rotate animations
        'rotate-in': 'rotateIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'flip-in': 'flipIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        
        // Bounce animations
        'bounce-in': 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both',
        
        // Glow & pulse effects (infinite)
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // Float effects (infinite)
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 1s infinite',
        'hover-bob': 'hoverBob 2s ease-in-out infinite',
        
        // Particle effects (infinite)
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        
        // Utility animations
        'bounce': 'bounce 1s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        // Fade keyframes
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Scale keyframes
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Slide keyframes
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-100px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        
        // Rotate keyframes
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-200deg) scale(0)' },
          '100%': { opacity: '1', transform: 'rotate(0) scale(1)' },
        },
        flipIn: {
          '0%': { opacity: '0', transform: 'perspective(400px) rotateY(90deg)' },
          '100%': { opacity: '1', transform: 'perspective(400px) rotateY(0)' },
        },
        
        // Bounce keyframes
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Glow & pulse keyframes
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 60px rgba(99, 102, 241, 0.8)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        
        // Float keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        hoverBob: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(5px)' },
        },
        
        // Particle keyframes
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: '1' },
        },
        
        // Utility keyframes
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
