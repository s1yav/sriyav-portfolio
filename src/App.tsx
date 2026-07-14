import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu,
  X,
  Sun,
  Moon,
  ArrowUp,
  Github,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PageType = 'home' | 'sandbox' | 'contact';

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  darkMode,
  onToggleDarkMode
}: { 
  currentPage: PageType, 
  setCurrentPage: (page: PageType) => void, 
  darkMode: boolean,
  onToggleDarkMode: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNav = (page: PageType) => {
    setCurrentPage(page);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      id="main-nav" 
      className={`fixed top-0 left-0 right-0 transition-all duration-300 bg-o5-beige ${isOpen ? 'h-screen w-screen z-[99999]' : 'z-50 py-6 border-b border-o5-ink/5'}`}
    >
      {!isOpen && (
        <div className="editorial-container relative">
          {/* Desktop Layout: Fluid Grid */}
          <div className="hidden md:grid grid-cols-3 items-center w-full">
            {/* Left Column: Sub-page navigation links */}
            <div className="flex justify-start items-center gap-[clamp(1rem,2vw,2.5rem)]">
              <button 
                id="desktop-nav-home"
                onClick={() => handleNav('home')} 
                className={`nav-link text-[clamp(0.75rem,1.1vw,0.875rem)] uppercase tracking-wider ${currentPage === 'home' ? 'text-o5-ink font-bold border-b border-o5-ink/20' : 'text-o5-ink/40'} hover:text-o5-ink pb-1 transition-colors duration-300`}
              >
                Home
              </button>
              <button 
                id="desktop-nav-sandbox"
                onClick={() => handleNav('sandbox')} 
                className={`nav-link text-[clamp(0.75rem,1.1vw,0.875rem)] uppercase tracking-wider ${currentPage === 'sandbox' ? 'text-o5-ink font-bold border-b border-o5-ink/20' : 'text-o5-ink/40'} hover:text-o5-ink pb-1 transition-colors duration-300`}
              >
                Sandbox
              </button>
              <button 
                id="desktop-nav-contact"
                onClick={() => handleNav('contact')} 
                className={`nav-link text-[clamp(0.75rem,1.1vw,0.875rem)] uppercase tracking-wider ${currentPage === 'contact' ? 'text-o5-ink font-bold border-b border-o5-ink/20' : 'text-o5-ink/40'} hover:text-o5-ink pb-1 transition-colors duration-300`}
              >
                Contact
              </button>
            </div>

            {/* Center Column: Main Logo */}
            <div className="flex justify-center items-center">
              <button 
                id="logo-desktop"
                onClick={() => handleNav('home')} 
                className="text-xl md:text-2xl font-serif tracking-[0.2em] font-light uppercase transition-colors duration-500 text-o5-ink hover:text-o5-ink/80 text-[clamp(1.1rem,1.8vw,1.5rem)] shrink-0"
              >
                <motion.span 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  SRIYA V
                </motion.span>
              </button>
            </div>

            {/* Right Column: Actions */}
            <div className="flex justify-end items-center gap-4">
              <a 
                id="github-header-desktop"
                href="https://github.com/s1yav" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 transition-colors text-o5-ink hover:text-o5-ink/60"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a 
                id="linkedin-header-desktop"
                href="https://www.linkedin.com/in/sriyavenk/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 transition-colors text-o5-ink hover:text-o5-ink/60"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <button 
                id="theme-toggle-desktop"
                onClick={onToggleDarkMode}
                className="p-2 transition-colors text-o5-ink hover:text-o5-ink/60"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Layout: Balanced 3-column bar */}
          <div className="grid grid-cols-3 items-center md:hidden w-full">
            {/* Left: Menu Toggle Button */}
            <div className="flex justify-start">
              <button 
                id="mobile-menu-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 transition-colors text-o5-ink hover:text-o5-ink/60"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <button 
                id="logo-mobile"
                onClick={() => handleNav('home')} 
                className="text-lg font-serif tracking-[0.2em] font-light uppercase text-o5-ink hover:text-o5-ink/80 text-center"
              >
                SRIYA V
              </button>
            </div>

            {/* Right: Fixed Day/Night Theme Toggle */}
            <div className="flex justify-end">
              <button 
                id="theme-toggle-mobile"
                onClick={onToggleDarkMode}
                className="p-2 transition-colors text-o5-ink hover:text-o5-ink/60"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer/Disclosure Menu - Minimal Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            id="mobile-drawer-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[99999] w-full h-screen bg-o5-beige flex flex-col justify-between py-12 px-8"
          >
            {/* Top Close Button (Top Right Corner with adequate padding) */}
            <div className="flex justify-end w-full relative z-[100000]">
              <button 
                id="mobile-menu-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-3 transition-colors text-o5-ink hover:text-o5-ink/60 cursor-pointer relative z-[100001] pointer-events-auto"
                aria-label="Close navigation menu"
              >
                <X size={32} />
              </button>
            </div>

            {/* Centered Navigation Links */}
            <div className="flex flex-col items-center justify-center flex-1 gap-12 -mt-12">
              <button 
                id="mobile-nav-home"
                onClick={() => handleNav('home')} 
                className={`text-3xl uppercase tracking-widest font-serif transition-all duration-300 ${currentPage === 'home' ? 'text-o5-ink font-bold scale-105' : 'text-o5-ink/50 hover:text-o5-ink'}`}
              >
                Home
              </button>
              <button 
                id="mobile-nav-sandbox"
                onClick={() => handleNav('sandbox')} 
                className={`text-3xl uppercase tracking-widest font-serif transition-all duration-300 ${currentPage === 'sandbox' ? 'text-o5-ink font-bold scale-105' : 'text-o5-ink/50 hover:text-o5-ink'}`}
              >
                Sandbox
              </button>
              <button 
                id="mobile-nav-contact"
                onClick={() => handleNav('contact')} 
                className={`text-3xl uppercase tracking-widest font-serif transition-all duration-300 ${currentPage === 'contact' ? 'text-o5-ink font-bold scale-105' : 'text-o5-ink/50 hover:text-o5-ink'}`}
              >
                Contact
              </button>
            </div>

            {/* Bottom Sticky Social Icons */}
            <div className="flex justify-center items-center gap-8 pb-4">
              <a 
                id="github-header-mobile"
                href="https://github.com/s1yav" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-o5-ink/60 hover:text-o5-ink transition-all duration-300 hover:scale-110 active:scale-95 p-3 block"
                aria-label="GitHub Profile"
              >
                <Github size={28} />
              </a>
              <a 
                id="linkedin-header-mobile"
                href="https://www.linkedin.com/in/sriyavenk/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-o5-ink/60 hover:text-o5-ink transition-all duration-300 hover:scale-110 active:scale-95 p-3 block"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={28} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HomePage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Interaction Simulation Section (New Hero) */}
      <section className="pt-64 pb-32 bg-o5-beige min-h-[90vh] flex flex-col justify-center">
        <div className="editorial-container text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-3xl mb-8 font-serif leading-tight tracking-tight max-w-5xl mx-auto text-o5-ink font-light"
          >
            A journal to track my trajectory within computer science
          </motion.h1>
        </div>
      </section>
    </motion.div>
  );
};



const SandboxPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(120);
  const [gravity, setGravity] = useState(0.4);
  const [speed, setSpeed] = useState(1.5);
  const [colorMode, setColorMode] = useState<'slate' | 'cyber' | 'aurora'>('slate');
  const [isMouseIn, setIsMouseIn] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 500);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 500;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      originalSize: number;
    }> = [];

    const getColors = (mode: string) => {
      if (mode === 'cyber') return ['#06b6d4', '#3b82f6', '#ec4899', '#8b5cf6'];
      if (mode === 'aurora') return ['#10b981', '#06b6d4', '#14b8a6', '#34d399'];
      return ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8']; // slate
    };

    const colors = getColors(colorMode);

    const initParticles = () => {
      particles = [];
      const currentColors = getColors(colorMode);
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size,
          originalSize: size,
          color: currentColors[Math.floor(Math.random() * currentColors.length)]
        });
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle background grid
      ctx.strokeStyle = 'rgba(var(--o5-ink-rgb), 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Clamping to stay inside bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Gravity/Attraction to mouse
        if (isMouseIn) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const force = (250 - dist) / 250;
            // Pull strength
            const pullX = (dx / dist) * force * gravity;
            const pullY = (dy / dist) * force * gravity;
            p.vx += pullX;
            p.vy += pullY;
            
            // Limit speed
            const maxSpeed = speed * 3;
            const currSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (currSpeed > maxSpeed) {
              p.vx = (p.vx / currSpeed) * maxSpeed;
              p.vy = (p.vy / currSpeed) * maxSpeed;
            }

            // Magnify slightly
            p.size = p.originalSize * (1 + force * 1.5);
          } else {
            p.size = p.originalSize;
          }
        } else {
          p.size = p.originalSize;
          // Apply friction to slow down to normal speed
          const currSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (currSpeed > speed) {
            p.vx *= 0.98;
            p.vy *= 0.98;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Custom color parsing if slate mode with custom dark/light theme
        const isDark = document.documentElement.classList.contains('dark');
        let drawColor = p.color;
        if (colorMode === 'slate') {
          drawColor = isDark ? '#fcfaf7' : '#000000';
        }
        
        ctx.fillStyle = drawColor;
        ctx.globalAlpha = isMouseIn ? 0.8 : 0.5;
        ctx.fill();

        // Connect nearby particles with lines
        particles.forEach((other) => {
          if (p === other) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = colorMode === 'slate'
              ? (isDark ? 'rgba(252, 250, 247, 0.05)' : 'rgba(0, 0, 0, 0.05)')
              : drawColor;
            ctx.globalAlpha = (1 - dist / 60) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw mouse gravity field indicator
      if (isMouseIn) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = colorMode === 'slate' 
          ? (document.documentElement.classList.contains('dark') ? 'rgba(252, 250, 247, 0.1)' : 'rgba(0, 0, 0, 0.1)')
          : 'rgba(59, 130, 246, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 250, 0, Math.PI * 2);
        ctx.strokeStyle = colorMode === 'slate' 
          ? (document.documentElement.classList.contains('dark') ? 'rgba(252, 250, 247, 0.02)' : 'rgba(0, 0, 0, 0.02)')
          : 'rgba(59, 130, 246, 0.03)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, gravity, speed, colorMode, isMouseIn]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-40 pb-20 min-h-screen"
    >
      {/* Completely blank sandbox page on display */}
      <div className="editorial-container min-h-[50vh]">
        {/* Intentionally left blank */}
      </div>

      {/* Preserve the physics adjustments code but do not display it on the sandbox page */}
      <div className="hidden" aria-hidden="true">
        <div className="editorial-container">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Controls Panel */}
            <div className="lg:col-span-4 space-y-8 bg-o5-ink/5 border border-o5-ink/5 p-8 rounded-2xl text-left">
              <h3 className="text-xl font-serif text-o5-ink mb-4">Physics Adjustments</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2 text-o5-ink/60">
                    <span>Particle Count</span>
                    <span className="font-bold">{particleCount}</span>
                  </label>
                  <input 
                    type="range" 
                    min="30" 
                    max="250" 
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full accent-o5-ink bg-o5-ink/10 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2 text-o5-ink/60">
                    <span>Attraction Gravity</span>
                    <span className="font-bold">{gravity}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.5" 
                    step="0.05"
                    value={gravity}
                    onChange={(e) => setGravity(Number(e.target.value))}
                    className="w-full accent-o5-ink bg-o5-ink/10 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-xs font-mono uppercase tracking-widest mb-2 text-o5-ink/60">
                    <span>Inherent Velocity</span>
                    <span className="font-bold">{speed}x</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="4" 
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-o5-ink bg-o5-ink/10 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <span className="block text-xs font-mono uppercase tracking-widest mb-3 text-o5-ink/60">Palette Select</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['slate', 'cyber', 'aurora'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setColorMode(mode)}
                        className={`py-2 rounded font-mono text-[10px] uppercase tracking-wider transition-all border ${
                          colorMode === mode 
                            ? 'bg-o5-ink text-o5-beige border-o5-ink' 
                            : 'border-o5-ink/10 hover:border-o5-ink/40 text-o5-ink bg-transparent'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-o5-ink/10">
                <h4 className="font-mono text-xs uppercase tracking-widest text-o5-ink/60 mb-2">Sim details</h4>
                <p className="text-sm font-serif text-o5-ink/50 leading-relaxed">
                  Particles are updated dynamically frame-by-frame on the main event thread, using mathematical vector algebra to compute local attractors within a 250px radius. Linear graph connections are computed conditionally when topological Euclidean distance drops below 60 pixels.
                </p>
              </div>
            </div>

            {/* Interactive Canvas */}
            <div className="lg:col-span-8 bg-o5-beige border border-o5-ink/10 rounded-2xl overflow-hidden relative shadow-inner">
              <canvas 
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsMouseIn(true)}
                onMouseLeave={() => setIsMouseIn(false)}
                className="w-full h-[500px] block cursor-crosshair bg-transparent"
              />
              {!isMouseIn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-o5-beige/40 backdrop-blur-[1px] transition-all duration-500">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-o5-ink/40 bg-o5-beige px-6 py-3 rounded-full border border-o5-ink/5 shadow-md">
                    Hover to distort field
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ContactPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setSubmitted(true);
    
    // Simulate compilation style submission logs! Matches the CS journal theme incredibly well!
    const consoleLogs = [
      "Initializing secure outbound thread...",
      "Validating telemetry package schema...",
      `Encrypting payload for node: ${formState.email}...`,
      "Synthesizing transaction package...",
      "Dispatch completed successfully! Message is in flight."
    ];

    consoleLogs.forEach((log, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, (idx + 1) * 600);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-40 pb-20 min-h-screen"
    >
      <div className="editorial-container">
        <div className="max-w-2xl mx-auto bg-o5-ink/5 border border-o5-ink/5 p-8 md:p-12 rounded-2xl text-left">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-widest text-o5-ink/60 mb-2">Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  placeholder="YOUR NAME..."
                  className="w-full bg-o5-beige border border-o5-ink/10 rounded-xl px-4 py-3 font-mono text-sm text-o5-ink focus:outline-none focus:border-o5-ink transition-colors placeholder:text-o5-ink/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-widest text-o5-ink/60 mb-2">E-mail Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                  placeholder="YOUR EMAIL ADDRESS..."
                  className="w-full bg-o5-beige border border-o5-ink/10 rounded-xl px-4 py-3 font-mono text-sm text-o5-ink focus:outline-none focus:border-o5-ink transition-colors placeholder:text-o5-ink/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase tracking-widest text-o5-ink/60 mb-2">Message Payload</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  placeholder="YOUR MESSAGE..."
                  className="w-full bg-o5-beige border border-o5-ink/10 rounded-xl px-4 py-3 font-mono text-sm text-o5-ink focus:outline-none focus:border-o5-ink transition-colors placeholder:text-o5-ink/20 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-xl bg-o5-ink text-o5-beige font-mono text-xs uppercase tracking-widest transition-all hover:bg-o5-ink/90 active:scale-[0.99]"
              >
                SUBMIT
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border border-o5-ink/10 rounded-xl p-6 bg-o5-beige font-mono text-xs text-o5-ink/80 min-h-[220px]">
                <div className="flex justify-between border-b border-o5-ink/10 pb-3 mb-4">
                  <span className="font-bold text-o5-ink uppercase tracking-wider">CONSOLE_LOGS.sh</span>
                  <span className="text-green-500 font-bold uppercase">SUCCESS</span>
                </div>
                <div className="space-y-2">
                  {logs.map((log, idx) => (
                    <p key={idx} className="leading-relaxed">
                      <span className="text-o5-ink/40 font-bold">&gt;&gt;</span> {log}
                    </p>
                  ))}
                  {logs.length < 5 && (
                    <div className="inline-block w-2 h-4 bg-o5-ink/80 animate-pulse ml-1" />
                  )}
                </div>
              </div>
              
              {logs.length === 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 font-serif rounded-xl text-base"
                >
                  Packet successfully dispatched! I will respond directly to <strong>{formState.email}</strong>.
                </motion.div>
              )}

              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', email: '', message: '' });
                  setLogs([]);
                }}
                className="w-full py-3 rounded-xl border border-o5-ink/10 hover:border-o5-ink/40 font-mono text-xs uppercase tracking-widest transition-all"
              >
                Write New Message
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (page: PageType) => void }) => {
  return (
    <footer className="py-48 editorial-container text-center text-o5-ink">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center gap-8 label-mono">
          <button onClick={() => onNavigate('home')} className="hover:text-o5-ink transition-colors uppercase">Home</button>
          <button onClick={() => onNavigate('sandbox')} className="hover:text-o5-ink transition-colors uppercase">Sandbox</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-o5-ink transition-colors uppercase">Contact</button>
        </div>
        
        <div className="flex justify-center items-center gap-10 mt-4">
          <a 
            href="https://github.com/s1yav" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-o5-ink/60 hover:text-o5-ink transition-all duration-300 hover:scale-110 active:scale-95 p-2 block"
            aria-label="GitHub Profile"
          >
            <Github size={48} />
          </a>
          <a 
            href="https://www.linkedin.com/in/sriyavenk/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-o5-ink/60 hover:text-o5-ink transition-all duration-300 hover:scale-110 active:scale-95 p-2 block"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={48} />
          </a>
        </div>

        <p className="max-w-2xl font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-o5-ink/40 px-4 mt-12 text-center">
          NOTHING IN LIFE IS TO BE FEARED, IT IS ONLY TO BE UNDERSTOOD.<br />
          NOW IS THE TIME TO UNDERSTAND MORE SO THAT WE MAY FEAR LESS.<br />
          — MARIE CURIE
        </p>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 40 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          whileHover={{ 
            scale: 1.05,
            y: -4,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-12 right-12 z-40 w-16 h-16 rounded-full bg-o5-beige border-2 border-o5-ink flex items-center justify-center text-o5-ink shadow-[4px_4px_0px_0px_rgba(var(--o5-ink-rgb),1)]"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-o5-ink selection:text-o5-white transition-colors duration-500">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage key="home" />
          )}
          {currentPage === 'sandbox' && (
            <SandboxPage key="sandbox" />
          )}
          {currentPage === 'contact' && (
            <ContactPage key="contact" />
          )}
        </AnimatePresence>
      </main>
      <ScrollToTop />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
