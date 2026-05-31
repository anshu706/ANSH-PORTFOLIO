import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Globe,
  Moon,
  Sun,
  ExternalLink,
  Download,
  Search,
  Filter,
  ChevronRight,
  Code2,
  Database,
  Bot,
  Cpu,
  BarChart3,
} from "lucide-react";

const NAME = "Ansh Upadhayay";
const ROLE = "Python • Automation • AI/ML • Data";
const LOCATION = "India";
const RESUME_LINK =
  "https://drive.google.com/file/d/1f5vKbzw0k6mkAgqhFY2nZ7Ra5tbhIHm-/view?usp=drive_link";
const EMAIL = "anshupadhayay212@gmail.com";
const GITHUB = "https://github.com/anshu706";
const LINKEDIN = "https://www.linkedin.com/in/ansh-upadhayay-011b77310/";

const skills = [
  { label: "Python", icon: <Code2 className="h-4 w-4" /> },
  { label: "Java", icon: <Code2 className="h-4 w-4" /> },
  { label: "AI/ML", icon: <Bot className="h-4 w-4" /> },
  { label: "Data Science", icon: <BarChart3 className="h-4 w-4" /> },
];

const projectsSeed = [
  {
    title: "Minesweeper",
    year: 2025,
    level: "Intermediate",
    description:
      "A classic Minesweeper game built with Python and Tkinter with a clean graphical interface.",
    stack: ["Python", "Tkinter"],
    tags: ["python"],
    repo: "https://github.com/anshu706/Py1Projects/blob/main/Phase-2/minesweeper.py",
  },
  {
    title: "Sudoku Solver",
    year: 2025,
    level: "Intermediate",
    description:
      "A Sudoku solver built with Python and Tkinter with a clean graphical interface.",
    stack: ["Python", "Tkinter"],
    tags: ["python"],
    repo: "https://github.com/anshu706/Py1Projects/blob/main/Phase-2/sudoku_solver.py",
  },
  {
    title: "Rock Paper Scissors",
    year: 2025,
    level: "Beginner",
    description:
      "A classic Rock Paper Scissors game built with Python and Tkinter with a clean graphical interface.",
    stack: ["Python", "Tkinter"],
    tags: ["python"],
    repo: "https://github.com/anshu706/Py1Projects/blob/main/Phase-2/rock_paper_scissors.py",
  },
  {
    title: "AIM Trainer",
    year: 2025,
    level: "Advanced",
    description:
      "An AI-powered aim trainer that helps you improve your aiming skills with real-time feedback and analytics.",
    stack: ["Python", "Tkinter"],
    tags: ["python"],
    repo: "https://github.com/anshu706/Py1Projects/blob/main/Phase-2/aim_trainer.py",
  },
  {
    title: "All of these projects",
    year: 2025,
    description:
      "A collection of all my Python projects with a clean graphical interface.",
    stack: ["Python", "Tkinter"],
    tags: ["python"],
    repo: "https://github.com/anshu706/Py1Projects",
    demo: "https://anshu706.github.io/Py1Projects/",
  },
];

const tagPalette = {
  python: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  automation:
    "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
  "ai/ml":
    "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-900/30 dark:text-fuchsia-200",
  bots: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
  api: "bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-200",
  dbms: "bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200",
  sql: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
  web: "bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-200",
  algorithms:
    "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200",
  education: "bg-lime-100 text-lime-900 dark:bg-lime-900/30 dark:text-lime-200",
  data: "bg-cyan-100 text-cyan-900 dark:bg-cyan-900/30 dark:text-cyan-200",
  ml: "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200",
};

function useDarkMode() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    setEnabled(stored ? stored === "dark" : prefersDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", enabled);
    localStorage.setItem("theme", enabled ? "dark" : "light");
  }, [enabled]);
  return { enabled, setEnabled };
}

const Section = ({ id, title, children, right }) => (
  <section id={id} className="scroll-mt-24 py-14">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </div>
  </section>
);

