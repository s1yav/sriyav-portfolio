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
import { Mermaid } from './components/Mermaid';

const MERMAID_DIAGRAM = `---
config:
  theme: neo-dark
---
sequenceDiagram
    autonumber
    actor Dev as Developer

    box "GitHub"
        participant GH as GitHub Repository
    end

    box "GitOps Project (Google Cloud)"
        participant CC as Google Cloud Build v2 Connection
        participant CBE as Google Cloud Build Engine
        participant GSM as Google Cloud Secret Manager
        participant GSA as Google Cloud Service Account (s1yav-cloudbuild-sa)
        participant CBW as Google Cloud Build Worker VM
        participant GAR as Google Cloud Artifact Registry
    end

    box "Target App Project (Google Cloud: sriyav-portfolio)"
        participant FSA as Google Cloud Service Account (sriyav-firebasehost-sa)
        participant PUL as Pulumi / Cloud APIs
        participant AppHosting as Google Firebase App Hosting
    end

    %% Phase 1: Application Commit & Artifact Build (GitOps Local)
    Dev->>GH: Push App Code (sriyav-portfolio)
    activate GH
    GH->>CC: HTTPS Webhook Post (Push Payload)
    deactivate GH
    activate CC
    CC->>GSM: Read GitHub Token Credentials
    GSM-->>CC: Return GitHub Token
    CC->>CC: Validate Webhook Signature
    CC->>CBE: Route Webhook to Trigger
    deactivate CC
    activate CBE
    CBE->>CBW: Provision Worker VM (runs as s1yav-cloudbuild-sa)
    deactivate CBE
    activate CBW
    Note over CBW: Build frontend site & Docker container
    CBW->>GAR: Push Image locally (docker push)
    activate GAR
    GAR-->>CBW: Confirm Image Push (200 OK)
    deactivate GAR
    Note over CBW: Update portfolio-image-tag.json manifest
    CBW->>GH: Push tag manifest to sriyav-firebasehost repo
    deactivate CBW

    %% Phase 2: Infrastructure Trigger & Cross-Account Deploy
    activate GH
    GH->>CC: HTTPS Webhook Post (Manifest Push Payload)
    deactivate GH
    activate CC
    CC->>CBE: Route Webhook to Infrastructure Trigger
    deactivate CC
    activate CBE
    CBE->>GSM: Read secrets (Pulumi Token, etc.)
    GSM-->>CBE: Return Decrypted Secrets
    CBE->>CBW: Provision Worker VM (runs as s1yav-cloudbuild-sa)
    deactivate CBE
    activate CBW
    CBW->>FSA: Impersonate Firebase App Hosting SA (Cross-Project IAM Trust)
    activate FSA
    FSA-->>CBW: Return Short-lived OAuth Token
    deactivate FSA
    CBW->>PUL: Run Pulumi update (using impersonated FSA token)
    activate PUL
    PUL->>AppHosting: Create AppHostingBuild pointing to GAR image
    activate AppHosting
    %% Cross-Account Fetch
    AppHosting->>GAR: Pull Container Image (Cross-Account Fetch)
    activate GAR
    GAR-->>AppHosting: Return Image Bytes
    deactivate GAR
    Note over AppHosting: Deploy & build container instance
    AppHosting-->>PUL: AppHostingBuild created successfully
    deactivate AppHosting
    PUL->>AppHosting: Adjust traffic routing (100% to new build)
    PUL-->>CBW: Pulumi stack update complete
    deactivate PUL
    CBW-->>CBE: Pipeline Execution Status (Success)
    deactivate CBW
    activate CBE
    CBE->>GH: Write Commit Check Status (Success)
    deactivate CBE
    activate GH
    GH-->>Dev: Display Build Status Badge (Green Check)
    deactivate GH`;

