import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Globe,
  Moon,
  Sun,
  ExternalLink,
  Download,
  ChevronRight,
  Code2,
  Database,
  Bot,
  Cpu,
  Cloud,
  Terminal,
  Workflow,
  Award,
  ArrowUpRight,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";

const NAME = "Ansh Upadhayay";
const ROLE = "Cloud • Automation • CI/CD • DevOps";
const LOCATION = "India";

const RESUME_LINK =
  "https://drive.google.com/file/d/1JYFwts9nLx7Zv3RFBDQ6i1COSISgE-z9/view?usp=sharing";
const EMAIL = "anshupadhayay212@gmail.com";
const GITHUB = "https://github.com/anshu706";
const LINKEDIN = "https://www.linkedin.com/in/ansh-upadhayay-011b77310/";

const projects = [
  {
    title: "Python Projects",
    year: "2025",
    level: "Collection",
    category: "Python",
    description:
      "A collection of Python mini-projects, with a browser-based project page available as a demo.",
    features: [
      "Multiple mini-projects",
      "Python practice",
      "Project showcase",
    ],
    stack: ["Python", "Tkinter", "GitHub Pages"],
    repo: "https://github.com/anshu706/PYTHON-PROJECTS",
    loom: "e8eb5fe02a4d41688b0d087adefbd6d8",
    video: "/videos/python-projects-demo.mp4",
    videoLink: "https://www.loom.com/share/e8eb5fe02a4d41688b0d087adefbd6d8",
    demo: "https://python-projects-seven-ruddy.vercel.app/",
    preview: "Python Projects • Live site",
  },
  {
    title: "Threat-Zone",
    year: "2026",
    level: "Advanced",
    category: "Web",
    description:
      "An industrial safety and hazard-visualization platform for modeling explosion consequences, analyzing risk zones, and supporting emergency planning through interactive maps and analytics.",
    features: [
      "Models Vapor Cloud Explosions (VCE) and BLEVE fireballs.",
      "Visualizes four hazard zones using interactive 2D/3D mapping.",
      "Estimates blast overpressure, TNT equivalency, and thermal radiation.",
      "Includes refinery presets, wind controls, risk charts, and safety advisories.",
      "Supports sharing simulation scenarios through URL-based state serialization.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Deck.gl",
      "Leaflet",
      "GSAP",
      "Recharts",
      "Tailwind CSS",
    ],
    repo: "https://github.com/anshu706/Threat-Zone",
    video: "/videos/threat-zone-demo.mp4",
    videoLink:
      "https://drive.google.com/file/d/1lo_HAmuBD-aL_l1Zgq3dcha6AVuhIbX6/view?usp=sharing",
    demo: "https://threat-zone.vercel.app/",
    preview: "Industrial Hazard Modeling • GIS Visualization",
  },
  {
    title: "Construction Project Monitoring Dashboard",
    year: "2026",
    level: "Advanced",
    category: "Web",
    description:
      "A construction project monitoring dashboard concept designed to bring project progress, schedules, budgets, site conditions, and safety indicators into a unified operational view.",
    features: [
      "Displays project status, completion progress, and key performance indicators.",
      "Supports Gantt-based scheduling, milestones, task dependencies, and critical-path tracking.",
      "Tracks budget utilization, cost variance, and Schedule and Cost Performance Indexes (SPI/CPI).",
      "Includes weather-impact monitoring, safety alerts, and resource-utilization indicators.",
      "Designed for role-based dashboards, reporting, and data-driven project decisions.",
    ],
    stack: [
      "React",
      "Node.js",
      "PostgreSQL",
      "InfluxDB",
      "WebSockets",
      "Docker",
      "Kubernetes",
      "AWS",
    ],
    repo: "https://github.com/anshu706/Construction-Project",
    video: "/videos/construction-demo.mp4",
    videoLink:
      "https://drive.google.com/file/d/1ouUPrA-vxLA-ZxwYo0ckDbvL96AsUYta/view?usp=sharing",
    demo: "https://construction-project-liard.vercel.app/",
    preview: "Construction Operations • Progress & Budget Analytics",
  },
];

