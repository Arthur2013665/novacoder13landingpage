import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Shield,
  Code2,
  MessageSquare,
  Brain,
  Rocket,
  ArrowRight,
  Check,
  Globe,
  Cpu,
  Layers,
  Clock,
  Users,
  ChevronRight,
  Play,
  Target,
  Heart,
  Lightbulb
} from 'lucide-react';

// ============================================
// ANIMATION HOOKS
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
    const throttleMs = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      
      // Throttle to max 60fps
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15; // Reduced from 20
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        // Only update if position changed significantly
        if (Math.abs(x - lastX) > 1 || Math.abs(y - lastY) > 1) {
          lastX = x;
          lastY = y;
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

// ============================================
// ANIMATED COMPONENTS
// ============================================

function ParticleField() {
  // Reduced to 10 particles and memoized
  const particles = useRef(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 3,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-nova-400/30 animate-twinkle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  );
}

function GlowingOrb({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl animate-float ${className}`}
      style={{ willChange: 'transform' }}
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
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40); // Faster typing

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [text]);

  return (
    <span className="font-mono text-aurora-cyan">
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </span>
  );
}

// ============================================
// SECTION COMPONENTS
// ============================================

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-apple ${
        scrolled ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center animate-glow-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white group-hover:text-gradient transition-all duration-300">
            Nova AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Demo', 'Pricing', 'About'].map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-dark-300 hover:text-white transition-colors duration-300 text-sm font-medium relative group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-nova-500 to-aurora-purple group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <a
          href="https://novacoder13.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-nova text-sm py-2.5 px-6 flex items-center gap-2 group"
        >
          <span>Try Nova</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  const mousePos = useMouseParallax();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh" />
      <ParticleField />

      {/* Animated Orbs */}
      <GlowingOrb className="w-96 h-96 bg-nova-600/20 -top-48 -left-48" />
      <GlowingOrb className="w-[500px] h-[500px] bg-aurora-purple/15 -bottom-64 -right-64 animation-delay-1000" />
      <GlowingOrb className="w-72 h-72 bg-aurora-cyan/10 top-1/3 right-1/4 animation-delay-2000" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-down"
          style={{ animationDelay: '200ms' }}
        >
          <span className="w-2 h-2 rounded-full bg-aurora-cyan animate-pulse" />
          <span className="text-sm text-dark-200">Powered by Advanced AI</span>
          <ChevronRight className="w-4 h-4 text-dark-400" />
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <AnimatedText delay={300}>Build with</AnimatedText>
          <br />
          <span className="text-gradient-shine">
            <AnimatedText delay={500}>Nova AI</AnimatedText>
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-8 animate-fade-in-up opacity-0"
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          The next generation AI coding assistant that understands your vision
          and transforms ideas into production-ready code.
        </p>

        {/* Typewriter Demo */}
        <div
          className="max-w-xl mx-auto mb-12 animate-fade-in-up opacity-0"
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          <div className="glass rounded-2xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="font-mono text-sm">
              <span className="text-dark-400">{'>'} </span>
              <TypewriterText text="Build me a modern dashboard with real-time analytics..." />
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0"
          style={{ animationDelay: '1100ms', animationFillMode: 'forwards' }}
        >
          <a
            href="https://novacoder13.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-nova text-lg py-4 px-10 flex items-center gap-3 group"
          >
            <span>Start Building Free</span>
            <Rocket className="w-5 h-5 group-hover:animate-bounce" />
          </a>
          <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all duration-300 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <span>Watch Demo</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hover-bob">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Understanding',
      description: 'Nova understands context, intent, and coding patterns to generate exactly what you need.',
      color: 'from-nova-500 to-nova-700',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate production-ready code in seconds, not hours. 10x your development speed.',
      color: 'from-aurora-cyan to-aurora-teal',
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'Built-in security best practices. Your code is never stored or shared.',
      color: 'from-aurora-purple to-aurora-pink',
    },
    {
      icon: Code2,
      title: 'Full-Stack Ready',
      description: 'From frontend React to backend APIs, databases to deployment scripts.',
      color: 'from-aurora-blue to-nova-500',
    },
    {
      icon: MessageSquare,
      title: 'Natural Language',
      description: 'Just describe what you want in plain English. No complex prompts needed.',
      color: 'from-aurora-pink to-aurora-purple',
    },
    {
      icon: Layers,
      title: 'Smart Refactoring',
      description: 'Automatically optimize and improve your existing codebase.',
      color: 'from-aurora-teal to-aurora-cyan',
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-dark-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <SectionHeader
          badge="Features"
          title="Everything you need to build faster"
          subtitle="Nova AI combines cutting-edge language models with deep coding expertise to deliver an unmatched development experience."
        />

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  badge,
  title,
  subtitle
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 ${
          isVisible ? 'animate-fade-in-down' : 'opacity-0'
        }`}
      >
        <Sparkles className="w-4 h-4 text-nova-400" />
        <span className="text-sm text-dark-200">{badge}</span>
      </div>
      <h2
        className={`font-display text-4xl md:text-5xl font-bold mb-6 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={{ animationDelay: isVisible ? '100ms' : '0ms' }}
      >
        <span className="text-gradient">{title}</span>
      </h2>
      <p
        className={`text-lg text-dark-300 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={{ animationDelay: isVisible ? '200ms' : '0ms' }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  index
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`group relative p-8 rounded-3xl glass glass-hover ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:animate-glow-pulse transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      <p className="text-dark-300 leading-relaxed">
        {description}
      </p>

      {/* Hover Arrow */}
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-5 h-5 text-nova-400" />
      </div>
    </div>
  );
}

function DemoSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="demo" className="relative py-32 bg-dark-900 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-nova-600/20 via-transparent to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionHeader
          badge="Live Demo"
          title="See Nova AI in action"
          subtitle="Watch how Nova transforms natural language into production-ready code in real-time."
        />

        {/* Demo Preview */}
        <div
          className={`mt-16 relative transition-all duration-1000 ${
            isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
          }`}
        >
          {/* Browser Frame */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-nova-lg">
            {/* Browser Header */}
            <div className="bg-dark-800 px-6 py-4 flex items-center gap-4 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1.5 rounded-lg bg-dark-700 text-dark-400 text-sm font-mono">
                  novacoder13.lovable.app
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-dark-950 p-8 md:p-12 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center mx-auto mb-6 animate-float">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                  Experience Nova AI
                </h3>
                <p className="text-dark-300 mb-8 max-w-md mx-auto">
                  Click below to try Nova AI and see how it transforms your development workflow.
                </p>
                <a
                  href="https://novacoder13.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nova inline-flex items-center gap-3 group"
                >
                  <span>Launch Nova AI</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-3xl glass animate-float hidden lg:flex items-center justify-center">
            <Code2 className="w-12 h-12 text-aurora-cyan" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-3xl glass animate-float-delayed hidden lg:flex items-center justify-center">
            <Cpu className="w-12 h-12 text-aurora-purple" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      description: 'Everything you need to get started',
      features: [
        'Unlimited AI generations',
        'Full code completion',
        'Community support',
        'Unlimited projects',
        'All features included',
        'No credit card required',
      ],
      cta: 'Start Building Free',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-32 bg-dark-950 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-aurora-purple/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="Pricing"
          title="Free to use, forever"
          subtitle="Nova AI is completely free. No credit card required, no hidden fees, no limits."
        />

        <div className="flex justify-center mt-16">
          {plans.map((plan, i) => (
            <PricingCard key={i} {...plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  popular,
  index,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`relative p-8 rounded-3xl ${
        popular
          ? 'bg-gradient-to-b from-nova-600/20 to-dark-950 border-2 border-nova-500/50 scale-105'
          : 'glass'
      } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: isVisible ? `${index * 150}ms` : '0ms' }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-nova-500 to-aurora-purple text-sm font-semibold text-white">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h3 className="font-display text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-dark-400 text-sm">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <span className="font-display text-5xl font-bold text-gradient">{price}</span>
        {price !== 'Custom' && <span className="text-dark-400 ml-2">/month</span>}
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-dark-200">
            <Check className="w-5 h-5 text-aurora-cyan flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="https://novacoder13.lovable.app"
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center py-4 rounded-2xl font-semibold transition-all duration-300 ${
          popular
            ? 'btn-nova'
            : 'border border-white/10 text-white hover:bg-white/5'
        }`}
      >
        <span>{cta}</span>
      </a>
    </div>
  );
}

function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  const goals = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize software development by making AI-powered coding accessible to everyone, from beginners to experts.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Pushing the boundaries of what\'s possible with AI, constantly improving to deliver better results for developers.',
    },
    {
      icon: Rocket,
      title: 'Where We\'re Going',
      description: 'Building the most intuitive AI coding assistant that understands your vision and brings ideas to life effortlessly.',
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Growing alongside our users, listening to feedback, and building features that truly matter to developers.',
    },
  ];

  return (
    <section id="about" className="relative py-32 bg-dark-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <GlowingOrb className="w-96 h-96 bg-aurora-purple/15 -top-48 -right-48" />
      <GlowingOrb className="w-72 h-72 bg-aurora-cyan/10 bottom-0 left-1/4" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          badge="About Nova AI"
          title="A vision taking flight"
          subtitle="Nova AI was born in 2026 with a bold dream: to make AI-powered coding truly accessible to everyone."
        />

        {/* Story Section */}
        <div
          className={`mt-16 max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <h3 className="font-display text-3xl font-bold text-white mb-6">
              The Beginning
            </h3>
            <div className="space-y-4 text-dark-300 leading-relaxed text-lg">
              <p>
                Nova AI started this year as a solo project by a passionate developer who saw
                an opportunity to revolutionize how software is built. The belief? That AI could
                be more than just an autocomplete tool—it could be a true coding partner that
                understands your vision.
              </p>
              <p>
                Right now, it's just one developer building this dream, but with big ambitions.
                Nova AI aims to become the go-to AI assistant for developers of all skill levels,
                making complex coding tasks simple and accessible.
              </p>
              <p>
                This is just the beginning. The vision is a world where anyone with an idea
                can bring it to life through code, regardless of their technical background.
                And we're building towards that future, one feature at a time.
              </p>
            </div>

            {/* Solo Dev Badge */}
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-nova-600/20 to-aurora-purple/20 border border-nova-500/30">
              <div className="w-3 h-3 rounded-full bg-aurora-cyan animate-pulse" />
              <span className="text-dark-200 font-medium">Solo Developer Project • Est. 2026</span>
            </div>
          </div>
        </div>

        {/* Vision & Goals */}
        <div className="mt-24">
          <h3
            className={`font-display text-3xl font-bold text-white text-center mb-4 transition-all duration-700 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            What We're Building Towards
          </h3>
          <p
            className={`text-dark-400 text-center max-w-2xl mx-auto mb-12 transition-all duration-700 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '100ms' }}
          >
            Every great journey starts with a single step. Here's what drives Nova AI forward.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, i) => (
              <div
                key={i}
                className={`glass rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 100 + 200}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center mx-auto mb-4">
                  <goal.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-display text-lg font-semibold text-white mb-2">
                  {goal.title}
                </h4>
                <p className="text-dark-400 text-sm leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DonationSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-32 bg-dark-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      <GlowingOrb className="w-96 h-96 bg-aurora-cyan/10 top-1/2 right-0" />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6">
        <div
          className={`text-center mb-12 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Heart className="w-4 h-4 text-aurora-pink" />
            <span className="text-sm text-dark-200">Support Nova AI</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Love what we're building?
          </h2>
          <p className="text-lg text-dark-300 max-w-2xl mx-auto">
            Nova AI is free forever, but your support helps us keep improving and adding new features.
          </p>
        </div>

        <div
          className={`glass rounded-3xl p-8 md:p-12 ${
            isVisible ? 'animate-scale-in' : 'opacity-0'
          }`}
          style={{ animationDelay: isVisible ? '200ms' : '0ms' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left side - Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aurora-pink to-aurora-purple flex items-center justify-center animate-glow-pulse">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Buy us a coffee ☕
              </h3>
              <p className="text-dark-300 mb-6">
                Every donation helps us maintain servers, improve AI models, and build new features for the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="https://www.buymeacoffee.com/novacoder13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nova flex items-center justify-center gap-2 group"
                >
                  <Heart className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Donate on Buy Me a Coffee</span>
                </a>
                <a
                  href="https://github.com/sponsors/novacoder13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all duration-300"
                >
                  <span>GitHub Sponsors</span>
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-display font-bold text-gradient mb-1">$0</div>
              <div className="text-sm text-dark-400">Raised</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-gradient mb-1">0</div>
              <div className="text-sm text-dark-400">Supporters</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-gradient mb-1">100%</div>
              <div className="text-sm text-dark-400">Free Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-32 bg-dark-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh" />
      <GlowingOrb className="w-[600px] h-[600px] bg-nova-600/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${
          isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'
        }`}
      >
        <div className="glass rounded-3xl p-12 md:p-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-gradient">transform</span> your workflow?
          </h2>
          <p className="text-lg text-dark-300 mb-10 max-w-2xl mx-auto">
            Join Nova AI to supercharge ur productivity and coding skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://novacoder13.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-nova text-lg py-4 px-10 flex items-center gap-3 group"
            >
              <span>Start Building Free</span>
              <Rocket className="w-5 h-5 group-hover:animate-bounce" />
            </a>
            <div className="flex items-center gap-2 text-dark-400">
              <Users className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-dark-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">Nova AI</span>
            </div>
            <p className="text-dark-400 mb-6 max-w-sm">
              The next generation AI coding assistant. Build faster, smarter, and more efficiently.
            </p>
            <div className="flex gap-4">
              <a
                href="https://novacoder13.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all"
                title="Visit Nova AI"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/Arthur2013665/novacoder13landingpage"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all"
                title="GitHub Repository"
              >
                <Code2 className="w-5 h-5" />
              </a>
              <a
                href="https://novacoder13.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/10 transition-all"
                title="Contact Support"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-dark-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#pricing" className="text-dark-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="#demo" className="text-dark-400 hover:text-white transition-colors text-sm">Demo</a></li>
              <li><a href="https://novacoder13.lovable.app" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-white transition-colors text-sm">Try Nova</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-dark-400 hover:text-white transition-colors text-sm">About</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-dark-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-dark-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors text-sm">Security</a></li>
              <li><a href="#" className="text-dark-400 hover:text-white transition-colors text-sm">Cookies</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © 2026 Nova AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-dark-500 hover:text-dark-300 transition-colors text-sm">Privacy</Link>
            <Link to="/terms" className="text-dark-500 hover:text-dark-300 transition-colors text-sm">Terms</Link>
            <div className="flex items-center gap-2 text-dark-500 text-sm">
              <Clock className="w-4 h-4" />
              <span>Built with <span className="underline">Nova AI</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <DemoSection />
      <PricingSection />
      <DonationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