const FIREBASE_APP_HOSTING_MERMAID_DIAGRAM = `---
config:
  theme: neo-dark
---
sequenceDiagram
    autonumber
    actor Visitor as Website Visitor
    actor Dev as Developer
    participant CF as Cloudflare DNS Console
    participant PUL as Pulumi Engine (sriyav-firebasehost)
    participant FAH as Google Firebase App Hosting

    %% Phase 1: Declarative Domain Mapping Provisioning
    Dev->>PUL: Run Pulumi Deployment (pulumi up)
    activate PUL
    PUL->>FAH: Create custom domain mappings (sriyav.com & www.sriyav.com)
    activate FAH
    Note over FAH: Generate TXT ownership token & CNAME/A routing records
    FAH-->>PUL: Return domain mapping state (Status: PENDING_OWNERSHIP)
    deactivate FAH
    PUL-->>Dev: Log DNS records to verify (Outputs: domainStatus)
    deactivate PUL

    %% Phase 2: Manual DNS Record Copying
    Dev->>FAH: Read required TXT verification & CNAME/A records
    Dev->>CF: Add TXT (ownership) & CNAME/A (routing) records manually
    activate CF
    Note over CF: Cloudflare DNS propagates records globally
    CF-->>Dev: DNS Propagation Active
    deactivate CF

    %% Phase 3: Verification & Certificate Provisioning
    activate FAH
    Note over FAH: Poll Cloudflare DNS for verification token
    FAH->>CF: Query TXT verification record
    activate CF
    CF-->>FAH: Return ownership token
    deactivate CF
    Note over FAH: Domain verified (Status: CERT_ACTIVE, HOST_ACTIVE)
    Note over FAH: Provision SSL/TLS certificate automatically
    deactivate FAH

    %% Phase 4: Visitor Request Routing
    Visitor->>CF: Query DNS for sriyav.com
    activate CF
    CF-->>Visitor: Return Firebase CDN A/AAAA/CNAME record values
    deactivate CF
    Visitor->>FAH: Send HTTPS request to resolved IPs (sriyav.com)
    activate FAH
    FAH-->>Visitor: Serve static & dynamic portfolio page bytes
    deactivate FAH`;

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
    title: 'GitOps Automation Infrastructure',
    subtitle: 'gitops automation',
    description: 'A production-grade, enterprise-scale hybrid cloud setup orchestrated entirely via modern infrastructure-as-code and automated GitOps workflows. Designed for 99.99% availability, zero-downtime blue-green deployments, and immutable environment configurations.',
    githubUrl: 'https://github.com/s1yav/gitops',
    mermaidDiagram: MERMAID_DIAGRAM,
    expandedOverview: 'A comprehensive, enterprise-ready hybrid cloud workspace orchestrated entirely via modern infrastructure-as-code and automated GitOps workflows. This system is designed for 99.99% availability, zero-downtime rolling deployments, and fully reproducible environment configurations across multi-region clusters. By managing remote state via Cloud Storage locking and verifying every pull request using advanced security linting, it ensures high reliability and complete operational traceability.',
    deepDiveSections: [
      {
        title: 'Core Topology & Virtual Networks',
        details: 'The underlying VPC is segmented into isolated private subnets across multi-region configurations. All outbound internet traffic passes through custom-routed NAT Gateways, while internal resources leverage Private Google Access. IAM profiles enforce the principle of least privilege, mapping system workloads to restricted cloud service identities.'
      },
      {
        title: 'Automated GitOps & CI/CD Pipelines',
        details: 'Every infrastructure or configuration alteration is represented as code inside a version-controlled git repository. Upon pull-request initiation, a continuous integration workflow triggers in Cloud Build to validate syntax, execute static security analysis via Snyk, and plan modifications. Approvals trigger deterministic deployment phases.'
      },
      {
        title: 'Runtime Orchestration & GKE Security',
        details: 'Compute workloads are containerized and scheduled on GKE Autopilot private clusters. Ingress controllers distribute requests using intelligent layer-7 load balancing, guarded by enterprise-tier Cloud Armor security policy rules to neutralize common web attack vectors.'
      }
    ],
    colorTheme: 'gcp',
    phases: [
      {
        num: '01',
        title: 'Commit Code',
        duration: 'Source Version Control',
        description: 'Developer pushes code updates to the sriyav-portfolio application repository on GitHub. This triggers the automated Webhook integration.',
        tech: ['GitHub', 'Git', 'Semantic Tags'],
        metrics: { label: 'Webhooks Fired', value: 'Instant' },
        icon: 'network'
      },
      {
        num: '02',
        title: 'Auto Build Container',
        duration: 'Artifact Automation',
        description: 'Google Cloud Build launches build jobs on webhook trigger, executing high-performance Docker/BuildKit compilation and security scanning before registering in Google Cloud Artifact Registry.',
        tech: ['Google Cloud Build', 'Docker', 'Artifact Registry'],
        metrics: { label: 'Compilation Speed', value: '4m 12s' },
        icon: 'terminal'
      },
      {
        num: '03',
        title: 'Auto Update Container Manifest',
        duration: 'State Manifest Promotion',
        description: 'Under secure Google Cloud IAM Service Account Impersonation, Cloud Build updates the image-tag manifest (portfolio-image-tag.json) inside the sriyav-firebasehost configuration repository.',
        tech: ['Google Cloud IAM', 'Pulumi', 'Secret Manager'],
        metrics: { label: 'Security Handshake', value: 'Verified' },
        icon: 'server'
      },
      {
        num: '04',
        title: 'Auto Update Website',
        duration: 'Serverless Delivery',
        description: 'Google Firebase App Hosting detects the updated manifest tag, auto-provisions Cloud Run server instances with safe zero-downtime rolling deploys, and updates active Cloudflare DNS maps.',
        tech: ['Firebase App Hosting', 'Cloud Run', 'Cloudflare'],
        metrics: { label: 'Traffic Transition', value: '0s Downtime' },
        icon: 'activity'
      }
    ]
  },
  {
    id: 'google-cloud-2',
    title: 'Firebase App Hosting',
    subtitle: 'gitops automation',
    description: 'A production-grade, enterprise-scale hybrid cloud setup orchestrated entirely via modern infrastructure-as-code and automated GitOps workflows. Designed for 99.99% availability, zero-downtime blue-green deployments, and immutable environment configurations.',
    githubUrl: 'https://github.com/s1yav/sriyav-firebasehost',
    mermaidDiagram: FIREBASE_APP_HOSTING_MERMAID_DIAGRAM,
    expandedOverview: 'A comprehensive, enterprise-ready hybrid cloud workspace orchestrated entirely via modern infrastructure-as-code and automated GitOps workflows. This system is designed for 99.99% availability, zero-downtime rolling deployments, and fully reproducible environment configurations across multi-region clusters. By managing remote state via Cloud Storage locking and verifying every pull request using advanced security linting, it ensures high reliability and complete operational traceability.',
    deepDiveSections: [
      {
        title: 'Core Topology & Virtual Networks',
        details: 'The underlying VPC is segmented into isolated private subnets across multi-region configurations. All outbound internet traffic passes through custom-routed NAT Gateways, while internal resources leverage Private Google Access. IAM profiles enforce the principle of least privilege, mapping system workloads to restricted cloud service identities.'
      },
      {
        title: 'Automated GitOps & CI/CD Pipelines',
        details: 'Every infrastructure or configuration alteration is represented as code inside a version-controlled git repository. Upon pull-request initiation, a continuous integration workflow triggers in Cloud Build to validate syntax, execute static security analysis via Snyk, and plan modifications. Approvals trigger deterministic deployment phases.'
      },
      {
        title: 'Runtime Orchestration & GKE Security',
        details: 'Compute workloads are containerized and scheduled on GKE Autopilot private clusters. Ingress controllers distribute requests using intelligent layer-7 load balancing, guarded by enterprise-tier Cloud Armor security policy rules to neutralize common web attack vectors.'
      }
    ],
    colorTheme: 'gcp',
    phases: [
      {
        num: '01',
        title: 'Register Web App',
        duration: 'Source Version Control',
        description: 'Developer pushes code updates to the sriyav-portfolio application repository on GitHub. This triggers the automated Webhook integration.',
        tech: ['GitHub', 'Git', 'Semantic Tags'],
        metrics: { label: 'Webhooks Fired', value: 'Instant' },
        icon: 'network'
      },
      {
        num: '02',
        title: 'Configure Backend',
        duration: 'Artifact Automation',
        description: 'Google Cloud Build launches build jobs on webhook trigger, executing high-performance Docker/BuildKit compilation and security scanning before registering in Google Cloud Artifact Registry.',
        tech: ['Google Cloud Build', 'Docker', 'Artifact Registry'],
        metrics: { label: 'Compilation Speed', value: '4m 12s' },
        icon: 'terminal'
      },
      {
        num: '03',
        title: 'Trigger Deployment',
        duration: 'State Manifest Promotion',
        description: 'Under secure Google Cloud IAM Service Account Impersonation, Cloud Build updates the image-tag manifest (portfolio-image-tag.json) inside the sriyav-firebasehost configuration repository.',
        tech: ['Google Cloud IAM', 'Pulumi', 'Secret Manager'],
        metrics: { label: 'Security Handshake', value: 'Verified' },
        icon: 'server'
      },
      {
        num: '04',
        title: 'View Live Site',
        duration: 'Serverless Delivery',
        description: 'Google Firebase App Hosting detects the updated manifest tag, auto-provisions Cloud Run server instances with safe zero-downtime rolling deploys, and updates active Cloudflare DNS maps.',
        tech: ['Firebase App Hosting', 'Cloud Run', 'Cloudflare'],
        metrics: { label: 'Traffic Transition', value: '0s Downtime' },
        icon: 'activity'
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

const ProjectThumbnailVideo = ({ projectId, activePhaseIdx }: { projectId: string; activePhaseIdx: number }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.log("Autoplay waiting for video population:", err);
      });
    }
  }, [projectId, activePhaseIdx]);

  const baseProjectId = projectId.replace(/-\d+$/, '');
  const videoSrc = `/videos/${baseProjectId}-phase-${activePhaseIdx + 1}.mp4`;

  return (
    <div className="relative rounded-xl overflow-hidden bg-o5-card aspect-video flex flex-col w-full min-h-[220px]">
      {/* Video element - prepped for hosting short videos demonstrating gitops workflows */}
      <video
        ref={videoRef}
        key={`${projectId}-${activePhaseIdx}`}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        loop
        muted={isMuted}
        autoPlay
        playsInline
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const WorkspacePage = ({ onNavigate, darkMode }: { onNavigate: (page: PageType) => void; darkMode: boolean; key?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(120);
  const [gravity, setGravity] = useState(0.4);
  const [speed, setSpeed] = useState(1.5);
  const [colorMode, setColorMode] = useState<'slate' | 'cyber' | 'aurora'>('slate');
  const [isMouseIn, setIsMouseIn] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [activeProjectPhases, setActiveProjectPhases] = useState<{ [key: string]: number }>({
    'google-cloud': 0,
    'google-cloud-2': 0,
    'google-cloud-3': 0,
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [selectedProjectDetail, setSelectedProjectDetail] = useState<any | null>(null);

  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      if (currentScrollY < 0) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsFilterVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsFilterVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (selectedProjectDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProjectDetail]);

  const [swipeActiveIndexes, setSwipeActiveIndexes] = useState<{ [key: string]: number }>({
    'google-cloud': 0,
    'google-cloud-2': 0,
    'google-cloud-3': 0,
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
      {/* Sticky Horizontal Filter Bar */}
      <div className={`sticky top-[72px] md:top-[80px] z-30 bg-o5-beige/90 dark:bg-o5-beige/90 backdrop-blur-md border-b border-o5-ink/10 py-4 mb-10 transition-all duration-300 transform ${
        isFilterVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 md:-translate-y-28 opacity-0 pointer-events-none'
      }`}>
        <div className="editorial-container flex flex-wrap justify-center md:justify-start items-center gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-o5-ink/40 mr-2 sm:block hidden">Filter:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'google-cloud', label: 'Google Cloud' }
          ].map((btn) => {
            const isActive = activeFilter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveFilter(btn.id as any)}
                className={`font-mono text-[9px] tracking-wider uppercase px-4 py-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'bg-o5-ink text-o5-beige border-o5-ink dark:bg-o5-ink dark:text-o5-beige dark:border-o5-ink' 
                    : 'bg-transparent text-o5-ink/40 border-o5-ink/10 hover:text-o5-ink hover:border-o5-ink/20 hover:bg-o5-ink/[0.02]'
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Projects Workspace */}
      <div className="editorial-container mb-32 pt-4">
        {/* Project Cards */}
        <div className="space-y-20">
          {PROJECTS.filter(p => activeFilter === 'all' || p.id === activeFilter || p.id.startsWith(activeFilter)).map((project) => {
            const activePhaseIdx = activeProjectPhases[project.id] ?? 0;
            const activePhase = project.phases[activePhaseIdx];

            return (
              <div 
                key={project.id}
                id={project.id}
                className="bg-o5-card rounded-2xl border border-o5-ink/10 shadow-sm overflow-hidden text-left hover:border-o5-ink/20 transition-all duration-500"
              >
                {/* Project Header Bar */}
                <div className="px-4 sm:px-8 md:px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-o5-card w-full overflow-hidden">
                  <div className="space-y-2.5 text-left min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h2 className="text-xl md:text-2xl font-serif text-o5-ink font-light flex items-center">
                        <span>{project.title}</span>
                      </h2>
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-o5-ink/40 hover:text-o5-ink transition-all duration-300 hover:scale-110 p-1 flex items-center justify-center cursor-pointer shrink-0"
                        title={`View ${project.title} Repository`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={26} />
                      </a>
                      <button
                        onClick={() => setSelectedProjectDetail(project)}
                        className="font-mono text-[11px] uppercase tracking-[0.2em] text-o5-ink hover:text-o5-ink/60 transition-all duration-300 cursor-pointer text-left font-semibold ml-1 shrink-0"
                      >
                        [ open ]
                      </button>
                    </div>
                    {/* Clean text-based subtitle to the heading (no blocks) in one single horizontal line */}
                    <div className="flex flex-row flex-nowrap items-center gap-x-3 text-o5-ink/65 text-[10px] md:text-xs font-mono font-medium uppercase tracking-wider overflow-x-auto scrollbar-none whitespace-nowrap w-full py-0.5 select-none">
                      {['GitHub', 'Pulumi (TypeScript)', 'Google Cloud Build', 'Google Cloud IAM', 'Google Cloud Secret Manager', 'Google Cloud Artifact Registry', 'Google Firebase App Hosting', 'Cloudflare'].map((techName, idx, arr) => (
                        <span key={techName} className="flex items-center gap-3 shrink-0">
                          <span>{techName}</span>
                          {idx < arr.length - 1 && <span className="text-o5-ink/20 font-light text-sm font-sans">|</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0 select-none">
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-o5-ink/50 font-medium">
                      Google Cloud
                    </span>
                  </div>
                </div>

                {/* Unified Responsive Project Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-6 lg:pt-8 pb-8 px-4 sm:px-8 md:px-12 relative items-center bg-o5-card w-full">
                  
                  {/* Left Column: Visual Video Thumbnail Showcase */}
                  <div className="col-span-1 lg:col-span-9 flex items-center justify-center w-full">
                    <ProjectThumbnailVideo projectId={project.id} activePhaseIdx={activePhaseIdx} />
                  </div>

                  {/* Right Column: Floating Timeline Navigator (Horizontal on mobile/tablet, Vertical on desktop) */}
                  <div className="col-span-1 lg:col-span-3 relative flex flex-col justify-center min-h-[60px] lg:min-h-[220px] w-full pr-0 overflow-hidden">
                    <div className="w-full">
                      
                      <div className="relative flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide pb-2 lg:pb-0 w-full whitespace-nowrap">
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
                              className={`group text-left px-4 py-2 lg:pl-4 lg:pr-1 lg:py-3 rounded-lg flex items-center gap-3 transition-all duration-300 relative focus:outline-none cursor-pointer shrink-0 w-auto lg:w-full ${
                                isSelected 
                                  ? 'bg-o5-ink/5 dark:bg-o5-beige/5 font-bold' 
                                  : 'hover:bg-o5-ink/[0.02]'
                              }`}
                            >
                              {/* Sliding indicator bar */}
                              {isSelected && (
                                <motion.div 
                                  layoutId={`active-timeline-indicator-${project.id}`}
                                  className="absolute left-0 right-0 bottom-0 h-0.5 lg:top-0 lg:bottom-0 lg:left-0 lg:right-auto lg:w-1 lg:h-full bg-o5-ink rounded-full"
                                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                              )}

                              {/* Info Labels */}
                              <div className="flex flex-col shrink-0">
                                <span className={`font-mono text-xs uppercase tracking-wider transition-colors duration-300 ${
                                  isSelected ? 'text-o5-ink font-bold' : 'text-o5-ink/40 group-hover:text-o5-ink/60'
                                }`}>
                                  {phase.title}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                </div>


                {/* Tech stack moved to the top */}

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

      {/* Immersive Dedicated Project Deep-Dive Page */}
      <AnimatePresence>
        {selectedProjectDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[10000] w-full h-screen bg-o5-beige text-o5-ink overflow-y-auto p-6 md:p-10 flex flex-col justify-between selection:bg-o5-ink selection:text-o5-white"
          >
            {/* a [close] button on the right top corner of the page should take users back to the workspace page */}
            <button
              onClick={() => setSelectedProjectDetail(null)}
              className="absolute top-8 right-8 md:top-12 md:right-16 font-mono text-xs uppercase tracking-widest text-o5-ink hover:text-o5-ink/60 transition-colors cursor-pointer"
            >
              [close]
            </button>

            {/* Empty Hero region (top space) */}
            <div className="w-full h-12 md:h-16" />

            {/* The project title and the github icon should be placed in the center of the page */}
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
              <div className="relative w-full max-w-4xl flex items-center justify-center mb-8">
                <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-o5-ink uppercase leading-none text-center px-16">
                  {selectedProjectDetail.title}
                </h1>
                <button
                  onClick={() => setSelectedProjectDetail(null)}
                  className="absolute right-0 font-mono text-xs uppercase tracking-widest text-o5-ink hover:text-o5-ink/60 transition-colors cursor-pointer"
                >
                  [close]
                </button>
              </div>
              <a
                href={selectedProjectDetail.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-o5-ink/60 hover:text-o5-ink transition-all duration-300 hover:scale-110 p-2 flex items-center justify-center cursor-pointer mb-12"
                title={`View ${selectedProjectDetail.title} Repository`}
              >
                <Github size={48} />
              </a>

              {/* Mermaid Diagram */}
              <div className="w-full max-w-5xl overflow-visible">
                <Mermaid chart={selectedProjectDetail.mermaidDiagram || MERMAID_DIAGRAM} darkMode={darkMode} />
              </div>

              {/* Tech Stack Section */}
              <div className="w-full max-w-5xl mt-16 border-t border-o5-ink/10 pt-16 text-left">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8 pb-4 border-b border-o5-ink/10">
                  <h2 className="text-2xl font-serif font-light tracking-tight text-o5-ink uppercase">
                    Tech Stack
                  </h2>
                  <p className="font-mono text-xs text-o5-ink/50 mt-1 md:mt-0 uppercase tracking-widest">
                    {selectedProjectDetail.title}
                  </p>
                </div>
                
                {selectedProjectDetail.id === 'google-cloud-2' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Layer 1 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">01 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Source Control & Versioning (GitOps Entry Points)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">GitHub:</strong> Manages the multi-repo codebase:
                          <div className="mt-2 pl-3 border-l border-o5-ink/10 space-y-1 font-mono text-xs text-o5-ink/70">
                            <div>• <a href="https://github.com/s1yav/sriyav-portfolio" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">sriyav-portfolio</a> <span className="opacity-50">(Application Repository)</span></div>
                            <div>• <a href="https://github.com/s1yav/sriyav-firebasehost" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">sriyav-firebasehost</a> <span className="opacity-50">(Infrastructure Repository)</span></div>
                            <div>• <a href="https://github.com/s1yav/gitops" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">gitops</a> <span className="opacity-50">(Bootstrap Connections Repository)</span></div>
                          </div>
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Git Manifests:</strong> Employs declarative JSON structures (<code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">portfolio-image-tag.json</code>) to track and promote Docker container tags and commit SHAs between repositories.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 2 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">02 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Infrastructure as Code (IaC)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Pulumi (TypeScript/Node.js):</strong> Declaratively defines and deploys the entire GCP and Firebase infrastructure stack (Firebase project configuration, web apps, App Hosting backends, traffic splits, and service accounts).
                        </li>
                      </ul>
                    </div>

                    {/* Layer 3 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">03 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        CI/CD & Build Automation (GitOps Control Project)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Build (v2 Connections):</strong> Automates pipeline jobs and runs infrastructure updates by responding to GitHub webhooks.
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Docker & BuildKit:</strong> Packages and builds the portfolio web application container image from the source repository.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 4 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">04 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Security & Identity
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud IAM:</strong> Facilitates secure service account impersonation (exchanging the GitOps CloudBuild identity for short-lived access as the firebasehost service account in the target project), eliminating static API keys.
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Secret Manager:</strong> Encrypts and securely injects target project IDs, registry names, and service account credentials into build environments at runtime.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 5 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">05 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Artifact Storage
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Artifact Registry:</strong> Securely stores built portfolio application Docker container images before deployment.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 6 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">06 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Hosting & Server Compute (Target Project)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Firebase App Hosting:</strong> Next-generation serverless hosting platform that manages the lifecycle of the web app (auto-provisioning Cloud Run instances and routing traffic).
                        </li>
                      </ul>
                    </div>

                    {/* Layer 7 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300 md:col-span-2">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">07 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        DNS & Custom Domains
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Firebase App Hosting Domains:</strong> Maps custom domains and subdomains (<code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">sriyav.com</code> and <code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">www.sriyav.com</code>) to the App Hosting backend, automatically provisioning SSL/TLS certificates and custom domain routing.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Layer 1 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">01 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Source Control & Versioning (GitOps Entry Points)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">GitHub:</strong> Manages the multi-repo codebase:
                          <div className="mt-2 pl-3 border-l border-o5-ink/10 space-y-1 font-mono text-xs text-o5-ink/70">
                            <div>• <a href="https://github.com/s1yav/sriyav-portfolio" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">sriyav-portfolio</a> <span className="opacity-50">(Application Repository)</span></div>
                            <div>• <a href="https://github.com/s1yav/sriyav-firebasehost" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">sriyav-firebasehost</a> <span className="opacity-50">(Infrastructure Repository)</span></div>
                            <div>• <a href="https://github.com/s1yav/gitops" target="_blank" rel="noopener noreferrer" className="hover:underline text-o5-ink">gitops</a> <span className="opacity-50">(Bootstrap Connections Repository)</span></div>
                          </div>
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Git Manifests:</strong> Employs declarative JSON structures (<code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">portfolio-image-tag.json</code>) to track and promote Docker container tags between repositories.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 2 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">02 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Infrastructure as Code (IaC)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Pulumi (TypeScript/Node.js):</strong> Declaratively defines and deploys the entire GCP and Firebase infrastructure stack (custom domains, backends, traffic splits, and service accounts).
                        </li>
                      </ul>
                    </div>

                    {/* Layer 3 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">03 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        CI/CD & Build Automation (GitOps Control Project)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Build (v2 Connections):</strong> Automates pipeline jobs by responding to GitHub webhooks.
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Docker & BuildKit:</strong> Packages and builds the Node.js/Express portfolio web application container.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 4 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">04 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Security & Identity
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud IAM:</strong> Facilitates secure <strong className="font-medium text-o5-ink">Service Account Impersonation</strong> (exchanging the GitOps <code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">s1yav-cloudbuild-sa</code> identity for short-lived access as <code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">sriyav-firebasehost-sa</code> in the target project), removing the need for static API keys.
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Secret Manager:</strong> Encrypts and securely injects GitHub and Pulumi API access tokens into build environments at runtime.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 5 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">05 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Artifact Storage
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Cloud Artifact Registry:</strong> Securely stores built Docker container images before deployment.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 6 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">06 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        Hosting & Server Compute (Target Project)
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Google Firebase App Hosting:</strong> Next-generation serverless hosting platform that manages the lifecycle of the web app under-the-hood (auto-provisioning Cloud Run instances and routing traffic).
                        </li>
                        <li>
                          <strong className="font-medium text-o5-ink">Express (TypeScript):</strong> The backend framework powering the portfolio website and API routes.
                        </li>
                      </ul>
                    </div>

                    {/* Layer 7 */}
                    <div className="border border-o5-ink/10 p-6 rounded-2xl bg-o5-ink/[0.01] hover:bg-o5-ink/[0.02] transition-colors duration-300 md:col-span-2">
                      <span className="font-mono text-xs text-o5-ink/40 tracking-wider">07 // LAYER</span>
                      <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-o5-ink mt-1 mb-4 pb-2 border-b border-o5-ink/5">
                        DNS & Custom Domains
                      </h3>
                      <ul className="space-y-4 font-sans text-sm text-o5-ink/80 leading-relaxed">
                        <li>
                          <strong className="font-medium text-o5-ink">Cloudflare:</strong> Acts as the DNS Registrar, managing the custom domain (<code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">sriyav.com</code> and <code className="font-mono text-xs bg-o5-ink/5 px-1 py-0.5 rounded">www.sriyav.com</code>) routing records (A, CNAME, and TXT verification records).
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All pages MUST have the same footer including the pages within the Project cards */}
            <Footer onNavigate={(page) => {
              setSelectedProjectDetail(null);
              onNavigate(page);
            }} />
          </motion.div>
        )}
      </AnimatePresence>
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
      "Initializing secure outbound thread",
      "Validating telemetry package schema",
      `Encrypting payload for node: ${formState.email}`,
      "Synthesizing transaction package",
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
        <div className="max-w-2xl mx-auto bg-o5-card border border-o5-ink/10 p-8 md:p-12 rounded-2xl text-left shadow-sm">
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
                  placeholder="YOUR NAME"
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
                  placeholder="YOUR EMAIL ADDRESS"
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
                  placeholder="YOUR MESSAGE"
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
            <WorkspacePage key="workspace" onNavigate={handleNavigate} darkMode={darkMode} />
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