const BadgePill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-2xl px-3 py-1 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const CardBox = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900 ${className}`}
  >
    {children}
  </div>
);

const TextLink = ({ href, children }) => (
  <a
    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children} <ExternalLink className="h-3.5 w-3.5" />
  </a>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const { enabled: dark, setEnabled: setDark } = useDarkMode();
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const projects = projectsSeed;

  const allTags = useMemo(() => {
    const s = new Set();
    projects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesQuery =
        `${p.title} ${p.description} ${p.stack.join(" ")} ${p.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesTags =
        activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [projects, query, activeTags]);

  const toggleTag = (t) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-black dark:text-zinc-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="font-semibold tracking-tight">
            {NAME}
          </a>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <a href="#projects" className="hover:underline">
              Projects
            </a>
            <a href="#skills" className="hover:underline">
              Skills
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a
              href={RESUME_LINK}
              className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" /> Resume
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <button
              onClick={() => setDark(!dark)}
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
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

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-zinc-100 dark:to-zinc-900" />
        <div className="mx-auto max-w-6xl px-4 py-16 flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/20">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />{" "}
              Open to Internships & Projects
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-2">
              Hi, I'm {NAME}.<br />
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-cyan-400">
                Architecting intelligent solutions.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              {ROLE} • Based in {LOCATION}. I like to solve real world problems
              using technology. I also like to build games.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-white shadow hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <ChevronRight className="h-4 w-4" /> View Projects
              </a>
              <a
                href={RESUME_LINK}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardBox className="relative overflow-hidden p-6">
              <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                Quick Stats
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                  <div className="text-2xl font-bold">20</div>
                  <div className="text-xs text-zinc-500">Mini Projects</div>
                </div>
                <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                  <div className="text-2xl font-bold">Python</div>
                  <div className="text-xs text-zinc-500">Primary Stack</div>
                </div>
                <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                  <div className="text-2xl font-bold">AI/ML</div>
                  <div className="text-xs text-zinc-500">Focus Area</div>
                </div>
              </div>
            </CardBox>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <Section id="projects" title="Projects">
        <div className="flex flex-col gap-6">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <CardBox className="h-full">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    {p.year} • {p.level}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <BadgePill
                        key={t}
                        className={
                          tagPalette[t] ||
                          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                        }
                      >
                        {t}
                      </BadgePill>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
                  {p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-black/5 px-2 py-1 text-[11px] text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {p.repo && (
                    <TextLink href={p.repo}>
                      <Github className="h-3.5 w-3.5" /> Code
                    </TextLink>
                  )}
                  {p.demo && (
                    <TextLink href={p.demo}>
                      <Globe className="h-3.5 w-3.5" /> Demo
                    </TextLink>
                  )}
                </div>
              </CardBox>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills">
        <div className="flex flex-col gap-4">
          {skills.map((s, i) => (
            <CardBox key={i} className="flex items-center justify-between">
              <div className="text-sm font-medium">{s.label}</div>
              <div className="opacity-70">{s.icon}</div>
            </CardBox>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="About">
        <div className="flex flex-col gap-6">
          <CardBox>
            <h3 className="text-lg font-semibold">Who am I?</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              I am Ansh Upadhayay, a student deeply passionate about AI and
              Machine Learning. Armed with a strong command of Python, C, and
              Object-Oriented Programming, I thrive on dissecting complex
              problems and engineering meaningful solutions. My journey in tech
              is driven not just by curiosity, but by a genuine desire to build
              systems that matter.
            </p>
          </CardBox>
          <CardBox>
            <h3 className="text-lg font-semibold">Highlights</h3>
            <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>• Strong Python</li>
              <li>• Clean code, docs, and testing mindset</li>
              <li>• Curious about agents and automation</li>
            </ul>
          </CardBox>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-8 text-center text-xs text-zinc-500 dark:border-white/10">
        © {new Date().getFullYear()} {NAME}
      </footer>
    </div>
  );
}