const skillGroups = [
  {
    title: "Programming",
    subtitle: "Scripting and problem solving",
    icon: Code2,
    skills: [
      {
        name: "Python",
        detail: "Scripting, automation and application logic",
      },
      {
        name: "Bash",
        detail: "Shell commands and task automation",
      },
    ],
  },
  {
    title: "DevOps & Delivery",
    subtitle: "Build, package and ship software",
    icon: Workflow,
    skills: [
      {
        name: "Git & GitHub",
        detail: "Version control and collaboration",
      },
      {
        name: "CI/CD",
        detail: "Automating build and delivery workflows",
      },
      {
        name: "Docker",
        detail: "Containerization fundamentals",
      },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    subtitle: "Modern deployment environments",
    icon: Cloud,
    skills: [
      {
        name: "AWS",
        detail: "Cloud concepts and services",
      },
    ],
  },
  {
    title: "Tools & Systems",
    subtitle: "The day-to-day engineering toolkit",
    icon: Terminal,
    skills: [
      {
        name: "SQL / Databases",
        detail: "Working with structured data",
      },
      {
        name: "Troubleshooting",
        detail: "Breaking problems down and debugging",
      },
    ],
  },
];

const certificates = [
  {
    name: "AWS Academy Cloud Foundations",
    issuer: "AWS Academy",
    date: "",
    verify: "",
    image: "/certificates/aws-academy-cloud-foundations.png",
    description:
      "Trained badge covering core AWS cloud concepts, services, security and pricing.",
  },
  {
    name: "AWS Cloud Practitioner (CLF-C02) Practice Exam",
    issuer: "AWS Training & Certification",
    date: "Jul 21, 2026",
    verify: "",
    image: "/certificates/aws-cloud-practitioner-clf-c02.png",
    description:
      "Completed the official practice exam for AWS Certified Cloud Practitioner.",
  },
  {
    name: "AWS Solutions Architect Associate (SAA-C03) Practice Exam",
    issuer: "AWS Training & Certification",
    date: "Jul 9, 2026",
    verify: "",
    image: "/certificates/aws-solutions-architect-saa-c03.png",
    description:
      "Completed the official practice exam for AWS Certified Solutions Architect – Associate.",
  },
  {
    name: "AWS Developer Associate (DVA-C02) Practice Exam",
    issuer: "AWS Training & Certification",
    date: "Jul 17, 2026",
    verify: "",
    image: "/certificates/aws-developer-dva-c02.png",
    description:
      "Completed the official practice exam for AWS Certified Developer – Associate.",
  },
  {
    name: "AWS AI Practitioner (AIF-C01) Practice Exam",
    issuer: "AWS Training & Certification",
    date: "Aug 3, 2026",
    verify: "",
    image: "/certificates/aws-ai-practitioner-aif-c01.png",
    description:
      "Completed the official practice exam for AWS Certified AI Practitioner.",
  },
  {
    name: "Arcade Simulator: DevOps Engineer",
    issuer: "Google Cloud Skills Arcade",
    date: "Sep 12, 2026",
    verify: "",
    image: "/certificates/google-cloud-arcade-devops.png",
    description:
      "Google Skills Arcade badge for completing the DevOps Engineer simulator.",
  },
  {
    name: "Claude 101",
    issuer: "Anthropic",
    date: "",
    verify: "",
    image: "/certificates/claude-101.png",
    description:
      "Certificate of completion for Anthropic's introductory Claude course.",
  },
  {
    name: "AI Fluency: Framework & Foundations",
    issuer: "Anthropic",
    date: "",
    verify: "",
    image: "/certificates/ai-fluency.png",
    description:
      "Certificate of completion covering the foundations of working effectively with AI.",
  },
];

const Section = ({ id, title, eyebrow, children, right }) => (
  <section id={id} className="scroll-mt-24 py-14 sm:py-16">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-500">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  </section>
);

const CardBox = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900 ${className}`}
  >
    {children}
  </div>
);

const Pill = ({ children }) => (
  <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[11px] text-zinc-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
    {children}
  </span>
);

const ExternalLinkButton = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-cyan-500 dark:text-blue-400"
  >
    {children}
    <ArrowUpRight className="h-4 w-4" />
  </a>
);

/* Project overview card: shown when a project has no video / live preview,
   or when its video file can't be loaded. */
const ProjectOverview = ({ project }) => (
  <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6 text-center">
    <div className="absolute -left-10 top-10 h-36 w-36 rounded-full bg-emerald-400/10 blur-3xl transition duration-500 group-hover:bg-emerald-400/20" />
    <div className="absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

    <div className="absolute inset-0 opacity-20">
      <div className="h-full w-full bg-[radial-gradient(#71717a_1px,transparent_1px)] [background-size:22px_22px]" />
    </div>

    <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 transition duration-500 group-hover:scale-110 group-hover:-rotate-3">
      <Code2 className="h-8 w-8" />
    </div>

    <p className="relative text-base font-semibold text-white">
      {project.title}
    </p>

    <p className="relative mt-2 max-w-sm text-sm leading-6 text-zinc-400">
      {project.preview || "Project overview"}
    </p>

    <div className="relative mt-4 flex flex-wrap justify-center gap-2">
      {project.stack.slice(0, 4).map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300"
        >
          {tech}
        </span>
      ))}
    </div>

    {project.repo && (
      <a
        href={project.repo}
        target="_blank"
        rel="noreferrer"
        className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-zinc-200 transition duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
      >
        <Github className="h-3.5 w-3.5" />
        Explore Repository
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    )}
  </div>
);

/* Loom embed (autoplays muted). Loom has no loop option, so it plays once. */
const LoomEmbed = ({ id, title }) => (
  <iframe
    title={`${title} demo video`}
    src={`https://www.loom.com/embed/${id}?autoplay=1&muted=1&hideEmbedTopBar=true`}
    loading="lazy"
    allow="autoplay; fullscreen; picture-in-picture"
    allowFullScreen
    className="min-h-[300px] w-full flex-1 bg-black"
  />
);

