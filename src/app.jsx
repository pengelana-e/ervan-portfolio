import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, ArrowDown, X, Menu, Linkedin, MapPin, ExternalLink, Activity } from 'lucide-react';
import initiatives from './data/initiatives.js';
import { profile } from './data/profile.js';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { href: '#work', label: 'WORK' },
  { href: '#milestones', label: 'MILESTONES' },
  { href: '#about', label: 'ABOUT' },
  { href: '#contact', label: 'CONTACT' }
];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component
    className={className}
    initial={enabled ? { opacity: 0, y: 20 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 'some', margin: '100px' }}
    transition={{ duration: 0.6, delay, ease: EASE }}
  >
    {children}
  </Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!src) {
      setState('error');
    } else if (img?.complete) {
      setState('loaded');
    } else {
      setState('loading');
    }
  }, [src]);

  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">E.</span><span>Visual Inisiatif</span></span>}
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      width="960"
      height="540"
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
      {...props}
    />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });

  return <motion.a
    className={className}
    style={{ x, y }}
    onPointerMove={e => {
      if (!enabled || e.pointerType !== 'mouse') return;
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - r.left - r.width / 2) * 0.25);
      y.set((e.clientY - r.top - r.height / 2) * 0.25);
    }}
    onPointerLeave={() => { x.set(0); y.set(0); }}
    {...props}
  >
    {children}
  </motion.a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', latest => setScrolled(latest > 40));

  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner">
      <a className="wordmark" href="#home" aria-label={`${profile.name}, beranda`}>
        {profile.wordmark}<span>®</span>
      </a>

      <nav className="desktop-nav">
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>
        {open ? <X /> : <Menu />}
      </button>
    </div>

    <AnimatePresence>
      {open && <motion.nav className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ ease: EASE, duration: 0.3 }}>
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label} <ArrowUpRight size={18} />
          </a>
        ))}
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero() {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);

  // Subtle Parallax on scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Subtle interactive 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 18 });

  const bgTextX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const portraitX = useTransform(springX, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return <section id="home" className="hero v4-clean-hero" ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
    {/* Background display typography with subtle tilt */}
    <motion.div
      className="hero-title display"
      aria-hidden="true"
      style={enabled ? { y: titleY, x: bgTextX } : {}}
      initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      {profile.heroHeadline}
    </motion.div>

    {/* Authentic Cutout Portrait */}
    <motion.div
      className="hero-portrait"
      style={enabled ? { y: visualY, x: portraitX } : {}}
      initial={enabled ? { opacity: 0, scale: 1.04 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
    >
      <div className="hero-ambient-glow" aria-hidden="true" />
      <img src={profile.portrait} alt={profile.portraitAlt} width="1024" height="1536" fetchPriority="high" />
      <div className="hero-portrait-mask" aria-hidden="true" />
    </motion.div>

    {/* Left Editorial Typography */}
    <motion.div
      className="hero-intro v4-editorial-intro"
      style={enabled ? { y: copyY } : {}}
      initial={enabled ? { opacity: 0, x: -25 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
    >
      <motion.h1
        className="hero-display-name display"
        initial={enabled ? { opacity: 0, y: 15 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      >
        {profile.name}<span>.</span>
      </motion.h1>

      <motion.div
        className="hero-identity-lines"
        initial={enabled ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
      >
        <p className="hero-primary-profession">{profile.primaryProfession}</p>
        <p className="hero-supporting-identity">{profile.supportingIdentity}</p>
      </motion.div>

      <motion.p
        className="hero-manifesto-quote"
        initial={enabled ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
      >
        “{profile.manifesto}”
      </motion.p>

      <motion.div
        className="hero-cta-group"
        initial={enabled ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
      >
        <Magnetic href="#work" className="primary-link">
          <span>EXPLORE MY WORK</span> <ArrowDown size={16} />
        </Magnetic>
      </motion.div>
    </motion.div>

    {/* Hero Bottom Bar */}
    <div className="hero-bottom">
      <span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={12} /></span>
      <span className="edition">{profile.location.toUpperCase()} · {profile.footer.copyrightYear}</span>
    </div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);

  return <motion.article
    className="project-card v4-card"
    initial={enabled ? { opacity: 0, y: 25 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: EASE }}
  >
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Buka ${project.title}`}>
      <div className="project-picture">
        <MediaImage src={project.image} alt={project.title} priority={true} />
      </div>
      <span className="project-hover" aria-hidden="true"><ArrowUpRight size={22} /></span>
      <span className="project-frame" aria-hidden="true" />
      <div className="project-card-glow" aria-hidden="true" />
    </button>

    <button className="project-caption v4-caption" onClick={() => onOpen(project)}>
      <span className="project-number display">{project.number}</span>
      <div className="project-text-block">
        <h3>{project.title}</h3>
        <p className="project-snippet">{project.summary}</p>
      </div>
      <span className="caption-arrow"><ArrowUpRight size={18} /></span>
    </button>
  </motion.article>;
}

function SelectedVentures({ onProject }) {
  return <section id="work" className="portfolio section-wrap">
    <Reveal className="section-heading v4-heading">
      <div>
        <span className="eyebrow">{profile.portfolioHeading.eyebrow}</span>
        <h2 className="display">{profile.portfolioHeading.headline}<span className="accent">.</span></h2>
      </div>
      <p className="section-lead v4-lead">
        {profile.portfolioHeading.subtitle}
      </p>
    </Reveal>

    <div className="project-grid v4-curated-grid">
      {initiatives.map((p, i) => (
        <ProjectCard key={p.id} project={p} index={i} onOpen={onProject} />
      ))}
    </div>
  </section>;
}

function SelectedMilestones() {
  const milestonesRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: milestonesRef, offset: ['start center', 'end center'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return <section id="milestones" className="milestones-section section-wrap" ref={milestonesRef}>
    <Reveal className="section-heading v4-heading">
      <div>
        <span className="eyebrow">{profile.milestonesHeading.eyebrow}</span>
        <h2 className="display">{profile.milestonesHeading.headline}<span className="accent">.</span></h2>
      </div>
      <p className="section-lead v4-lead">
        {profile.milestonesHeading.subtitle}
      </p>
    </Reveal>

    <div className="milestones-v4-container">
      <div className="timeline-rail" aria-hidden="true">
        <motion.div className="timeline-rail-active" style={{ scaleY }} />
      </div>

      <div className="milestones-v4-list">
        {profile.milestones.map((ms, i) => (
          <Reveal key={ms.year} className="milestone-v4-item" delay={i * 0.08}>
            <div className="milestone-v4-year display">{ms.year}</div>
            <div className="milestone-v4-content">
              <p dangerouslySetInnerHTML={{ __html: ms.text }} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>;
}

function About() {
  const a = profile.about;

  return <section id="about" className="about-section section-wrap">
    <Reveal className="section-heading v4-heading">
      <div>
        <span className="eyebrow">{a.eyebrow}</span>
        <h2 className="display">{a.heading}</h2>
        <p className="about-v4-subtitle">{a.subtitle}</p>
      </div>
    </Reveal>

    <div className="about-v4-narrative">
      {a.paragraphs.map((p, idx) => (
        <Reveal key={idx} delay={idx * 0.08}>
          <p className="about-v4-paragraph" dangerouslySetInnerHTML={{ __html: p }} />
        </Reveal>
      ))}

      <Reveal delay={0.25} className="about-v4-connect">
        <a href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="about-v4-linkedin-link">
          <Linkedin size={18} />
          <span>Terhubung di LinkedIn</span>
          <ArrowUpRight size={16} />
        </a>
      </Reveal>
    </div>
  </section>;
}

function JourneyAndContact({ onProject }) {
  const c = profile.contact;
  const practiceProject = initiatives[0];

  return <section id="contact" className="contact-section section-wrap">
    <div className="contact-v4-grid">
      <Reveal className="contact-v4-text-col">
        <span className="eyebrow">{c.eyebrow}</span>
        <h2 className="display contact-v4-title">
          {c.headline}
        </h2>
        <p className="contact-v4-desc">{c.intro}</p>

        <div className="contact-v4-actions">
          <Magnetic href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-primary-btn">
            <Linkedin size={20} />
            <span>{c.cta}</span>
            <ArrowUpRight size={18} />
          </Magnetic>
        </div>

        <div className="contact-v4-meta">
          <span><MapPin size={13} /> {c.location}</span>
          <span><Activity size={13} /> Property · Founder · Author · Applied AI</span>
        </div>
      </Reveal>

      <Reveal className="contact-v4-card-col" delay={0.15}>
        <button className="contact-v4-preview-card" onClick={() => onProject(practiceProject)} aria-label="Lihat detail Real Estate Development">
          <div className="preview-v4-screen">
            <span className="preview-v4-top">THE PRACTICE <span>REAL ESTATE DEVELOPMENT</span></span>
            <MediaImage src="./Asset/img/ventures/01_Real_Estate_Development.jpg" alt="Real Estate Development Practice" priority={true} />
          </div>
          <div className="preview-v4-caption">
            <span className="preview-v4-title">Real Estate Development</span>
            <span className="preview-v4-sub">Residential development, land partnerships, investment planning, and property ventures</span>
          </div>
        </button>
      </Reveal>
    </div>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <motion.div className="dialog-window project-dialog" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} transition={{ duration: 0.3, ease: EASE }}>
      <div className="dialog-heading">
        <span className="eyebrow">{project.number} · VENTURE FIELD</span>
        <button onClick={onClose} className="icon-button" aria-label="Tutup"><X /></button>
      </div>
      <div className="dialog-media still">
        <MediaImage src={project.image} alt={project.title} priority={true} />
      </div>
      <div className="dialog-description">
        <div>
          <h2 id="dialog-title">{project.title}</h2>
          <p>{project.description}</p>
          <div className="dialog-tags">
            {(project.tags || []).map(t => (
              <span key={t} className="dialog-tag">{t}</span>
            ))}
          </div>
        </div>
        <a className="outline-button" href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
          Diskusi Terkait Bidang Ini
          <ExternalLink size={15} />
        </a>
      </div>
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const enabled = !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  }, [enabled]);

  return <MotionConfig reducedMotion="user">
    <MotionContext.Provider value={enabled}>
      <a className="skip-link" href="#work">Lewati ke konten utama</a>
      <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <Header />
      <main>
        {/* 1. Hero: Clean Editorial Dominance */}
        <Hero />

        {/* 2. Selected Work: Exactly Six Venture Fields */}
        <SelectedVentures onProject={p => setProject(p)} />

        {/* 3. Selected Milestones: Compact Editorial Timeline */}
        <SelectedMilestones />

        {/* 4. About: Founder Profile & Background Narrative */}
        <About />

        {/* 5. Contact: Clean Grand Closing */}
        <JourneyAndContact onProject={p => setProject(p)} />
      </main>

      <footer className="footer">
        <a className="wordmark" href="#home">{profile.footer.wordmark}<span>®</span></a>
        <span>© {profile.footer.copyrightYear} {profile.footer.wordmark}. {profile.footer.signOff}</span>
        <span>{profile.footer.domain}</span>
      </footer>

      <AnimatePresence>
        {project && <ProjectDialog project={project} onClose={() => setProject(null)} />}
      </AnimatePresence>
    </MotionContext.Provider>
  </MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
