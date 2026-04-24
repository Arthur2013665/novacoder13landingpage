import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Zap, Shield, Code2, MessageSquare, Brain,
  Rocket, ArrowRight, Check, Globe, Layers, Clock,
  Users, ChevronRight, Play, Target, Heart, Lightbulb,
  Terminal,
  Database, Server, GitBranch, Wand2, Monitor, Package,
  RefreshCw, Upload, FileCode, Eye, Palette, Lock, Gauge,
  Bug, Pencil, Download,
} from 'lucide-react';
import { CodeEditor } from '../components/CodeEditor';
import { ImageGenerator } from '../components/ImageGenerator';
import { DeploymentPanel } from '../components/DeploymentPanel';
import { CookieConsent } from '../components/CookieConsent';

// ============================================
// HOOKS
// ============================================

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function useMouseParallax() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 16) return;
      lastTime = now;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        if (Math.abs(x - lastX) > 0.8 || Math.abs(y - lastY) > 0.8) {
          lastX = x; lastY = y;
          setPosition({ x, y });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          setIsVisible(true);
          observer.disconnect();

          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count, isVisible };
}

// Magnetic pull — outer wrapper floats toward cursor
function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.transition = 'transform 0.08s ease-out';
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  return { ref, onMouseMove, onMouseLeave };
}

// Spotlight + 3-D tilt — applied via event handlers, no extra ref needed
function spotlightHandlers(tiltDeg = 5.5) {
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--spot-x', `${x}px`);
    el.style.setProperty('--spot-y', `${y}px`);
    const rx = ((y / r.height) - 0.5) * -tiltDeg;
    const ry = ((x / r.width) - 0.5) * tiltDeg;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.014, 1.014, 1.014)`;
    el.style.transition = 'transform 0.08s ease-out';
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--spot-x', '-9999px');
    el.style.setProperty('--spot-y', '-9999px');
    el.style.transform = '';
    el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  return { onMouseMove, onMouseLeave };
}

// ============================================
// CURSOR GLOW
// ============================================

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let tx = -400, ty = -400, cx = -400, cy = -400;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    const loop = () => {
      cx += (tx - cx) * 0.072;
      cy += (ty - cy) * 0.072;
      if (ref.current) {
        ref.current.style.transform = `translate(${cx - 220}px, ${cy - 220}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 w-[440px] h-[440px] rounded-full pointer-events-none select-none"
      style={{
        background: 'radial-gradient(circle, rgba(99,102,241,0.055) 0%, rgba(168,85,247,0.025) 45%, transparent 70%)',
        willChange: 'transform',
        zIndex: 1,
      }}
    />
  );
}

// ============================================
// PRIMITIVE COMPONENTS
// ============================================

