import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu,
  X,
  Sun,
  Moon,
  ArrowUp,
  Github,
  Linkedin,
  Server,
  Cloud,
  Cpu,
  Database,
  Network,
  Brain,
  Sparkles,
  Workflow,
  Terminal,
  Activity,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PageType = 'home' | 'workspace' | 'contact';

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
                id="desktop-nav-workspace"
                onClick={() => handleNav('workspace')} 
                className={`nav-link text-[clamp(0.75rem,1.1vw,0.875rem)] uppercase tracking-wider ${currentPage === 'workspace' ? 'text-o5-ink font-bold border-b border-o5-ink/20' : 'text-o5-ink/40'} hover:text-o5-ink pb-1 transition-colors duration-300`}
              >
                Workspace
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
                id="mobile-nav-workspace"
                onClick={() => handleNav('workspace')} 
                className={`text-3xl uppercase tracking-widest font-serif transition-all duration-300 ${currentPage === 'workspace' ? 'text-o5-ink font-bold scale-105' : 'text-o5-ink/50 hover:text-o5-ink'}`}
              >
                Workspace
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

const HomePage = ({ onNavigate }: { onNavigate: (page: PageType) => void; key?: string }) => {
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
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <button
              onClick={() => onNavigate('workspace')}
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-o5-ink/60 hover:text-o5-ink transition-colors duration-300 cursor-pointer"
            >
              Open Workspace <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

const PROJECTS = [
  {
    id: 'google-cloud',
    title: 'Google Cloud',
    subtitle: 'GitOps & Infrastructure',
    description: 'A production-grade, enterprise-scale hybrid cloud setup orchestrated entirely via modern infrastructure-as-code and automated GitOps workflows. Designed for 99.99% availability, zero-downtime blue-green deployments, and immutable environment configurations.',
    colorTheme: 'gcp',
    phases: [
      {
        num: '01',
        title: 'Terraform State & Core Topology',
        duration: 'Infrastructure Planning',
        description: 'Provisioning multi-region Virtual Private Clouds (VPC) with non-overlapping subnets, secure NAT Gateways, and isolated private Google Access layers. Remote state is managed securely with Cloud Storage locks.',
        tech: ['Terraform', 'GCP VPC', 'Cloud Storage', 'IAM Roles'],
        metrics: { label: 'Topology Latency', value: '< 2ms' },
        icon: 'network'
      },
      {
        num: '02',
        title: 'GitOps Automation & Build Pipeline',
        duration: 'Continuous Deployment',
        description: 'Continuous integration and delivery using Cloud Build, triggered directly by GitHub commits. Every pull request executes structural linting, security scanning with Snyk, and plans deployment changes.',
        tech: ['Cloud Build', 'GitHub Actions', 'Artifact Registry', 'Snyk'],
        metrics: { label: 'Build Execution', value: '4m 12s' },
        icon: 'terminal'
      },
      {
        num: '03',
        title: 'GKE Container Orchestration',
        duration: 'Runtime Scheduling',
        description: 'Deploying highly available Google Kubernetes Engine (GKE) autopilot clusters utilizing private nodes. Traffic routing is managed via GKE Ingress controllers backed by Cloud Armor WAF security rules.',
        tech: ['GKE Autopilot', 'Kubernetes', 'Cloud Armor', 'Ingress'],
        metrics: { label: 'Pod Autoscale Threshold', value: '75% CPU' },
        icon: 'server'
      },
      {
        num: '04',
        title: 'Observability & Cloud Monitoring',
        duration: 'Telemetry Systems',
        description: 'Comprehensive logging and performance metrics telemetry. Implemented real-time anomaly detection with Cloud Logging sinks, Prometheus custom exporters, and Google Managed Service for Prometheus dashboards.',
        tech: ['Cloud Monitoring', 'Prometheus', 'Grafana', 'Cloud Logging'],
        metrics: { label: 'Log Ingestion Rate', value: '150 GB/day' },
        icon: 'activity'
      }
    ]
  },
  {
    id: 'agentic-ai',
    title: 'Applied AI & Agentic Architecture',
    subtitle: 'Applied AI & Agentic Architecture',
    description: 'An orchestration system built to transform loose natural language inputs into deterministic, structured workflows. Employs advanced routing, function tooling, and self-correcting loop chains.',
    colorTheme: 'agentic',
    phases: [
      {
        num: '01',
        title: 'Semantic Router & Intent Classification',
        duration: 'Context Classification',
        description: 'Incoming queries are projected into vector space using advanced text embeddings. A custom distance-metric router classifies intent, instantly routing queries to dedicated sub-agent models.',
        tech: ['Gemini API', 'Vector Embeddings', 'Cosine Similarity', 'Cosine Router'],
        metrics: { label: 'Intent Classification Accuracy', value: '98.4%' },
        icon: 'brain'
      },
      {
        num: '02',
        title: 'Deterministic Function Calling & Tooling',
        duration: 'Tool Parameter Synthesis',
        description: 'Enabling direct model-to-system interactions. Models execute structured schemas that represent platform APIs, converting natural language into verified, structured parameter payloads.',
        tech: ['Gemini SDK', 'JSON Schema', 'Rest APIs', 'Type Verification'],
        metrics: { label: 'Tool Schema Error Rate', value: '< 0.1%' },
        icon: 'cpu'
      },
      {
        num: '03',
        title: 'Multi-Agent Consensus Network',
        duration: 'Hierarchical Orchestration',
        description: 'Orchestrating specialized sub-agents via a central high-agency Coordinator agent. Sub-agents communicate asynchronously, reviewing output and solving complex, multi-modal engineering tasks.',
        tech: ['Agentic Consensus', 'LangChain', 'Context Pooling', 'Async Workers'],
        metrics: { label: 'Task Completion Rate', value: '92.1%' },
        icon: 'bot'
      },
      {
        num: '04',
        title: 'Self-Correcting Guardrails & Healing',
        duration: 'Validation & Prevention',
        description: 'An automated verification pipeline that parses response payloads against Pydantic-style validation models. If parsing fails, the system feeds the syntax error back to the LLM for self-correction.',
        tech: ['Pydantic Validators', 'Self-Healing AST', 'Retry Policies', 'Context Re-injection'],
        metrics: { label: 'Self-Healing Success Rate', value: '96.8%' },
        icon: 'sparkles'
      }
    ]
  }
];

const getPhaseIcon = (iconName: string) => {
  switch (iconName) {
    case 'network': return <Network size={16} />;
    case 'terminal': return <Terminal size={16} />;
    case 'server': return <Server size={16} />;
    case 'activity': return <Activity size={16} />;
    case 'brain': return <Brain size={16} />;
    case 'cpu': return <Cpu size={16} />;
    case 'bot': return <Bot size={16} />;
    case 'sparkles': return <Sparkles size={16} />;
    default: return <Workflow size={16} />;
  }
};

const WorkspacePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(120);
  const [gravity, setGravity] = useState(0.4);
  const [speed, setSpeed] = useState(1.5);
  const [colorMode, setColorMode] = useState<'slate' | 'cyber' | 'aurora'>('slate');
  const [isMouseIn, setIsMouseIn] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [activeProjectPhases, setActiveProjectPhases] = useState<{ [key: string]: number }>({
    'google-cloud': 0,
    'agentic-ai': 0,
  });

  const [swipeActiveIndexes, setSwipeActiveIndexes] = useState<{ [key: string]: number }>({
    'google-cloud': 0,
    'agentic-ai': 0,
  });

  const handleSwiperScroll = (projectId: string, e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.clientWidth;
    if (cardWidth === 0) return;
    const newIndex = Math.round(scrollPosition / cardWidth);
    if (swipeActiveIndexes[projectId] !== newIndex) {
      setSwipeActiveIndexes(prev => ({
        ...prev,
        [projectId]: newIndex
      }));
    }
  };

  const scrollToSwipeIndex = (projectId: string, index: number) => {
    const container = document.getElementById(`swiper-${projectId}`);
    if (container) {
      const cardWidth = container.clientWidth;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setSwipeActiveIndexes(prev => ({
        ...prev,
        [projectId]: index
      }));
    }
  };


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
      className="pt-40 pb-20 min-h-screen relative"
    >
      {/* Interactive Projects Workspace */}
      <div className="editorial-container mb-32 pt-12">
        {/* Project Cards */}
        <div className="space-y-20">
          {PROJECTS.map((project) => {
            const activePhaseIdx = activeProjectPhases[project.id] ?? 0;
            const activePhase = project.phases[activePhaseIdx];

            return (
              <div 
                key={project.id}
                id={project.id}
                className="bg-o5-beige/45 dark:bg-o5-ink/5 backdrop-blur-md rounded-2xl border border-o5-ink/10 shadow-sm overflow-hidden text-left hover:border-o5-ink/20 transition-all duration-500"
              >
                {/* Project Header Bar */}
                <div className="border-b border-o5-ink/5 px-8 md:px-12 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-o5-ink/[0.01]">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-o5-ink/40">Active Deployments</span>
                    <h2 className="text-xl md:text-2xl font-serif text-o5-ink mt-0.5 font-light">{project.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-o5-ink/60">{project.subtitle}</span>
                  </div>
                </div>

                {/* 1. Desktop & Laptop View (Interactive Grid with Floating Spec Timeline) */}
                <div className="hidden lg:grid grid-cols-12 gap-10 p-8 md:p-12 relative">
                  
                  {/* Left Column: Interactive details of the active phase */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-12 min-h-[320px]">
                    
                    {/* Active Phase Content with Motion */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activePhaseIdx}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                      >
                        {/* Phase Number & Duration Tag */}
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-o5-ink/5 text-o5-ink font-mono text-xs font-bold">
                            {activePhase.num}
                          </span>
                          <span className="font-mono text-[10px] tracking-wider text-o5-ink/40 uppercase">
                            {activePhase.duration}
                          </span>
                        </div>

                        {/* Phase Title */}
                        <h3 className="text-lg md:text-xl font-serif text-o5-ink font-light tracking-tight flex items-center gap-2.5">
                          <span className="text-o5-ink/60 p-1.5 bg-o5-ink/5 rounded">
                            {getPhaseIcon(activePhase.icon)}
                          </span>
                          {activePhase.title}
                        </h3>

                        {/* Phase Detailed Description */}
                        <p className="text-sm md:text-base font-serif text-o5-ink/80 leading-relaxed max-w-2xl">
                          {activePhase.description}
                        </p>

                        {/* Technologies Used */}
                        <div className="pt-4 flex flex-wrap gap-2 items-center">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-o5-ink/40 mr-1">Stack:</span>
                          {activePhase.tech.map((t, idx) => (
                            <span 
                              key={idx}
                              className="font-mono text-[9px] px-2.5 py-1 bg-o5-ink/5 rounded text-o5-ink/70 border border-o5-ink/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Active Phase Metric Panel */}
                    <div className="border-t border-o5-ink/5 pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-o5-ink/20" />
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-widest text-o5-ink/40">Metric Parameter</p>
                          <p className="font-mono text-xs font-medium text-o5-ink/70">{activePhase.metrics.label}</p>
                        </div>
                      </div>
                      <div className="bg-o5-ink/[0.03] px-4 py-2 rounded border border-o5-ink/5">
                        <span className="font-mono text-xs font-bold text-o5-ink tracking-wider">{activePhase.metrics.value}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Floating Timeline Navigator (Desktop only) */}
                  <div className="lg:col-span-4 relative flex flex-col justify-center pl-10 lg:border-l border-o5-ink/5 min-h-[220px]">
                    <div className="space-y-4">
                      
                      {/* Floating Timeline label */}
                      <p className="font-mono text-[9px] tracking-[0.25em] text-o5-ink/30 uppercase mb-4 pl-3">
                        FLOATING NAVIGATOR // SPEC STEPS
                      </p>

                      <div className="relative flex flex-col gap-2">
                        {/* Interactive Steps */}
                        {project.phases.map((phase, idx) => {
                          const isSelected = activePhaseIdx === idx;
                          return (
                            <button
                              key={phase.num}
                              onMouseEnter={() => {
                                setActiveProjectPhases(prev => ({
                                  ...prev,
                                  [project.id]: idx
                                }));
                              }}
                              onClick={() => {
                                setActiveProjectPhases(prev => ({
                                  ...prev,
                                  [project.id]: idx
                                }));
                              }}
                              className={`group text-left px-4 py-3 rounded-lg flex items-center gap-4 transition-all duration-300 relative focus:outline-none cursor-pointer w-full ${
                                isSelected 
                                  ? 'bg-o5-ink/5 dark:bg-o5-beige/5 font-bold' 
                                  : 'hover:bg-o5-ink/[0.02]'
                              }`}
                            >
                              {/* Sliding indicator bar */}
                              {isSelected && (
                                <motion.div 
                                  layoutId={`active-timeline-indicator-${project.id}`}
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-o5-ink rounded-l"
                                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                              )}

                              {/* Number Circle */}
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] transition-colors duration-300 ${
                                isSelected 
                                  ? 'bg-o5-ink text-o5-beige font-bold' 
                                  : 'bg-o5-ink/5 text-o5-ink/40 group-hover:text-o5-ink/60'
                              }`}>
                                {phase.num}
                              </div>

                              {/* Info Labels */}
                              <div className="flex flex-col">
                                <span className={`font-mono text-[10px] uppercase tracking-wider transition-colors duration-300 ${
                                  isSelected ? 'text-o5-ink' : 'text-o5-ink/40 group-hover:text-o5-ink/60'
                                }`}>
                                  {phase.title.split(' & ')[0].split(' // ')[0].substring(0, 24)}...
                                </span>
                                <span className="font-mono text-[8px] uppercase tracking-widest text-o5-ink/30">
                                  {phase.duration}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                </div>

                {/* 2. Mobile & Tablet View (Swipeable list with indicators, NO vertical floating navigator) */}
                <div className="block lg:hidden">
                  <div 
                    id={`swiper-${project.id}`}
                    onScroll={(e) => handleSwiperScroll(project.id, e)}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 p-6 md:p-8 scroll-smooth"
                  >
                    {project.phases.map((phase, idx) => (
                      <div 
                        key={phase.num}
                        className="flex-none w-[90%] md:w-[75%] snap-center bg-o5-ink/[0.02] dark:bg-o5-ink/[0.04] p-6 rounded-xl border border-o5-ink/10 flex flex-col justify-between space-y-6 text-left"
                      >
                        <div className="space-y-4">
                          {/* Phase Header */}
                          <div className="flex items-center justify-between">
                            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-o5-ink/5 text-o5-ink font-mono text-xs font-bold">
                              {phase.num}
                            </span>
                            <span className="font-mono text-[9px] tracking-wider text-o5-ink/40 uppercase">
                              {phase.duration}
                            </span>
                          </div>

                          {/* Phase Title */}
                          <h3 className="text-base font-serif text-o5-ink font-light tracking-tight flex items-center gap-2">
                            <span className="text-o5-ink/60 p-1.5 bg-o5-ink/5 rounded">
                              {getPhaseIcon(phase.icon)}
                            </span>
                            {phase.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs font-serif text-o5-ink/70 leading-relaxed">
                            {phase.description}
                          </p>

                          {/* Stack */}
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {phase.tech.map((t, idx) => (
                              <span 
                                key={idx}
                                className="font-mono text-[8px] px-2 py-0.5 bg-o5-ink/5 rounded text-o5-ink/70 border border-o5-ink/5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Metric Panel */}
                        <div className="border-t border-o5-ink/5 pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-o5-ink/20" />
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-widest text-o5-ink/30">Metric</p>
                              <p className="font-mono text-[9px] text-o5-ink/60">{phase.metrics.label}</p>
                            </div>
                          </div>
                          <div className="bg-o5-ink/[0.03] px-2.5 py-1 rounded border border-o5-ink/5">
                            <span className="font-mono text-[9px] font-bold text-o5-ink tracking-wider">{phase.metrics.value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Swipe Navigation Dots */}
                  <div className="flex justify-center items-center gap-2.5 pb-6">
                    {project.phases.map((_, idx) => {
                      const isActive = (swipeActiveIndexes[project.id] ?? 0) === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => scrollToSwipeIndex(project.id, idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isActive ? 'w-6 bg-o5-ink' : 'w-2 bg-o5-ink/20 hover:bg-o5-ink/40'
                          }`}
                          aria-label={`Go to step ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>



      {/* Preserve the physics adjustments code but do not display it on the workspace page */}
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
          <button onClick={() => onNavigate('workspace')} className="hover:text-o5-ink transition-colors uppercase">Workspace</button>
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
            <HomePage key="home" onNavigate={handleNavigate} />
          )}
          {currentPage === 'workspace' && (
            <WorkspacePage key="workspace" />
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
