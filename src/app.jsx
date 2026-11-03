import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Linkedin, Globe, MapPin, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Compass, BookOpen, Layers, CheckCircle2, ShieldCheck, Cpu, SlidersHorizontal, Terminal, Activity, Sparkles } from 'lucide-react';
import initiatives from './data/initiatives.js';
import brands from './data/brands.json';
import { profile } from './data/profile.js';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = profile.categories;

const NAV_LINKS = [
  { href: '#home', label: 'HOME' },
  { href: '#work', label: 'VENTURES' },
  { href: '#milestones', label: 'MILESTONES' },
  { href: '#about', label: 'THINKING' },
  { href: '#frameworks', label: 'FRAMEWORKS' },
  { href: '#contact', label: 'CONTACT' }
];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component
    className={className}
    initial={enabled ? { opacity: 0, y: 24 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 'some', margin: '150px' }}
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
      setState(img.naturalWidth > 0 ? 'loaded' : 'loaded');
    } else {
      setState('loading');
    }
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">E.</span><span>Visual Inisiatif</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={() => setState('error')} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', latest => setScrolled(latest > 50));

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
      <div className="header-actions">
        <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled} aria-label="Toggle animasi">
          <span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}
        </button>
        <Magnetic href="#contact" className="cv-pill" aria-label="Hubungi Ervan Erianto">
          <span>TERHUBUNG</span>
        </Magnetic>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>
          {open ? <X/> : <Menu/>}
        </button>
      </div>
    </div>
    <AnimatePresence>
      {open && <motion.nav className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ ease: EASE, duration: 0.35 }}>
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label} <ArrowUpRight size={18}/>
          </a>
        ))}
        <div className="mobile-menu-footer">
          <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled}>
            <span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}
          </button>
          <a href="#contact" onClick={() => setOpen(false)} className="cv-pill">
            <span>HUBUNGI VIA LINKEDIN</span>
          </a>
        </div>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);

  // Parallax on scroll
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 85]);

  // Subtle interactive 3D mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 });

  const bgTextX = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const bgTextY = useTransform(springY, [-0.5, 0.5], [-14, 14]);
  const portraitX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const portraitY = useTransform(springY, [-0.5, 0.5], [8, -8]);

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

  return <section id="home" className="hero" ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
    <div className="hero-top">
      <span>{profile.topline[0]}<br/><span className="muted">{profile.topline[1]}</span></span>
      <span className="availability"><i />BASED IN {profile.location.toUpperCase()}</span>
    </div>

    {/* Background crimson display typography with mouse tilt */}
    <motion.div
      className="hero-title display"
      aria-hidden="true"
      style={enabled ? { y: titleY, x: bgTextX } : {}}
      initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      {profile.heroDisplayWord}
    </motion.div>

    {/* Authentic Cutout Portrait with mouse depth & rim lighting */}
    <motion.div
      className="hero-portrait"
      style={enabled ? { y: visualY, x: portraitX } : {}}
      initial={enabled ? { opacity: 0, scale: 1.06 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
    >
      <div className="hero-ambient-glow" aria-hidden="true" />
      <img src={profile.portrait} alt={profile.portraitAlt} width="1024" height="1536" fetchPriority="high" />
      <div className="hero-portrait-mask" aria-hidden="true" />
    </motion.div>

    {/* Left Negative Space Typography */}
    <motion.div
      className="hero-intro"
      style={enabled ? { y: copyY } : {}}
      initial={enabled ? { opacity: 0, x: -30 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
    >
      <div className="hero-eyebrow-badge">
        <span className="live-pulse" />
        <span>PROPERTY · BUSINESS · SYSTEMS</span>
      </div>

      <p className="handwriting">Hello, I’m</p>
      
      <h1 className="hero-display-name display">
        {profile.name}<span>.</span>
      </h1>
      
      <div className="hero-role-pill">
        <span>REAL ESTATE DEVELOPER · FOUNDER · AUTHOR</span>
      </div>

      <p className="hero-description">
        {profile.subheadline}
      </p>

      <div className="hero-cta-group">
        <Magnetic href="#work" className="primary-link">
          <span>JELAJAHI KARYA</span> <ArrowDown size={16}/>
        </Magnetic>
        <Magnetic href="#about" className="secondary-outline-link">
          <span>PRINSIP BERPIKIR</span> <ArrowUpRight size={15}/>
        </Magnetic>
      </div>

      <div className="hero-status-row">
        <span className="hero-location"><MapPin size={12} /> {profile.location}</span>
        <span className="hero-availability"><span className="status-dot"/> STRATEGIC INITIATIVES</span>
      </div>
    </motion.div>

    {/* 3 Strategic Pillars Rail */}
    <motion.div
      className="hero-side"
      initial={enabled ? { opacity: 0, x: 25 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: EASE }}
    >
      <div className="hero-manifesto">
        <span className="crosshair spin-subtle" aria-hidden="true">✳</span>
        <p>{profile.manifesto[0]}<br /><strong>{profile.manifesto[1]}</strong></p>
      </div>
      <div className="hero-stats">
        {profile.groups.map((grp, idx) => (
          <motion.div
            key={grp.code}
            className="hero-stat-item"
            initial={enabled ? { opacity: 0, y: 15 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
          >
            <span className="display">0{idx + 1}</span>
            <p><strong>{grp.code}</strong><br/>{grp.tag}<br/><span className="stat-sub">{grp.label}</span></p>
          </motion.div>
        ))}
        <a href="#milestones" className="hero-timeline-link">
          <span>{profile.timelineLabel}</span> · 9+ TAHUN PRAKTIK <ArrowDown size={13}/>
        </a>
      </div>
    </motion.div>

    {/* Hero Bottom Bar */}
    <div className="hero-bottom">
      <button className="reel-button" onClick={() => onProject(initiatives[0])}>
        <span className="play-circle"><Compass size={13} /></span>
        SELECTED VENTURES
        <span className="muted">THE PRACTICE · KNOWLEDGE · TECH</span>
      </button>
      <span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span>
      <span className="edition">{profile.footer.domain.toUpperCase()} / {profile.footer.copyrightYear}</span>
    </div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return <motion.article
    ref={ref}
    className={`project-card ${index < 2 ? 'featured-card' : ''}`}
    layout
    initial={enabled ? { opacity: 0, y: 32 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: enabled ? 0.5 : 0, delay: (index % 3) * 0.06, ease: EASE }}
  >
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Buka inisiatif ${project.title}`}>
      <motion.div className="project-picture" style={enabled ? { y } : {}}>
        <MediaImage src={project.image} alt={project.title}/>
      </motion.div>
      <span className="project-type">{project.group}</span>
      <span className="project-hover"><ArrowUpRight size={22}/></span>
      <span className="project-frame" aria-hidden="true" />
      <div className="project-card-glow" aria-hidden="true" />
    </button>
    <button className="project-caption" onClick={() => onOpen(project)}>
      <span className="project-number display">{`0${index + 1}`}</span>
      <span className="project-text-block">
        <h3>{project.title}</h3>
        <span className="project-category">{project.category} · {project.status}</span>
        <p className="project-snippet">{project.summary}</p>
      </span>
      <span className="caption-arrow"><ArrowUpRight size={18}/></span>
    </button>
  </motion.article>;
}

function BrandStrip() {
  const ref = useRef(null);
  const [showAll, setShowAll] = useState(false);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const loopWidth = useRef(0);
  const position = useRef(0);
  const enabled = useContext(MotionContext);
  const inView = useInView(ref, { amount: 0.1 });

  useEffect(() => {
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [showAll]);

  useAnimationFrame((_, delta) => {
    if (!enabled || paused || interacting || showAll || !inView || !loopWidth.current) return;
    position.current -= delta * 0.038;
    if (Math.abs(position.current) >= loopWidth.current) position.current += loopWidth.current;
    const rail = ref.current?.querySelector('.brand-rail');
    if (rail) rail.style.transform = `translate3d(${position.current}px,0,0)`;
  });

  const move = dir => {
    if (!loopWidth.current) return;
    position.current += dir * 180;
    if (position.current > 0) position.current -= loopWidth.current;
    if (Math.abs(position.current) >= loopWidth.current) position.current += loopWidth.current;
    const rail = ref.current?.querySelector('.brand-rail');
    if (rail) rail.style.transform = `translate3d(${position.current}px,0,0)`;
  };

  return <Reveal className="brand-section">
    <div className="brand-heading">
      <p>INITIATIVES, VENTURES &amp; SYSTEMS<br/><strong>THE PRACTICE · THE KNOWLEDGE · THE TECHNOLOGY</strong></p>
      <div>
        <button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">
          {showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}
          {showAll ? <Minus size={14}/> : <Plus size={14}/>}
        </button>
        {!showAll && <>
          <button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi' : 'Jeda animasi'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>
            {paused ? <Play size={13}/> : <Pause size={13}/>}
          </button>
          <button className="icon-button" onClick={() => move(-1)} aria-label="Sebelumnya"><ChevronLeft size={17}/></button>
          <button className="icon-button" onClick={() => move(1)} aria-label="Selanjutnya"><ChevronRight size={17}/></button>
        </>}
      </div>
    </div>
    <div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Daftar inisiatif dan bidang praktik">
      {showAll ? brands.map(b => (
        <div className="brand-logo" key={b.name} role="listitem">
          <img src={b.logo} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/>
          <span>{b.name}</span>
        </div>
      )) : (
        <div className="brand-rail">
          {[0, 1].map(copy => (
            <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {brands.map(b => (
                <div className="brand-logo" key={b.name}>
                  <img src={b.logo} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  </Reveal>;
}

function SelectedVentures({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');

  const featuredList = initiatives.filter(i => i.featured);
  const results = featuredList.filter(p => {
    const matchesCategory =
      category === 'Semua' ||
      p.category === category ||
      p.group.toLowerCase().includes(category.toLowerCase());
    const searchStr = `${p.title} ${p.shortTitle || ''} ${p.group} ${p.category} ${p.role || ''} ${p.summary || ''}`.toLowerCase();
    const matchesQuery = searchStr.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return <section id="work" className="portfolio section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{profile.portfolioHeading.eyebrow}</span>
        <h2>{profile.portfolioHeading.headline}<span className="accent">.</span></h2>
      </div>
      <div className="heading-tag-pill">
        <span>CURATED VENTURES · 6 KEY INITIATIVES</span>
      </div>
    </Reveal>
    <p className="section-lead">
      {profile.portfolioHeading.subtitle}
    </p>

    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => (
          <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
            {c === category && <motion.span className="filter-line" layoutId="filter-line"/>}
          </button>
        ))}
      </div>
      <label className="search-box">
        <Search size={15}/>
        <span>Cari</span>
        <input aria-label="Cari inisiatif atau kata kunci" type="search" placeholder="Cari inisiatif, buku, sistem AI…" value={query} onChange={e => setQuery(e.target.value)}/>
      </label>
    </Reveal>

    <motion.div className="project-grid curated-grid" layout>
      <AnimatePresence mode="popLayout">
        {results.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={onProject}/>
        ))}
      </AnimatePresence>
    </motion.div>

    {results.length === 0 && (
      <div className="empty-state">
        <p>Tidak ada inisiatif untuk “{query}”.</p>
        <button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset filter <X size={15}/></button>
      </div>
    )}

    <BrandStrip/>
  </section>;
}

function SelectedMilestones() {
  const m = profile.milestonesHeading;
  const milestonesRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: milestonesRef, offset: ['start center', 'end center'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return <section id="milestones" className="milestones-section section-wrap" ref={milestonesRef}>
    <div className="milestones-layout">
      {/* Left Column: Sticky Summary & Metric */}
      <Reveal className="milestones-sticky-col">
        <span className="eyebrow">{m.eyebrow}</span>
        <h2 className="display">{m.title}<span className="accent">.</span></h2>
        
        <div className="milestone-hero-stat">
          <span className="display stat-big">2017</span>
          <span className="stat-arrow">→</span>
          <span className="display stat-big">NOW</span>
          <span className="stat-sublabel">9+ YEARS EMPIRICAL PRACTICE</span>
        </div>

        <p className="milestone-desc">{m.subtitle}</p>

        <div className="milestone-principle-tag">
          <CheckCircle2 size={15} color="#e32b3c"/>
          <span>BERAKAR PADA REALITAS EKSEKUSI</span>
        </div>
      </Reveal>

      {/* Right Column: Cinematic Timeline Stream */}
      <div className="milestones-stream">
        <div className="timeline-rail" aria-hidden="true">
          <motion.div className="timeline-rail-active" style={{ scaleY }} />
        </div>

        <div className="milestone-cards-list">
          {profile.milestones.map((ms, i) => (
            <Reveal key={ms.year} className="milestone-stream-card" delay={i * 0.08}>
              <div className="milestone-node" aria-hidden="true">
                <span className="node-dot"/>
              </div>
              <div className="milestone-card-body">
                <div className="milestone-card-top">
                  <span className="milestone-year display">{ms.year}</span>
                  <span className="milestone-category">{ms.category}</span>
                </div>
                <h3>{ms.title}</h3>
                <p>{ms.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>;
}

function About() {
  const a = profile.about;
  return <section id="about" className="about-section section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{a.eyebrow}</span>
        <h2 className="display">{a.title[0]}<br/>{a.title[1]}<span className="accent">{a.accentTitle}</span></h2>
      </div>
      <div className="heading-tag-pill">
        <span>PRINSIP EKSEKUSI &amp; ARSITEKTUR KEPUTUSAN</span>
      </div>
    </Reveal>

    {/* Hero Statement & Striking Quote */}
    <div className="about-statement-grid">
      <Reveal className="about-quote-box">
        <div className="quote-header">
          <span className="quote-mark display">“</span>
          <span className="quote-label">CORE PHILOSOPHY</span>
        </div>
        <blockquote>
          <p>{a.quote}</p>
        </blockquote>
        <div className="quote-author">
          <span className="author-name">— {profile.name}</span>
          <span className="author-creds">PROPERTY DEVELOPER · FOUNDER · AUTHOR</span>
        </div>
      </Reveal>

      <Reveal className="about-thesis-box" delay={0.1}>
        <div className="thesis-eyebrow">
          <Activity size={14} color="#e32b3c"/>
          <span>TESIS KERJA</span>
        </div>
        <p className="thesis-text">{a.thesis}</p>
        <div className="thesis-divider"/>
        <p className="thesis-sub">
          Pendidikan dan edukasi yang bernilai selalu berakar dari pembuktian di lapangan. Menolak euforia teori yang tidak tahan uji saat modal dialokasikan.
        </p>
      </Reveal>
    </div>

    {/* 3 Core Principles Cards */}
    <div className="principles-grid">
      {a.principles.map((pr, idx) => (
        <Reveal key={pr.num} className="principle-card" delay={idx * 0.1}>
          <div className="principle-top">
            <span className="display principle-num">{pr.num}</span>
            <span className="principle-tag">{pr.tag}</span>
          </div>
          <h4>{pr.title}</h4>
          <p>{pr.desc}</p>
        </Reveal>
      ))}
    </div>

    {/* 5-Stage Execution Framework Stream */}
    <Reveal className="framework-stage-bar">
      <span className="stage-bar-title">5-STAGE EXECUTION METHODOLOGY:</span>
      <div className="stage-nodes-row">
        {profile.process.map(([num, title]) => (
          <div key={num} className="stage-node-item">
            <span className="stage-num">{num}</span>
            <span className="stage-name">{title}</span>
            <span className="stage-arrow">→</span>
          </div>
        ))}
      </div>
    </Reveal>
  </section>;
}

function ProductsAndFrameworks({ onProject }) {
  const [cut, setCut] = useState(50);
  const containerRef = useRef(null);
  const h = profile.frameworksHeading;
  const b = profile.breakdown;

  const handlePointerMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setCut((x / rect.width) * 100);
  };

  return <section id="frameworks" className="frameworks-section section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{h.eyebrow}</span>
        <h2 className="display">{h.title}<span className="accent">.</span></h2>
      </div>
      <div className="heading-tag-pill">
        <span>APPLIED AI · SYSTEMS ARCHITECTURE · KNOWLEDGE TOOLS</span>
      </div>
    </Reveal>
    <p className="section-lead">
      {h.subtitle}
    </p>

    {/* 3 Key Framework Cards */}
    <div className="framework-cards-grid">
      {profile.frameworks.map((fw, idx) => (
        <Reveal key={fw.id} className="framework-tech-card" delay={idx * 0.08}>
          <div className="tech-card-header">
            <span className="tech-badge">{fw.badge}</span>
            <span className="tech-status"><span className="pulse-dot"/>{fw.status}</span>
          </div>
          <div className="tech-card-visual">
            <MediaImage src={fw.image} alt={fw.name}/>
          </div>
          <div className="tech-card-content">
            <span className="tech-category">{fw.category}</span>
            <h3>{fw.name}</h3>
            <p>{fw.summary}</p>
            <div className="tech-tags-row">
              {fw.highlights.map(tag => (
                <span key={tag} className="tech-tag-chip">{tag}</span>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* Interactive Decision Framework Tool: Assumption to Decision Slider */}
    <Reveal className="breakdown-interactive-wrapper" delay={0.15}>
      <div className="interactive-tool-head">
        <div>
          <span className="eyebrow">INTERACTIVE DECISION ENGINE</span>
          <h3 className="display">{b.titleLines[0]} {b.titleLines[1]}<span className="accent">.</span></h3>
        </div>
        <p>{b.subtitle}</p>
      </div>

      <div className="comparison-stage" ref={containerRef} style={{ '--cut': `${cut}%` }} onPointerMove={handlePointerMove} tabIndex={0} role="region" aria-label="Sebelum dan sesudah: Analisis Kelayakan dan Keputusan">
        <MediaImage src={b.rawImage} alt="Input awal data dan asumsi lahan" />
        <span className="comparison-label raw-label">{b.rawLabel}</span>
        <div className="comparison-final">
          <MediaImage src={b.finalImage} alt="Analisis kelayakan keputusan properti" />
          <span className="comparison-label final-label">{b.finalLabel}</span>
        </div>
        <div className="comparison-divider" aria-hidden="true">
          <span><ChevronLeft size={14} /><ChevronRight size={14} /></span>
        </div>
        <input type="range" min="0" max="100" value={cut} onChange={e => setCut(Number(e.target.value))} aria-label="Geser perbandingan asumsi vs analisis terstruktur" />
      </div>

      <div className="comparison-caption">
        <span>RAW / SITE INPUT DATA</span>
        <span className="drag-hint"><SlidersHorizontal size={13}/> GESER SLIDER UNTUK MENGUJI KEPUTUSAN</span>
        <span>STRUCTURED FEASIBILITY</span>
      </div>
    </Reveal>
  </section>;
}

function JourneyAndContact({ onProject }) {
  const [open, setOpen] = useState(0);

  return <section id="contact" className="closing-section section-wrap">
    {/* Part A: Chronological Progression Track */}
    <div className="journey-block">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">06 / CHRONOLOGICAL PROGRESSION</span>
          <h2 className="display">A JOURNEY IN BUILDING<span className="accent">.</span></h2>
        </div>
        <div className="heading-tag-pill">
          <span>2017 → PRESENT · 5 STRATEGIC PHASES</span>
        </div>
      </Reveal>

      <div className="journey-accordion-list">
        {profile.journey.map((job, i) => (
          <Reveal className={`journey-row ${open === i ? 'is-open' : ''}`} key={job.area} delay={i * 0.05}>
            <button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              <span className="journey-index display">{job.index}</span>
              <span className="journey-meta">
                <h3>{job.area}</h3>
                <span className="journey-tagline">{job.tagline}</span>
              </span>
              <span className="accordion-icon">{open === i ? <Minus size={18}/> : <Plus size={18}/>}</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <p className="journey-detail-text">{job.text}</p>
              </motion.div>}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
    </div>

    {/* Part B: Grand Closing Contact Statement */}
    <div className="contact-grand-block">
      <div className="contact-inner-grid">
        <Reveal className="contact-text-col">
          <span className="eyebrow">{profile.contact.eyebrow}</span>
          <h2 className="display contact-main-title">
            GOOD IDEAS NEED<br/>
            <span>GOOD EXECUTION.</span>
          </h2>
          <p className="contact-lead-desc">{profile.contact.text}</p>

          <div className="contact-actions-row">
            <Magnetic href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-primary-btn">
              <Linkedin size={20}/>
              <span>TERHUBUNG DI LINKEDIN</span>
              <ArrowUpRight size={18}/>
            </Magnetic>
          </div>

          <div className="contact-metadata-pills">
            <span className="meta-pill"><MapPin size={12}/> {profile.location}</span>
            <span className="meta-pill"><Globe size={12}/> Property · Business · Systems</span>
            <span className="meta-pill active-pill"><Activity size={12}/> Strategic Initiatives</span>
          </div>
        </Reveal>

        <Reveal className="contact-card-col" delay={0.15}>
          <button className="contact-preview-card" onClick={() => onProject(initiatives[0])} aria-label="Lihat inisiatif Dirham Land">
            <div className="preview-screen">
              <span className="preview-top">{profile.wordmark}<span>THE PRACTICE</span></span>
              <MediaImage src="./Asset/img/initiatives/dirham-land.svg" alt="Dirham Land Residential Practice"/>
              <span className="preview-title display">REAL ESTATE<br/><span>DEVELOPER.</span></span>
              <span className="preview-badge"><ArrowUpRight size={18}/></span>
            </div>
            <div className="preview-caption">
              <span>DIRHAM LAND &amp; RESIDENTIAL PRACTICE</span>
              <span className="preview-sub">2019 → NOW · HOUSING PORTFOLIO</span>
            </div>
          </button>
        </Reveal>
      </div>
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
  const sourceUrl = project.externalUrl || profile.contact.linkedinUrl;

  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <motion.div className="dialog-window project-dialog" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading">
        <span className="eyebrow">{project.group} · {project.category} · {project.status}</span>
        <button onClick={onClose} className="icon-button" aria-label="Tutup"><X/></button>
      </div>
      <div className="dialog-media still">
        <MediaImage src={project.image} alt={project.title} priority/>
      </div>
      <div className="dialog-description">
        <div>
          <h2 id="dialog-title">{project.title}</h2>
          <span className="accent" style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {project.role}
          </span>
          <p>{project.description}</p>
          <div className="dialog-tags">
            {(project.tags || []).map(t => (
              <span key={t} className="dialog-tag">{t}</span>
            ))}
          </div>
        </div>
        {sourceUrl && (
          <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {project.externalUrl ? 'Kunjungi Situs Inisiatif' : 'Hubungi via LinkedIn'}
            <ExternalLink size={15}/>
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('ervan-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => {
    setMotionOn(prev => {
      const next = !prev;
      try { localStorage.setItem('ervan-motion', next ? 'on' : 'off'); } catch {}
      return next;
    });
  };

  return <MotionConfig reducedMotion="user">
    <MotionContext.Provider value={enabled}>
      <a className="skip-link" href="#work">Lewati ke konten utama</a>
      <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true"/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        {/* Priority 1: Hero */}
        <Hero onProject={p => setProject(p)}/>
        
        {/* Priority 2: Selected Ventures / Work */}
        <SelectedVentures onProject={p => setProject(p)}/>
        
        {/* Priority 3: Selected Milestones */}
        <SelectedMilestones/>
        
        {/* Priority 4: About / How I Think */}
        <About/>
        
        {/* Priority 5: Products & Frameworks */}
        <ProductsAndFrameworks onProject={p => setProject(p)}/>
        
        {/* Priority 6: Journey + Contact */}
        <JourneyAndContact onProject={p => setProject(p)}/>
      </main>

      <footer className="footer">
        <a className="wordmark" href="#home">{profile.footer.wordmark}<span>®</span></a>
        <span>© {profile.footer.copyrightYear} {profile.footer.wordmark}. {profile.footer.signOff}</span>
        <span>{profile.footer.domain}</span>
      </footer>

      <AnimatePresence>
        {project && <ProjectDialog project={project} onClose={() => setProject(null)}/>}
      </AnimatePresence>
    </MotionContext.Provider>
  </MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App/>);