function ParticleField() {
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 1.5,
      delay: Math.random() * 6,
      duration: Math.random() * 2 + 3,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-nova-400/20 animate-twinkle"
          style={{
            left: p.left, top: p.top,
            width: p.size, height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  );
}

function GlowingOrb({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-full blur-3xl animate-float pointer-events-none ${className}`}
      style={{ willChange: 'transform', ...style }}
    />
  );
}

function AnimatedText({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span
      className="inline-block animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {children}
    </span>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index++));
      } else {
        clearInterval(interval);
      }
    }, 38);

    const cursorInterval = setInterval(() => setShowCursor(p => !p), 520);
    return () => { clearInterval(interval); clearInterval(cursorInterval); };
  }, [text]);

  return (
    <span className="font-mono text-aurora-cyan">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`}>|</span>
    </span>
  );
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 cursor-default ${isVisible ? 'animate-fade-in-down' : 'opacity-0'}`}>
        <Sparkles className="w-3.5 h-3.5 text-nova-400" aria-hidden />
        <span className="text-sm text-dark-300 font-medium">{badge}</span>
      </div>
      <h2
        className={`font-display text-4xl md:text-5xl font-bold mb-5 tracking-tight ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
        style={{ animationDelay: isVisible ? '100ms' : '0ms' }}
      >
        <span className="text-gradient">{title}</span>
      </h2>
      <p
        className={`text-lg text-dark-400 leading-relaxed ${isVisible ? 'animate-reveal-blur' : 'opacity-0'}`}
        style={{ animationDelay: isVisible ? '220ms' : '0ms' }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ============================================
// NAVBAR
// ============================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50 transition-all duration-500 ease-apple ${
        scrolled
          ? 'top-3 left-4 right-4 bg-dark-950/88 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-xl shadow-black/40'
          : 'top-0 left-0 right-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-nova-500/30 animate-ping-slow" aria-hidden />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center animate-glow-pulse shadow-nova relative">
              <Sparkles className="w-4 h-4 text-white" aria-hidden />
            </div>
          </div>
          <span className="font-display text-lg font-bold text-white group-hover:text-gradient transition-all duration-300 tracking-tight">
            Nova AI
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7" role="navigation">
          {['Features', 'Demo', 'Pricing', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-dark-400 hover:text-white transition-colors duration-200 text-sm font-medium relative group cursor-pointer"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-nova-500 to-aurora-purple group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://novacoder13.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-nova text-sm py-2.5 px-5 flex items-center gap-1.5 group"
        >
          <span>Try Nova</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden />
        </a>
      </div>
    </nav>
  );
}

// ============================================
// HERO
// ============================================

function HeroSection({ 
  onOpenCodeEditor, 
  onOpenImageGen, 
  onOpenDeployment 
}: { 
  onOpenCodeEditor: () => void;
  onOpenImageGen: () => void;
  onOpenDeployment: () => void;
}) {
  const mousePos = useMouseParallax();
  const magneticCTA = useMagneticEffect(0.22);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <ParticleField />

      <GlowingOrb className="w-[500px] h-[500px] bg-nova-600/14 -top-48 -left-32" />
      <GlowingOrb className="w-[650px] h-[650px] bg-aurora-purple/9 -bottom-64 -right-48" style={{ animationDelay: '1.5s' }} />
      <GlowingOrb className="w-80 h-80 bg-aurora-cyan/7 top-1/3 right-1/4" style={{ animationDelay: '2.8s' }} />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translate(${mousePos.x * 0.35}px, ${mousePos.y * 0.35}px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10 animate-fade-in-down cursor-default badge-shimmer"
          style={{ animationDelay: '200ms' }}
        >
          <span className="w-2 h-2 rounded-full bg-aurora-cyan animate-pulse flex-shrink-0" aria-hidden />
          <span className="text-sm text-dark-300 font-medium">Powered by Advanced AI</span>
          <ChevronRight className="w-3.5 h-3.5 text-dark-600" aria-hidden />
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.04] tracking-tight">
          <AnimatedText delay={300}>Build with</AnimatedText>
          <br />
          <span className="text-gradient-shine">
            <AnimatedText delay={500}>Nova AI</AnimatedText>
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up opacity-0"
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          The next generation AI coding assistant that understands your vision
          and transforms ideas into production-ready code — instantly.
        </p>

        {/* Code terminal */}
        <div
          className="max-w-lg mx-auto mb-12 animate-fade-in-up opacity-0"
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          <div className="card-premium rounded-2xl p-5 text-left">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/65" aria-hidden />
                <span className="w-3 h-3 rounded-full bg-yellow-500/65" aria-hidden />
                <span className="w-3 h-3 rounded-full bg-green-500/65" aria-hidden />
              </div>
              <span className="text-dark-600 text-xs font-mono ml-1.5">nova.ai — prompt</span>
            </div>
            <div className="font-mono text-sm">
              <span className="text-dark-600">{'> '}</span>
              <TypewriterText text="Build me a modern dashboard with real-time analytics..." />
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 mb-8"
          style={{ animationDelay: '1100ms', animationFillMode: 'forwards' }}
        >
          <div ref={magneticCTA.ref} onMouseMove={magneticCTA.onMouseMove} onMouseLeave={magneticCTA.onMouseLeave} className="inline-block">
            <a
              href="https://novacoder13.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nova text-base py-4 px-10 flex items-center gap-3 group"
            >
              <span>Start Building Free</span>
              <Rocket className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden />
            </a>
          </div>
          <a
            href="#demo"
            className="btn-ghost flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center group-hover:bg-white/14 transition-colors duration-200" aria-hidden>
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <span>Watch Demo</span>
          </a>
        </div>

        {/* Premium Feature Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-12 animate-fade-in-up opacity-0"
          style={{ animationDelay: '1250ms', animationFillMode: 'forwards' }}
        >
          <button
            onClick={onOpenCodeEditor}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-nova-500/10 to-aurora-purple/10 border border-nova-500/30 hover:border-nova-500/60 text-white text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 group"
          >
            <Code2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Open Code Editor</span>
          </button>
          <button
            onClick={onOpenImageGen}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-aurora-pink/10 to-aurora-purple/10 border border-aurora-pink/30 hover:border-aurora-pink/60 text-white text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 group"
          >
            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Generate Image</span>
          </button>
          <button
            onClick={onOpenDeployment}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-aurora-cyan/10 to-aurora-teal/10 border border-aurora-cyan/30 hover:border-aurora-cyan/60 text-white text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 group"
          >
            <Rocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            <span>Deploy Project</span>
          </button>
        </div>

        {/* Trust strip */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-dark-600 animate-fade-in-up opacity-0"
          style={{ animationDelay: '1400ms', animationFillMode: 'forwards' }}
        >
          {[
            { icon: Check, text: 'Free forever' },
            { icon: Shield, text: 'No credit card' },
            { icon: Zap, text: 'Instant access' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-aurora-cyan" aria-hidden />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hover-bob opacity-35" aria-hidden>
        <div className="w-5 h-9 rounded-full border border-white/25 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/55 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

// ============================================
// STATS
// ============================================

function StatsSection() {
  const stats = [
    { value: 10, suffix: 'x', label: 'Faster Development', icon: Zap, color: 'text-aurora-cyan' },
    { value: 0, prefix: '$', suffix: '/mo', label: 'Cost Forever', icon: Heart, color: 'text-aurora-pink' },
    { value: 50, suffix: '+', label: 'Languages Supported', icon: Code2, color: 'text-nova-400' },
    { value: 100, suffix: '%', label: 'Free Always', icon: Shield, color: 'text-aurora-purple' },
  ];

  return (
    <section className="relative py-20 bg-dark-950 overflow-hidden" aria-label="Key metrics">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" aria-hidden />
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  prefix = '',
  suffix = '',
  label,
  icon: Icon,
  color,
  index,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  icon: typeof Zap;
  color: string;
  index: number;
}) {
  const { ref, count, isVisible } = useCountUp(value);
  const sp = spotlightHandlers(4);

  return (
    <div
      ref={ref}
      onMouseMove={sp.onMouseMove}
      onMouseLeave={sp.onMouseLeave}
      className={`text-center p-6 rounded-2xl card-premium card-spotlight cursor-default ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <Icon className={`w-5 h-5 ${color} mx-auto mb-3 opacity-75`} aria-hidden />
      <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight tabular-nums">
        {prefix}{count}{suffix}
      </div>
      <div className="text-dark-500 text-xs font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ============================================
// FEATURES — Bento grid
// ============================================

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Understanding',
      description: 'Nova understands context, intent, and coding patterns to generate exactly what you need. No more guessing what the AI will produce — it thinks like a senior engineer.',
      color: 'from-nova-500 to-nova-700',
      span: 'col-span-12 md:col-span-7',
      tall: true,
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate production-ready code in seconds, not hours. 10x your development speed with instant results.',
      color: 'from-aurora-cyan to-aurora-teal',
      span: 'col-span-12 md:col-span-5',
      tall: true,
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Built-in security best practices. Your code is never stored or shared — privacy guaranteed.',
      color: 'from-aurora-purple to-aurora-pink',
      span: 'col-span-12 md:col-span-5',
      tall: false,
    },
    {
      icon: Code2,
      title: 'Full-Stack Ready',
      description: 'Frontend, backend, databases, and deployment scripts — Nova handles every layer of your stack.',
      color: 'from-aurora-blue to-nova-500',
      span: 'col-span-12 md:col-span-7',
      tall: false,
    },
    {
      icon: MessageSquare,
      title: 'Natural Language',
      description: 'Just describe what you want in plain English. No complex prompts or special syntax needed.',
      color: 'from-aurora-pink to-aurora-purple',
      span: 'col-span-12 md:col-span-6',
      tall: false,
    },
    {
      icon: Layers,
      title: 'Smart Refactoring',
      description: 'Automatically optimize and modernize your existing codebase with intelligent suggestions.',
      color: 'from-aurora-teal to-aurora-cyan',
      span: 'col-span-12 md:col-span-6',
      tall: false,
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-dark-950 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden />
      <GlowingOrb className="w-96 h-96 bg-nova-600/9 top-1/2 -left-24" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Features"
          title="Everything you need to build faster"
          subtitle="Nova AI combines cutting-edge language models with deep coding expertise to deliver an unmatched development experience."
        />

        <div className="grid grid-cols-12 gap-4 mt-16">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  span,
  tall,
  index,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  color: string;
  span: string;
  tall: boolean;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const sp = spotlightHandlers(5);

  return (
    <div
      ref={ref}
      onMouseMove={sp.onMouseMove}
      onMouseLeave={sp.onMouseLeave}
      className={`${span} group relative card-premium card-glow-top card-spotlight rounded-3xl p-7 cursor-default
        hover:shadow-card-hover
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
        ${tall ? 'min-h-60' : 'min-h-48'}
      `}
      style={{ animationDelay: isVisible ? `${index * 75}ms` : '0ms' }}
    >
      {/* Index number */}
      <span className="absolute top-6 right-6 font-mono text-xs text-dark-700 select-none tabular-nums" aria-hidden>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-nova`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={1.75} aria-hidden />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-semibold text-white mb-2.5 group-hover:text-gradient transition-all duration-300 tracking-tight">
        {title}
      </h3>
      <p className="text-dark-500 leading-relaxed text-sm">
        {description}
      </p>

      {/* Hover arrow */}
      <div
        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
        aria-hidden
      >
        <ArrowRight className="w-4 h-4 text-nova-400" />
      </div>
    </div>
  );
}

// ============================================
// 60 FEATURES — Tabbed Showcase
// ============================================

type FeatureItem = { icon: React.ElementType; title: string; desc: string };

const FEATURE_TABS: {
  id: string;
  label: string;
  icon: React.ElementType;
  accent: string;
  glowColor: string;
  features: FeatureItem[];
}[] = [
  {
    id: 'ai',
    label: 'AI Intelligence',
    icon: Brain,
    accent: 'from-nova-500 to-aurora-purple',
    glowColor: 'rgba(99,102,241,0.13)',
    features: [
      { icon: Brain, title: 'Multi-Model AI', desc: 'Switch between GPT-4, Claude, Gemini and Mistral mid-conversation.' },
      { icon: Zap, title: 'Streaming Responses', desc: 'Watch AI output appear token-by-token in real time.' },
      { icon: Layers, title: 'Context Memory', desc: 'Maintains full conversation history with intelligent compression.' },
      { icon: Lightbulb, title: 'Smart Suggestions', desc: 'Follow-up prompts generated automatically from your last reply.' },
      { icon: Shield, title: 'Custom Instructions', desc: 'Persistent system prompts settable per-project or globally.' },
      { icon: MessageSquare, title: 'Voice Input', desc: 'Speak your prompts using built-in speech recognition.' },
      { icon: Eye, title: 'Deep Code Awareness', desc: 'AI reads entire files and codebases, not just snippets.' },
      { icon: Gauge, title: 'Response Modifiers', desc: 'Adjust tone, verbosity, and format with a single click.' },
      { icon: RefreshCw, title: 'Regenerate & Edit', desc: 'Re-run or edit any past prompt to branch your history.' },
      { icon: Download, title: 'Export Chats', desc: 'Download conversations as Markdown, PDF, or JSON.' },
      { icon: Lock, title: 'Private & Secure', desc: 'Your data is never used for AI model training.' },
      { icon: Users, title: 'Team Access', desc: 'Invite collaborators and share workspaces with your team.' },
    ],
  },
  {
    id: 'code',
    label: 'Code & Dev',
    icon: Code2,
    accent: 'from-aurora-cyan to-aurora-teal',
    glowColor: 'rgba(34,211,238,0.10)',
    features: [
      { icon: Code2, title: 'Monaco-Grade Editor', desc: 'VS Code-quality editing with IntelliSense and syntax awareness.' },
      { icon: Monitor, title: 'Multi-File Workspace', desc: 'Open, edit, and switch between multiple files simultaneously.' },
      { icon: FileCode, title: '200+ Languages', desc: 'Accurate syntax highlighting for every major programming language.' },
      { icon: Eye, title: 'Live Diff View', desc: 'See AI-suggested changes highlighted before you accept them.' },
      { icon: Pencil, title: 'In-Chat Code Edit', desc: 'Edit any AI-generated code block directly in the response.' },
      { icon: GitBranch, title: 'Git Integration', desc: 'View diffs and file status alongside your editor.' },
      { icon: Layers, title: 'Split-Panel View', desc: 'Chat on the left, editor and live preview on the right.' },
      { icon: Bug, title: 'Inline Error Hints', desc: 'Compile errors annotated directly on the offending line.' },
      { icon: Terminal, title: 'Keyboard Shortcuts', desc: 'Full shortcut system: Ctrl+N, Ctrl+/, Ctrl+Shift+F and more.' },
      { icon: Package, title: 'Code Snippets', desc: 'Insert common patterns from a searchable snippet library.' },
      { icon: Download, title: 'Export Project', desc: 'Download your entire workspace as a ZIP at any time.' },
      { icon: Upload, title: 'File Upload', desc: 'Drag and drop any file into the chat for instant AI analysis.' },
    ],
  },
  {
    id: 'creative',
    label: 'Creative Studio',
    icon: Palette,
    accent: 'from-aurora-pink to-aurora-purple',
    glowColor: 'rgba(236,72,153,0.10)',
    features: [
      { icon: Wand2, title: 'Text-to-Image', desc: 'Generate stunning images from a plain-English description.' },
      { icon: Sparkles, title: 'Nano Banana Pro', desc: 'Ultra-fast image generation powered by the NBP API.' },
      { icon: GitBranch, title: 'Code-to-Diagram', desc: 'Convert code structure and function calls to visual flowcharts.' },
      { icon: Monitor, title: 'UI Mockup Gen', desc: 'Generate app wireframes and mockups from a description.' },
      { icon: Pencil, title: 'AI Image Editing', desc: 'Modify existing images with plain-English instructions.' },
      { icon: Palette, title: 'Style Transfer', desc: 'Apply any artistic style to photos or design assets.' },
      { icon: Wand2, title: 'Icon Generator', desc: 'Create custom SVG icons in any style, on demand.' },
      { icon: Eye, title: 'Screenshot Analysis', desc: 'Upload a screenshot and ask the AI questions about it.' },
      { icon: Layers, title: 'Architecture Diagrams', desc: 'Auto-generate system architecture and database diagrams.' },
      { icon: RefreshCw, title: 'Batch Generation', desc: 'Generate multiple image variations in a single request.' },
      { icon: Gauge, title: 'AI Upscaling', desc: 'Upscale images to 4× resolution with AI detail preservation.' },
      { icon: Shield, title: 'Background Removal', desc: 'Instant AI background removal from any uploaded image.' },
    ],
  },
  {
    id: 'productivity',
    label: 'Productivity',
    icon: Zap,
    accent: 'from-aurora-teal to-nova-500',
    glowColor: 'rgba(20,184,166,0.10)',
    features: [
      { icon: Clock, title: 'Conversation History', desc: 'Persistent, searchable, exportable chat history forever.' },
      { icon: Layers, title: 'Smart Folders', desc: 'Organize conversations by project automatically.' },
      { icon: FileCode, title: 'Prompt Templates', desc: 'Save and reuse your most effective prompts instantly.' },
      { icon: Zap, title: 'Quick Commands', desc: 'Slash-command shortcuts for your most frequent actions.' },
      { icon: Package, title: 'Bulk Actions', desc: 'Select and delete or export multiple chats at once.' },
      { icon: Monitor, title: 'Focus Mode', desc: 'Distraction-free full-screen chat interface.' },
      { icon: Eye, title: 'Dark / Light Theme', desc: 'System-aware theme with a manual override toggle.' },
      { icon: Gauge, title: 'Compact Mode', desc: 'Dense layout for power users who want more on screen.' },
      { icon: RefreshCw, title: 'Auto Scroll', desc: 'Automatically follow new AI output as it streams in.' },
      { icon: Heart, title: 'Bookmarks', desc: 'Pin important messages for quick reference later.' },
      { icon: Users, title: 'Admin Panel', desc: 'Full user management, audit logs, and moderation tools.' },
      { icon: MessageSquare, title: 'Announcements', desc: 'Push updates and news directly to all users.' },
    ],
  },
  {
    id: 'deploy',
    label: 'Deploy & Ship',
    icon: Rocket,
    accent: 'from-aurora-blue to-nova-500',
    glowColor: 'rgba(59,130,246,0.10)',
    features: [
      { icon: Rocket, title: 'One-Click Deploy', desc: 'Ship to Vercel, Netlify, or Cloudflare Pages instantly.' },
      { icon: Monitor, title: 'Live Web Preview', desc: 'See your app running at a live URL as you build it.' },
      { icon: Globe, title: 'Custom Domains', desc: 'Connect your own domain in under two minutes.' },
      { icon: Lock, title: 'Auto HTTPS', desc: 'SSL certificates provisioned automatically for every deploy.' },
      { icon: GitBranch, title: 'CI/CD Pipeline', desc: 'Automated build and deploy triggered on every push.' },
      { icon: Server, title: 'Edge Functions', desc: 'Deploy serverless functions globally at the edge.' },
      { icon: Zap, title: 'Static CDN Hosting', desc: 'Blazing-fast global CDN delivery for all static assets.' },
      { icon: Database, title: 'Database Provisioning', desc: 'Supabase or PlanetScale DB provisioned in one click.' },
      { icon: Package, title: 'Docker Support', desc: 'Build and push Docker images directly from the editor.' },
      { icon: RefreshCw, title: 'One-Click Rollback', desc: 'Instantly revert to any previous deployment version.' },
      { icon: Gauge, title: 'Real-Time Analytics', desc: 'Live traffic, error rates, and performance monitoring.' },
      { icon: Shield, title: 'Environment Secrets', desc: 'Manage prod and staging environment variables securely.' },
    ],
  },
];

function FeaturesTabSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [gridKey, setGridKey] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  const switchTab = (i: number) => {
    if (i === activeTab) return;
    setActiveTab(i);
    setGridKey(k => k + 1);
  };

  const tab = FEATURE_TABS[activeTab];

  return (
    <section className="relative py-32 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden />
      <GlowingOrb
        className="w-[700px] h-[700px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: tab.glowColor, filter: 'blur(90px)', animation: 'none', transition: 'background 0.5s ease' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="60+ Features"
          title="Built for real developers"
          subtitle="From AI intelligence to one-click deployment — every capability you need, polished to perfection."
        />

        {/* Tab bar */}
        <div
          ref={ref}
          role="tablist"
          aria-label="Feature categories"
          className={`mt-12 flex flex-wrap justify-center gap-2.5 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          {FEATURE_TABS.map((t, i) => {
            const Icon = t.icon;
            const active = i === activeTab;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => switchTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nova-400 ${
                  active
                    ? `bg-gradient-to-r ${t.accent} text-white shadow-nova scale-[1.03]`
                    : 'glass text-dark-400 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature grid — key change re-triggers the stagger animation */}
        <div
          key={gridKey}
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10"
        >
          {tab.features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={`${tab.id}-${i}`}
                {...spotlightHandlers(4)}
                className="card-premium card-glow-top card-spotlight rounded-2xl p-5 group cursor-default hover:shadow-card-hover overflow-hidden animate-fade-in-up opacity-0"
                style={{ animationDelay: `${i * 35}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tab.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-nova flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" strokeWidth={1.75} aria-hidden />
                </div>
                <h4 className="font-display text-sm font-semibold text-white mb-1.5 tracking-tight leading-snug group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h4>
                <p className="text-dark-600 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Count badge */}
        <div
          className={`flex justify-center mt-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '500ms' }}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-nova-400" aria-hidden />
            <span className="text-sm text-dark-400">
              Showing <span className="text-white font-semibold">{tab.features.length}</span> of{' '}
              <span className="text-white font-semibold">60+</span> features across{' '}
              <span className="text-white font-semibold">5</span> categories
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DEMO
// ============================================

function DemoSection() {
  const { ref, isVisible } = useScrollAnimation();

  const codeLines: { indent: number; tokens: { text: string; type: string }[] }[] = [
    { indent: 0, tokens: [{ text: '// Nova AI generated this in 3 seconds', type: 'comment' }] },
    { indent: 0, tokens: [{ text: 'async', type: 'kw' }, { text: ' function ', type: 'default' }, { text: 'getDashboardData', type: 'fn' }, { text: '() {', type: 'default' }] },
    { indent: 1, tokens: [{ text: 'const', type: 'kw' }, { text: ' metrics', type: 'var' }, { text: ' = ', type: 'default' }, { text: 'await', type: 'kw' }, { text: ' fetchMetrics', type: 'fn' }, { text: '()', type: 'default' }] },
    { indent: 1, tokens: [{ text: 'const', type: 'kw' }, { text: ' users', type: 'var' }, { text: ' = ', type: 'default' }, { text: 'await', type: 'kw' }, { text: ' getActiveUsers', type: 'fn' }, { text: '()', type: 'default' }] },
    { indent: 1, tokens: [{ text: 'return', type: 'kw' }, { text: ' { metrics, users, timestamp: ', type: 'default' }, { text: 'Date', type: 'cls' }, { text: '.', type: 'default' }, { text: 'now', type: 'fn' }, { text: '() }', type: 'default' }] },
    { indent: 0, tokens: [{ text: '}', type: 'default' }] },
  ];

  const tokenColor = (type: string) =>
    type === 'comment' ? 'text-dark-600' :
    type === 'kw'      ? 'text-aurora-purple' :
    type === 'fn'      ? 'text-aurora-cyan' :
    type === 'var'     ? 'text-nova-400' :
    type === 'cls'     ? 'text-aurora-pink' :
    'text-dark-200';

  return (
    <section id="demo" className="relative py-32 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-radial from-nova-600/13 via-transparent to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="Live Demo"
          title="See Nova AI in action"
          subtitle="Watch how Nova transforms natural language into production-ready code in real-time."
        />

        <div className={`mt-16 grid md:grid-cols-2 gap-6 items-center transition-all duration-1000 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}>
          {/* Syntax-highlighted code window */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-dark-950/90 shadow-nova-lg">
            {/* Window chrome */}
            <div className="bg-dark-800/70 px-5 py-3 flex items-center gap-3 border-b border-white/[0.05]">
              <div className="flex gap-1.5" aria-hidden>
                <span className="w-3 h-3 rounded-full bg-red-500/65" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/65" />
                <span className="w-3 h-3 rounded-full bg-green-500/65" />
              </div>
              <div className="flex items-center gap-2 ml-2 text-dark-600">
                <Terminal className="w-3.5 h-3.5" aria-hidden />
                <span className="text-xs font-mono">dashboard.ts</span>
              </div>
            </div>
            {/* Code */}
            <div className="p-6 font-mono text-sm space-y-0.5" role="presentation">
              {codeLines.map((line, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-4 animate-fade-in-right opacity-0"
                  style={{ animationDelay: `${isVisible ? 600 + i * 110 : 0}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="text-dark-700 text-xs w-4 text-right flex-shrink-0 tabular-nums select-none" aria-hidden>{i + 1}</span>
                  <span style={{ paddingLeft: `${line.indent * 16}px` }}>
                    {line.tokens.map((tok, j) => (
                      <span key={j} className={tokenColor(tok.type)}>{tok.text}</span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side content */}
          <div className="flex flex-col gap-6 px-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center flex-shrink-0" aria-hidden>
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold tracking-tight">Generated in 3 seconds</div>
                <div className="text-dark-600 text-sm">From a single plain-English prompt</div>
              </div>
            </div>

            {[
              'Production-ready TypeScript code',
              'Best practices applied automatically',
              'Zero configuration needed',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-dark-400 text-sm">
                <div className="w-5 h-5 rounded-full bg-aurora-cyan/12 flex items-center justify-center flex-shrink-0" aria-hidden>
                  <Check className="w-3 h-3 text-aurora-cyan" />
                </div>
                <span>{item}</span>
              </div>
            ))}

            <a
              href="https://novacoder13.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nova inline-flex items-center justify-center gap-2 mt-2 group"
            >
              <span>Try it yourself</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// PRICING
// ============================================

function PricingSection() {
  const { ref, isVisible } = useScrollAnimation();

  const features = [
    'Unlimited AI code generations',
    'Full code completion & refactoring',
    'All programming languages',
    'Unlimited projects',
    'Community support',
    'No credit card required',
  ];

  return (
    <section id="pricing" className="relative py-32 bg-dark-950 overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-radial from-aurora-purple/13 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Pricing"
          title="Free to use, forever"
          subtitle="Nova AI is completely free. No credit card required, no hidden fees, no limits on what you can build."
        />

        <div
          ref={ref}
          className={`mt-16 max-w-sm mx-auto ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
        >
          <div {...spotlightHandlers(3)} className="relative card-premium card-glow-top card-spotlight rounded-3xl p-8 overflow-hidden">
            {/* Popular tab */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 px-5 py-1 rounded-b-xl bg-gradient-to-r from-nova-500 to-aurora-purple text-xs font-semibold text-white tracking-wide">
              Free Forever
            </div>

            <div className="mt-4 mb-7">
              <h3 className="font-display text-2xl font-bold text-white mb-1.5 tracking-tight">Nova AI</h3>
              <p className="text-dark-600 text-sm">Everything included. Nothing held back.</p>
            </div>

            <div className="mb-8 flex items-end gap-2">
              <span className="font-display text-6xl font-bold text-gradient leading-none">$0</span>
              <span className="text-dark-600 text-sm mb-1.5">/month</span>
            </div>

            <ul className="space-y-3 mb-8" role="list">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-dark-400 text-sm">
                  <div className="w-5 h-5 rounded-full bg-aurora-cyan/12 flex items-center justify-center flex-shrink-0" aria-hidden>
                    <Check className="w-3 h-3 text-aurora-cyan" />
                  </div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://novacoder13.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nova block text-center w-full"
            >
              <span>Start Building Free</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ABOUT
// ============================================

function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  const goals = [
    { icon: Target, title: 'Our Mission', description: 'Democratize software development by making AI-powered coding accessible to everyone.', color: 'from-nova-500 to-nova-700' },
    { icon: Lightbulb, title: 'Innovation First', description: 'Pushing the boundaries of what\'s possible with AI, constantly delivering better results.', color: 'from-aurora-cyan to-aurora-teal' },
    { icon: Rocket, title: 'Where We\'re Going', description: 'The most intuitive AI assistant that turns any idea into production-ready code.', color: 'from-aurora-purple to-aurora-pink' },
    { icon: Heart, title: 'Community Driven', description: 'Growing alongside our users, building features that truly matter to real developers.', color: 'from-aurora-pink to-aurora-purple' },
  ];

  return (
    <section id="about" className="relative py-32 bg-dark-950 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-25" aria-hidden />
      <GlowingOrb className="w-96 h-96 bg-aurora-purple/10 -top-24 -right-32" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="About Nova AI"
          title="A vision taking flight"
          subtitle="Nova AI was born in 2026 with one bold dream — to make AI-powered coding truly accessible to everyone."
        />

        {/* Story card */}
        <div className={`mt-16 max-w-4xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card-premium rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nova-500/45 to-transparent" aria-hidden />
            <h3 className="font-display text-2xl font-bold text-white mb-6 tracking-tight">The Beginning</h3>
            <div className="space-y-4 text-dark-500 leading-relaxed">
              <p>
                Nova AI started this year as a solo project by a passionate developer who saw
                an opportunity to revolutionize how software is built. The belief? That AI could
                be more than just autocomplete — it could be a true coding partner.
              </p>
              <p>
                Right now it's one developer and a big dream. Nova AI aims to become the go-to
                AI assistant for developers at all skill levels, making complex tasks simple
                and accessible.
              </p>
              <p>
                This is just the beginning. The vision is a world where anyone with an idea
                can bring it to life through code, regardless of technical background.
              </p>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-nova-500/20 bg-gradient-to-r from-nova-600/10 to-aurora-purple/10">
              <span className="w-2 h-2 rounded-full bg-aurora-cyan animate-pulse flex-shrink-0" aria-hidden />
              <span className="text-dark-400 text-sm font-medium">Solo Developer Project · Est. 2026</span>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div className="mt-24">
          <h3 className={`font-display text-3xl font-bold text-white text-center mb-4 tracking-tight ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            What We're Building Towards
          </h3>
          <p
            className={`text-dark-600 text-center max-w-xl mx-auto mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: '100ms' }}
          >
            Every great journey starts with a single step.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {goals.map((goal, i) => (
              <div
                key={i}
                {...spotlightHandlers(3.5)}
                className={`card-premium card-spotlight rounded-2xl p-6 text-center cursor-default ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 90 + 200}ms` }}
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center mx-auto mb-4`} aria-hidden>
                  <goal.icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <h4 className="font-display text-base font-semibold text-white mb-2 tracking-tight">{goal.title}</h4>
                <p className="text-dark-600 text-sm leading-relaxed">{goal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// DONATION
// ============================================

function DonationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-32 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-20" aria-hidden />
      <GlowingOrb className="w-80 h-80 bg-aurora-pink/7 top-1/2 right-0" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 cursor-default">
            <Heart className="w-4 h-4 text-aurora-pink" aria-hidden />
            <span className="text-sm text-dark-300 font-medium">Support Nova AI</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Love what we're building?
          </h2>
          <p className="text-lg text-dark-500 max-w-xl mx-auto">
            Nova AI is free forever, but your support helps us improve and ship new features.
          </p>
        </div>

        <div
          className={`card-premium rounded-3xl p-8 md:p-12 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
          style={{ animationDelay: isVisible ? '200ms' : '0ms' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aurora-pink to-aurora-purple flex items-center justify-center shadow-aurora" aria-hidden>
                <Heart className="w-9 h-9 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">Support the project</h3>
              <p className="text-dark-500 mb-6 text-sm leading-relaxed max-w-md">
                Every donation helps maintain servers, improve AI models, and build new features for the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="https://www.buymeacoffee.com/novacoder13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nova flex items-center justify-center gap-2 group"
                >
                  <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden />
                  <span>Buy Me a Coffee</span>
                </a>
                <a
                  href="https://github.com/sponsors/novacoder13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex items-center justify-center gap-2"
                >
                  <span>GitHub Sponsors</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.05] grid grid-cols-3 gap-4 text-center">
            {[
              { value: '$0', label: 'Raised' },
              { value: '0', label: 'Supporters' },
              { value: '100%', label: 'Free Forever' },
            ].map(({ value, label }) => (
              <div key={label} className="cursor-default">
                <div className="text-2xl font-display font-bold text-gradient mb-1">{value}</div>
                <div className="text-xs text-dark-600 font-medium uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA
// ============================================

function CTASection() {
  const { ref, isVisible } = useScrollAnimation();
  const magneticCTA = useMagneticEffect(0.2);

  return (
    <section className="relative py-32 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <GlowingOrb className="w-[700px] h-[700px] bg-nova-600/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-700 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
      >
        <div className="card-premium rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nova-500/55 to-transparent" aria-hidden />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-nova-400 animate-pulse" aria-hidden />
            <span className="text-sm text-dark-300">Get started in seconds</span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Ready to{' '}
            <span className="text-gradient">transform</span>
            {' '}your workflow?
          </h2>
          <p className="text-lg text-dark-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Join Nova AI to supercharge your productivity and bring your ideas to life with the power of AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div ref={magneticCTA.ref} onMouseMove={magneticCTA.onMouseMove} onMouseLeave={magneticCTA.onMouseLeave} className="inline-block">
              <a
                href="https://novacoder13.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nova text-lg py-4 px-10 flex items-center gap-3 group"
              >
                <span>Start Building Free</span>
                <Rocket className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden />
              </a>
            </div>
            <div className="flex items-center gap-2 text-dark-600 text-sm">
              <Users className="w-4 h-4" aria-hidden />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FOOTER
// ============================================

function Footer() {
  const productLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Demo', href: '#demo' },
    { label: 'Try Nova', href: 'https://novacoder13.lovable.app', external: true },
  ];

  const socialLinks = [
    { href: 'https://novacoder13.lovable.app', icon: Globe, title: 'Visit Nova AI' },
    { href: 'https://github.com/Arthur2013665/novacoder13landingpage', icon: Code2, title: 'GitHub' },
    { href: 'https://novacoder13.lovable.app', icon: MessageSquare, title: 'Support' },
  ];

  return (
    <footer className="relative bg-dark-950 border-t border-white/[0.045]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center" aria-hidden>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">Nova AI</span>
            </div>
            <p className="text-dark-600 mb-6 max-w-sm text-sm leading-relaxed">
              The next generation AI coding assistant. Build faster, smarter, and more efficiently.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ href, icon: Icon, title }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-dark-600 hover:text-white hover:bg-white/8 transition-all duration-200 cursor-pointer"
                  title={title}
                  aria-label={title}
                >
                  <Icon className="w-4 h-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-5 tracking-widest uppercase opacity-60">Product</h4>
            <ul className="space-y-3" role="list">
              {productLinks.map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-5 tracking-widest uppercase opacity-60">Company</h4>
            <ul className="space-y-3" role="list">
              <li><a href="#about" className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer">About</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-5 tracking-widest uppercase opacity-60">Legal</h4>
            <ul className="space-y-3" role="list">
              <li><Link to="/privacy" className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer">Terms of Service</Link></li>
              <li><a href="#" className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer">Security</a></li>
              <li><a href="#" className="text-dark-600 hover:text-dark-300 transition-colors duration-200 text-sm cursor-pointer">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-700 text-sm">© 2026 Nova AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-dark-700 hover:text-dark-500 transition-colors text-sm cursor-pointer">Privacy</Link>
            <Link to="/terms" className="text-dark-700 hover:text-dark-500 transition-colors text-sm cursor-pointer">Terms</Link>
            <div className="flex items-center gap-2 text-dark-700 text-sm">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              <span>Built with{' '}
                <a
                  href="https://novacoder13.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nova-700 hover:text-nova-500 transition-colors cursor-pointer"
                >
                  Nova AI
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// PAGE
// ============================================

export default function HomePage() {
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showImageGen, setShowImageGen] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <CursorGlow />
      <Navbar />
      <HeroSection 
        onOpenCodeEditor={() => setShowCodeEditor(true)}
        onOpenImageGen={() => setShowImageGen(true)}
        onOpenDeployment={() => setShowDeployment(true)}
      />
      <StatsSection />
      <AboutSection />
      <FeaturesSection />
      <FeaturesTabSection />
      <DemoSection />
      <PricingSection />
      <DonationSection />
      <CTASection />
      <Footer />
      
      {/* Premium Features */}
      {showCodeEditor && <CodeEditor onClose={() => setShowCodeEditor(false)} />}
      {showImageGen && <ImageGenerator onClose={() => setShowImageGen(false)} />}
      {showDeployment && <DeploymentPanel onClose={() => setShowDeployment(false)} />}
      <CookieConsent />
    </div>
  );
}