/* Muted, looping autoplay video. Clicking it opens the linked video (Drive / Loom).
   It only plays while it is on screen, to save data and battery. */
const VideoPreview = ({ src, href, title, fallback }) => {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true; // browsers only allow autoplay when muted

    if (typeof IntersectionObserver === "undefined") {
      el.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  // If the video file is missing or can't play, show the overview card
  // (never the live website).
  if (failed) return fallback;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${title} video`}
      className="relative block min-h-[300px] w-full flex-1 cursor-pointer bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
    >
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-contain"
      />

      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
        Watch full video
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </a>
  );
};

/* -------------------------------------------------------------------------- */
/*                         RED MATRIX RAIN BACKGROUND                         */
/* -------------------------------------------------------------------------- */

const MatrixRain = ({ dark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const chars =
      "アイウエオカキクケコサシスANSH UPADHAYAYセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]=+*$#";
    const fontSize = 16;
    const bg = dark ? "0,0,0" : "250,250,250"; // matches the page background
    const trail = dark ? "#1f6bff" : "#0040d6"; // main blue
    const head = dark ? "#a8c8ff" : "#4d8dff"; // brighter leading characters
    const frameMs = 45; // lower = faster rain

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let drops = [];
    let rafId = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${bg})`;
      ctx.fillRect(0, 0, width, height);

      const columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () =>
        Math.floor((Math.random() * -height) / fontSize)
      );
    };

    const draw = (time) => {
      rafId = requestAnimationFrame(draw);
      if (time - last < frameMs) return;
      last = time;

      // translucent fill leaves the fading trails
      ctx.fillStyle = `rgba(${bg},0.07)`;
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;

        if (y > 0) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = Math.random() > 0.93 ? head : trail;
          ctx.fillText(ch, i * fontSize, y);
        }

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Respect "reduce motion": keep a plain background, no animation
    if (!reduceMotion) rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${
        dark ? "opacity-40" : "opacity-25"
      }`}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                         ANIMATED FLOATING DOCK                            */
/* -------------------------------------------------------------------------- */

/*
  Dock icons: Globe, Code, Terminal, Award, Sparkles.
  Each one scrolls to its section. `badge` shows the red bubble on an item;
  delete the `badge: 3` property to hide it.
*/
const dockItems = [
  { id: "home", label: "Home", Icon: Globe },
  { id: "projects", label: "Projects", Icon: Code2 },
  { id: "skills", label: "Skills", Icon: Terminal },
  { id: "certificates", label: "Certificates", Icon: Award },
  { id: "about", label: "About", Icon: Sparkles },
];

const FloatingDock = ({ dark }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, x: "-50%" }}
    animate={{ opacity: 1, y: 0, x: "-50%" }}
    transition={{ duration: 0.5, delay: 0.25 }}
    className="fixed bottom-5 left-1/2 z-50"
  >
    <nav
      aria-label="Floating navigation"
      className={`flex items-center gap-3 rounded-[28px] border p-3 shadow-2xl backdrop-blur-2xl ${
        dark
          ? "border-white/10 bg-zinc-950/85 shadow-black/50"
          : "border-black/10 bg-white/85 shadow-zinc-400/30"
      }`}
    >
      {dockItems.map(({ id, label, Icon, badge }) => (
        <motion.a
          key={id}
          href={`#${id}`}
          aria-label={badge ? `${label} (${badge} new)` : label}
          title={label}
          whileHover={{ y: -6, scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors duration-200 ${
            dark
              ? "border-white/15 bg-gradient-to-b from-zinc-700/70 via-zinc-800 to-zinc-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_6px_14px_rgba(0,0,0,0.5)] hover:border-white/30"
              : "border-black/10 bg-gradient-to-b from-white via-zinc-100 to-zinc-200 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(0,0,0,0.12)] hover:border-black/25"
          }`}
        >
          <Icon className="h-7 w-7" strokeWidth={2} />

          {badge ? (
            <span
              className={`absolute -right-1.5 -top-1.5 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[12px] font-bold leading-none text-white shadow-md ${
                dark ? "border-zinc-950" : "border-white"
              }`}
            >
              {badge}
            </span>
          ) : null}

          <span
            className={`pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-medium opacity-0 shadow-xl transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 ${
              dark
                ? "border-white/10 bg-zinc-900 text-zinc-100"
                : "border-black/10 bg-white text-zinc-800"
            }`}
          >
            {label}
          </span>
        </motion.a>
      ))}
    </nav>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN PORTFOLIO                                */
/* -------------------------------------------------------------------------- */

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  // Close the certificate preview with Esc and lock page scroll while open
  useEffect(() => {
    if (!selectedCert) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedCert]);

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesCategory =
          activeCategory === "All" ||
          project.category === activeCategory;

        const searchable =
          `${project.title} ${project.description} ${project.stack.join(" ")} ${project.features.join(" ")}`.toLowerCase();

        return (
          matchesCategory &&
          searchable.includes(query.toLowerCase())
        );
      }),
    [query, activeCategory]
  );

  const themeClasses = dark
    ? "bg-black text-zinc-100 [color-scheme:dark]"
    : "bg-zinc-50 text-zinc-900 [color-scheme:light]";

  return (
    <div
      className={`min-h-screen antialiased transition-colors duration-500 ${themeClasses}`}
    >
      <MatrixRain dark={dark} />

      <style>{`
        @keyframes certificateMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .certificate-track {
          display: flex;
          width: max-content;
          animation: certificateMarquee 70s linear infinite;
        }

        .certificate-track.paused {
          animation-play-state: paused;
        }

        .portfolio-grid {
          background-image: radial-gradient(rgba(45,212,191,.12) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          .certificate-track {
            animation: none;
          }

          *, *::before, *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
          dark
            ? "border-white/10 bg-black/75"
            : "border-black/5 bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a
            href="#home"
            className="shrink-0 font-semibold tracking-tight"
          >
            {NAME}
          </a>

          <nav className="hidden items-center gap-5 text-sm md:flex">
            <a href="#projects" className="transition hover:text-emerald-400">
              Projects
            </a>
            <a href="#skills" className="transition hover:text-emerald-400">
              Skills
            </a>
            <a
              href="#certificates"
              className="transition hover:text-emerald-400"
            >
              Certificates
            </a>
            <a href="#about" className="transition hover:text-emerald-400">
              About
            </a>
            <a
              href={RESUME_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs transition hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
            </a>

            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5" />
            </a>

            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              className="rounded-full p-2 transition hover:bg-white/10"
            >
              {dark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pb-24">
        {/* HERO */}
        <section id="home" className="relative isolate overflow-hidden">
          <div className="portfolio-grid pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <div className="absolute -right-32 top-16 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1.3fr_.7fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Open to Internships & Projects
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                Hi, I’m {NAME}.
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Automating scalable infrastructure.
                </span>
              </h1>

              <p
                className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${
                  dark ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {ROLE} • Based in {LOCATION}. I’m building my foundation in
                cloud infrastructure, automation, and reliable software
                delivery—one practical project at a time.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 font-medium transition hover:-translate-y-0.5 ${
                    dark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-zinc-900 text-white hover:bg-zinc-700"
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                  Explore Projects
                </a>

                <a
                  href={RESUME_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2.5 transition hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>Python</Pill>
                <Pill>Linux</Pill>
                <Pill>Git</Pill>
                <Pill>Cloud & DevOps</Pill>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.12 }}
            >
              <div
                className={`relative overflow-hidden rounded-3xl border p-5 shadow-2xl ${
                  dark
                    ? "border-white/10 bg-zinc-900/80 shadow-emerald-950/20"
                    : "border-black/10 bg-white shadow-zinc-200"
                }`}
              >
                <div className="mb-5 flex items-center justify-end">
                  <span className="text-xs text-zinc-500">
                    developer.profile
                  </span>
                </div>

                <div className="space-y-3 font-mono text-sm">
                  <p className="text-zinc-500">{"// currently building"}</p>
                  <p>
                    <span className="text-emerald-400">const</span> focus = [
                  </p>
                  <p className="pl-5 text-cyan-300">
                    "cloud fundamentals",
                  </p>
                  <p className="pl-5 text-cyan-300">
                    "automation & CI/CD",
                  </p>
                  <p className="pl-5 text-cyan-300">
                    "reliable deployments"
                  </p>
                  <p>];</p>

                  <div className="my-5 h-px bg-white/10" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <Code2 className="mb-2 h-4 w-4 text-emerald-400" />
                      <p className="font-semibold">Build</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Practical projects
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.04] p-3">
                      <Workflow className="mb-2 h-4 w-4 text-cyan-400" />
                      <p className="font-semibold">Automate</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Repeatable workflows
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS */}
        <Section
          id="projects"
          title="Selected Projects"
          eyebrow="Things I’ve built"
          right={
            <span className="text-sm text-zinc-500">
              {filteredProjects.length} projects
            </span>
          }
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div
              className={`flex flex-1 items-center gap-2 rounded-xl border px-3 ${
                dark
                  ? "border-white/10 bg-zinc-900"
                  : "border-black/10 bg-white"
              }`}
            >
              <Sparkles className="h-4 w-4 text-zinc-500" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, tools, features..."
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl border px-3 py-2 text-sm transition duration-300 hover:-translate-y-0.5 ${
                    activeCategory === category
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-500"
                      : dark
                        ? "border-white/10 text-zinc-300 hover:bg-white/5"
                        : "border-black/10 text-zinc-700 hover:bg-black/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.04, 0.2),
                }}
                className={`group overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 ${
                  dark
                    ? "border-white/10 bg-zinc-900/80"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="flex flex-col p-5 sm:p-7">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-zinc-500">
                        {project.year}
                        {project.level ? ` · ${project.level}` : ""}
                      </span>
                      <Pill>{project.category}</Pill>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight">
                      {project.title}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        dark ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {project.description}
                    </p>

                    {project.features?.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Key Highlights
                        </p>

                        <ul className="space-y-2.5 text-sm">
                          {project.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              <span
                                className={
                                  dark ? "text-zinc-300" : "text-zinc-700"
                                }
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Built With
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <Pill key={tech}>{tech}</Pill>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-4 pt-6">
                      {project.repo && (
                        <ExternalLinkButton href={project.repo}>
                          <Github className="h-4 w-4" />
                          Source Code
                        </ExternalLinkButton>
                      )}

                      {project.demo && (
                        <ExternalLinkButton href={project.demo}>
                          <Globe className="h-4 w-4" />
                          Open Live Demo
                        </ExternalLinkButton>
                      )}
                    </div>
                  </div>

                  <div
                    className={`min-h-[300px] border-t p-3 lg:border-l lg:border-t-0 ${
                      dark
                        ? "border-white/10 bg-black/30"
                        : "border-black/10 bg-zinc-100"
                    }`}
                  >
                    <div className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101114]">
                      {project.video ? (
                        <VideoPreview
                          src={project.video}
                          href={project.videoLink || project.demo}
                          title={project.title}
                          fallback={
                            project.loom ? (
                              <LoomEmbed id={project.loom} title={project.title} />
                            ) : (
                              <ProjectOverview project={project} />
                            )
                          }
                        />
                      ) : project.loom ? (
                        <LoomEmbed id={project.loom} title={project.title} />
                      ) : project.demo ? (
                        <iframe
                          title={`${project.title} live preview`}
                          src={project.demo}
                          loading="lazy"
                          className="min-h-[300px] w-full flex-1 bg-white"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      ) : (
                        <ProjectOverview project={project} />
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}

            {filteredProjects.length === 0 && (
              <CardBox>
                <p className="text-sm text-zinc-500">
                  No projects match that search. Try another keyword or
                  category.
                </p>
              </CardBox>
            )}
          </div>
        </Section>

        {/* SKILLS — UPDATED BLACK TEXT ON WHITE CARDS */}
        <Section
          id="skills"
          title="Skills & Toolkit"
          eyebrow="My engineering toolbox"
        >
          <p
            className={`mb-7 max-w-4xl text-sm leading-7 ${
              dark ? "text-zinc-300" : "text-zinc-600"
            }`}
          >
            A growing toolkit focused on programming fundamentals, Linux, cloud
            infrastructure, and software delivery. Update these cards as your
            hands-on experience grows.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {skillGroups.map((group, index) => {
              const Icon = group.icon;

              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-zinc-200 bg-white p-7 text-black shadow-lg transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-400/10 sm:p-9">
                    {/* Category Heading */}
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-500">
                        <Icon size={25} strokeWidth={2} />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-black sm:text-xl">
                          {group.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-zinc-700">
                          {group.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Skill List */}
                    <div className="space-y-6">
                      {group.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-start justify-between gap-4 rounded-xl p-1 transition-colors duration-200"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-black sm:text-base">
                              {skill.name}
                            </h4>

                            <p className="mt-1 text-sm leading-6 text-zinc-700">
                              {skill.detail}
                            </p>
                          </div>

                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* CERTIFICATES */}
        <Section
          id="certificates"
          title="Certificates & Learning"
          eyebrow="Proof of progress"
        >
          <div className="relative overflow-hidden">
            <div
              className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r ${
                dark ? "from-black" : "from-zinc-50"
              } to-transparent`}
            />
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l ${
                dark ? "from-black" : "from-zinc-50"
              } to-transparent`}
            />

            <div
              className={`certificate-track gap-4 py-3 ${
                carouselPaused || selectedCert ? "paused" : ""
              }`}
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
            >
              {[...certificates, ...certificates].map(
                (certificate, index) => (
                  <article
                    key={`${certificate.name}-${index}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${certificate.name}`}
                    onClick={() =>
                      certificate.image && setSelectedCert(certificate)
                    }
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        certificate.image
                      ) {
                        e.preventDefault();
                        setSelectedCert(certificate);
                      }
                    }}
                    className={`group w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border transition duration-300 hover:border-emerald-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      dark
                        ? "border-white/10 bg-zinc-900"
                        : "border-black/10 bg-white"
                    }`}
                  >
                    {certificate.image ? (
                      <div className="relative">
                        <img
                          src={certificate.image}
                          alt={`${certificate.name} certificate`}
                          className="aspect-[4/3] w-full border-b border-black/5 bg-white object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-900">
                            <ZoomIn className="h-3.5 w-3.5" />
                            Click to enlarge
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent">
                        <div className="absolute -right-5 -top-8 h-28 w-28 rounded-full border border-emerald-400/20" />
                        <div className="absolute -bottom-12 -left-5 h-28 w-28 rounded-full border border-cyan-400/20" />
                        <Award className="h-12 w-12 text-emerald-400" />
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-xs text-emerald-500">
                        {certificate.issuer}
                        {certificate.date ? ` · ${certificate.date}` : ""}
                      </p>

                      <h3 className="mt-2 font-semibold">
                        {certificate.name}
                      </h3>

                      <p className="mt-2 min-h-[40px] text-xs leading-5 text-zinc-500">
                        {certificate.description}
                      </p>

                      {certificate.verify ? (
                        <a
                          href={certificate.verify}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-cyan-400"
                        >
                          Verify credential
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </Section>

        {/* ABOUT */}
        <Section
          id="about"
          title="About Me"
          eyebrow="A little about my journey"
        >
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <CardBox className="relative overflow-hidden border-zinc-200 bg-white p-6 text-zinc-900 sm:p-8">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-600">
                  <Code2 className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Who am I?
                  </h3>
                  <p className="text-xs text-zinc-600">
                    IT Student · Developer · Continuous Learner
                  </p>
                </div>
              </div>

              <p className="relative mt-5 text-sm leading-7 text-zinc-700 sm:text-base">
                I’m Ansh Upadhayay, an IT student interested in building
                practical software and learning how applications are deployed
                and maintained. I enjoy exploring Python, Linux, Git, cloud
                concepts, and automation, and I’m working toward stronger
                skills in CI/CD and infrastructure. My goal is to turn what I
                learn into useful projects, document the process, and keep
                improving through hands-on practice.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Hands-on learning",
                  "Problem solving",
                  "Automation",
                  "Cloud fundamentals",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-700 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardBox>

            <div className="grid gap-4">
              <CardBox className="border-zinc-200 bg-white p-6 text-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900">
                    Current Focus
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  Strengthening Linux, Git, scripting, containers, and CI/CD
                  fundamentals through practical projects and consistent
                  learning.
                </p>
              </CardBox>

              <CardBox className="border-zinc-200 bg-white p-6 text-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900">
                    What Drives Me
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  Understanding how systems work, solving technical problems,
                  and making repetitive tasks simpler through automation.
                </p>
              </CardBox>

              <CardBox className="border-zinc-200 bg-white p-6 text-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60">
                <h3 className="font-semibold text-zinc-900">
                  Let’s Connect
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  Open to internships, collaborations, and interesting project
                  discussions.
                </p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                  <a
                    href={GITHUB}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-cyan-600"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-cyan-600"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-cyan-600"
                  >
                    Email
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </CardBox>
            </div>
          </div>
        </Section>
      </main>

      {/* CERTIFICATE PREVIEW */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCert.name} certificate`}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate preview"
              className="absolute -top-12 right-0 rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={selectedCert.image}
              alt={`${selectedCert.name} certificate`}
              className="mx-auto max-h-[80vh] w-auto max-w-full rounded-xl bg-white object-contain shadow-2xl"
            />

            <p className="mt-3 text-center text-sm text-zinc-300">
              {selectedCert.name}
            </p>
          </div>
        </div>
      )}

      {/* ANIMATED DOCK */}
      <FloatingDock dark={dark} />

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-right text-xs text-zinc-500">
        <p>
          Designed & built by{" "}
          <span className="text-zinc-300">{NAME}</span>
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} · Built with React, Tailwind CSS &
          Framer Motion
        </p>
      </footer>
    </div>
  );
}
