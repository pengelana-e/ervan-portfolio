import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Linkedin, Globe, MapPin, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Compass, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import initiatives from './data/initiatives.js';
import brands from './data/brands.json';
import { profile } from './data/profile.js';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = profile.categories;
const featured = initiatives.filter(i => i.featured);

const NAV_LINKS = [
  { href: '#home', label: 'HOME' },
  { href: '#work', label: 'WORK & VENTURES' },
  { href: '#writing', label: 'WRITING' },
  { href: '#about', label: 'ABOUT' },
  { href: '#journey', label: 'JOURNEY' },
  { href: '#contact', label: 'CONTACT' }
];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
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
    <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <a className="wordmark" href="#home" aria-label={`${profile.name}, beranda`}>
        {profile.wordmark}<span>®</span>
      </a>
      <nav className="desktop-nav">
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled} aria-label="Toggle animasi"><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
        <Magnetic href="#contact" className="cv-pill" aria-label="Hubungi Ervan Erianto"><span>CONTACT</span></Magnetic>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>{open ? <X/> : <Menu/>}</button>
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
          <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled}><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
          <a href="#contact" onClick={() => setOpen(false)} className="cv-pill"><span>HUBUNGI VIA LINKEDIN</span></a>
        </div>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top">
      <span>{profile.topline[0]}<br/><span className="muted">{profile.topline[1]}</span></span>
      <span className="availability"><i />BASED IN {profile.location.toUpperCase()}</span>
    </div>

    {/* Display condensed lettering in background */}
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>
      {profile.heroDisplayWord}
    </motion.div>

    {/* Authentic Portrait Visual (ervan-hero.png): Ervan on right, dark open space on left */}
    <motion.div className="hero-visual-frame" style={enabled ? { y: visualY } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.15 }}>
      <img src={profile.portrait} alt={profile.portraitAlt} width="1672" height="941" fetchPriority="high" />
      <div className="hero-visual-gradient" aria-hidden="true" />
    </motion.div>

    {/* Left Negative Space Typography */}
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.25, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p>
      <h1 className="hero-display-name display">{profile.name}<span>.</span></h1>
      
      <div className="hero-roles-stack">
        {profile.roles.map(r => (
          <span key={r} className="role-line display">{r}</span>
        ))}
      </div>

      <p className="hero-supporting-expertise">
        {profile.supportingExpertise}
      </p>

      <p className="hero-description">
        {profile.subheadline}
      </p>

      <div className="hero-cta-group">
        <Magnetic href="#work" className="primary-link">
          Jelajahi Work &amp; Ventures <ArrowDown size={16}/>
        </Magnetic>
        <a href="#about" className="hero-secondary-link">
          Cara Berpikir &amp; Prinsip →
        </a>
      </div>

      <span className="hero-location"><MapPin size={12} /> {profile.location}</span>
    </motion.div>

    {/* 3 Strategic Groups Pillar Rail */}
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 25 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.45, ease: EASE }}>
      <div className="hero-manifesto">
        <span className="crosshair" aria-hidden="true">✳</span>
        <p>{profile.manifesto[0]}<br /><strong>{profile.manifesto[1]}</strong></p>
      </div>
      <div className="hero-stats">
        {profile.groups.map((grp, idx) => (
          <div key={grp.code}>
            <span className="display">0{idx + 1}</span>
            <p><strong>{grp.code}</strong><br/>{grp.tag}<br/><span style={{ fontSize: '8px', color: '#888' }}>{grp.label}</span></p>
          </div>
        ))}
        <a href="#journey" className="hero-timeline-link">
          <ArrowDown size={14}/><span>{profile.timelineLabel} · GROUND TO ECOSYSTEM</span>
        </a>
      </div>
    </motion.div>

    {/* Hero Bottom Bar */}
    <div className="hero-bottom">
      <button className="reel-button" onClick={() => onProject(initiatives[0])}>
        <span className="play-circle"><Compass size={13} /></span>
        EXPLORE VENTURES
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

  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: enabled ? 0.45 : 0, delay: (index % 3) * 0.04, ease: EASE }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat inisiatif ${project.title}`}>
      <motion.div className="project-picture" style={enabled ? { y } : {}}>
        <MediaImage src={project.image} alt={project.title}/>
      </motion.div>
      <span className="project-type">{project.group}</span>
      <span className="project-hover"><ArrowUpRight size={22}/></span>
      <span className="project-frame" aria-hidden="true" />
    </button>
    <button className="project-caption" onClick={() => onOpen(project)}>
      <span className="project-category">{project.category} · {project.status}</span>
      <h3>{project.title}</h3>
      <p className="project-card-summary" style={{ fontSize: '11px', color: '#a09c9a', lineHeight: '1.5', margin: '4px 0 8px', textAlign: 'left' }}>
        {project.summary}
      </p>
      <span className="project-more">DETAIL &amp; STATUS <ArrowUpRight size={14}/></span>
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

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(6);

  const results = initiatives.filter(p => {
    const matchesCategory =
      category === 'Semua' ||
      p.category === category ||
      p.group.toLowerCase().includes(category.toLowerCase());
    const searchStr = `${p.title} ${p.shortTitle || ''} ${p.group} ${p.category} ${p.role || ''} ${p.summary || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    const matchesQuery = searchStr.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const projects = results.slice(0, expanded ? results.length : limit);

  return <section id="work" className="portfolio section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{profile.portfolioHeading.eyebrow}</span>
        <h2>{profile.portfolioHeading.headline}<span className="accent">.</span></h2>
      </div>
      <button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); } }}>
        {expanded ? 'RINGKAS TAMPILAN' : `SEMUA VENTURES (${initiatives.length})`}
        <ArrowRight size={21}/>
      </button>
    </Reveal>
    <p className="section-lead" style={{ maxWidth: '820px', color: '#a09c9a', fontSize: '13px', lineHeight: '1.8', marginBottom: '24px' }}>
      {profile.portfolioHeading.subtitle}
    </p>

    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => (
          <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); }}>
            {c}
            {c === category && <motion.span className="filter-line" layoutId="filter-line"/>}
          </button>
        ))}
      </div>
      <label className="search-box">
        <Search size={15}/>
        <span>Cari</span>
        <input aria-label="Cari inisiatif, ventures, atau kata kunci" type="search" placeholder="Inisiatif, buku, sistem AI, atau topik…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); }}/>
      </label>
    </Reveal>

    <motion.div className="project-grid" layout>
      <AnimatePresence mode="popLayout">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} onOpen={onProject}/>
        ))}
      </AnimatePresence>
    </motion.div>

    {projects.length === 0 && (
      <div className="empty-state">
        <p>Tidak ada inisiatif untuk “{query}”.</p>
        <button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button>
      </div>
    )}

    <BrandStrip/>
  </section>;
}

function Writing() {
  const w = profile.writing;
  return <section id="writing" className="writing-section section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{w.eyebrow}</span>
        <h2>{w.title}<span className="accent">.</span></h2>
      </div>
      <span className="edition" style={{ color: '#e32b3c', border: '1px solid #87212b', padding: '6px 12px', borderRadius: '4px', fontSize: '10px' }}>
        {w.statusBadge}
      </span>
    </Reveal>
    <p className="section-lead" style={{ maxWidth: '840px', color: '#a09c9a', fontSize: '14px', lineHeight: '1.8', marginBottom: '32px' }}>
      {w.subtitle}
    </p>

    <div className="writing-layout">
      <Reveal className="writing-cover-col">
        <div className="writing-book-card">
          <MediaImage src={w.coverImage} alt="Cover Buku Real Estate Rewired karya Ervan Erianto" priority/>
          <div className="writing-badge-row">
            <span className="writing-tag">OFFICIALLY LAUNCHED</span>
            <span className="writing-tag">INDEPENDENT PUBLICATION</span>
          </div>
        </div>
      </Reveal>
      <div className="writing-content-col">
        <Reveal>
          <p className="writing-lead-text">{w.lead}</p>
        </Reveal>
        <div className="writing-pillars-grid">
          {w.highlights.map((h, idx) => (
            <Reveal key={h.num} className="writing-pillar-card" delay={idx * 0.05}>
              <span className="display writing-num">{h.num}</span>
              <h4>{h.title}</h4>
              <p>{h.desc}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <blockquote className="writing-quote">
            <p>“{w.quote}”</p>
            <cite>— Ervan Erianto, Penulis 'Real Estate Rewired'</cite>
          </blockquote>
        </Reveal>
      </div>
    </div>
  </section>;
}

function SelectedMilestones() {
  const [expanded, setExpanded] = useState(false);
  const m = profile.milestonesHeading;

  return <section id="milestones" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">{m.eyebrow}</span>
      <h2 className="display">{m.title}<span className="accent">.</span></h2>
      <div className="award-total" style={{ border: '1px solid #361f22', borderRadius: '8px', padding: '18px 24px' }}>
        <span className="display" style={{ fontSize: '64px', color: '#e32b3c', letterSpacing: '-0.02em', lineHeight: 1 }}>2017</span>
        <span className="award-total-label" style={{ position: 'static', marginTop: '8px', display: 'block', fontSize: '9px', letterSpacing: '0.1em' }}>→ NOW · GROUND PRACTICE</span>
      </div>
      <p>{m.subtitle}</p>
      <a className="text-link award-proof" href="#journey">
        LIHAT JALUR PERJALANAN <ArrowDown size={18}/>
      </a>
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>TAHUN &amp; INISIATIF</span><span>FOKUS EKSEKUSI</span></div>
      <ol id="recognition-list">
        {profile.milestones.map((ms, i) => (
          <Reveal as="li" className={`recognition-row ${i > 3 ? 'additional-award' : ''}`} key={ms.year} delay={i * 0.045}>
            <span className="award-index display" style={{ fontSize: '20px', color: '#e32b3c' }}>{ms.year}</span>
            <div>
              <h3>{ms.title}</h3>
              <span style={{ fontSize: '10px', color: '#e32b3c', fontWeight: '700', textTransform: 'uppercase', display: 'block', margin: '2px 0 4px' }}>{ms.category}</span>
              <p>{ms.desc}</p>
            </div>
            <span className="award-year display">0{i + 1}</span>
          </Reveal>
        ))}
      </ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={() => setExpanded(v => !v)}>
        {expanded ? 'Ringkas milestones' : 'Lihat semua milestones (2017 → NOW)'}
        {expanded ? <Minus size={16}/> : <Plus size={16}/>}
      </button>
    </div>
  </section>;
}

function Breakdown() {
  const [cut, setCut] = useState(50);
  const containerRef = useRef(null);

  const handlePointerMove = e => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setCut((x / rect.width) * 100);
  };

  return <section id="breakdown" className="breakdown section-wrap">
    <Reveal className="breakdown-copy">
      <span className="eyebrow">{profile.breakdown.eyebrow}</span>
      <h2 className="display">{profile.breakdown.titleLines[0]}<br />{profile.breakdown.titleLines[1]}<span className="accent">.</span></h2>
      <p>{profile.breakdown.subtitle}</p>
      <span className="breakdown-credit">{profile.breakdown.credit}</span>
    </Reveal>
    <Reveal className="comparison" delay={0.15}>
      <div className="comparison-stage" ref={containerRef} style={{ '--cut': `${cut}%` }} onPointerMove={handlePointerMove} tabIndex={0} role="region" aria-label="Sebelum dan sesudah: Analisis Kelayakan dan Keputusan">
        <MediaImage src={profile.breakdown.rawImage} alt="Input awal data dan asumsi lahan" />
        <span className="comparison-label raw-label">{profile.breakdown.rawLabel}</span>
        <div className="comparison-final">
          <MediaImage src={profile.breakdown.finalImage} alt="Analisis kelayakan keputusan properti" />
          <span className="comparison-label final-label">{profile.breakdown.finalLabel}</span>
        </div>
        <div className="comparison-divider" aria-hidden="true">
          <span><ChevronLeft size={14} /><ChevronRight size={14} /></span>
        </div>
        <input type="range" min="0" max="100" value={cut} onChange={e => setCut(Number(e.target.value))} aria-label="Geser perbandingan asumsi vs analisis terstruktur" />
      </div>
      <div className="comparison-caption">
        <span>RAW / SITE DATA</span>
        <span>DRAG SLIDER</span>
        <span>DECISION LOGIC</span>
      </div>
    </Reveal>
  </section>;
}

function About() {
  return <section id="about" className="about section-wrap">
    <div className="about-grid">
      <div className="about-col">
        <Reveal className="about-lead">
          <span className="eyebrow">{profile.about.eyebrow}</span>
          <h2>{profile.about.title[0]}<br/>{profile.about.title[1]}<span className="accent">{profile.about.accentTitle}</span></h2>
          <div className="positioning-box" style={{ background: '#120f10', borderLeft: '3px solid #e32b3c', padding: '16px 20px', margin: '20px 0 24px', borderRadius: '0 4px 4px 0' }}>
            <p style={{ fontSize: '13px', color: '#f2efeb', fontWeight: '600', lineHeight: '1.7', margin: 0 }}>
              {profile.about.positioningStatement}
            </p>
          </div>
          {profile.about.paragraphs.map((p, idx) => (
            <p key={idx} style={{ marginBottom: '16px', color: '#a09c9a', lineHeight: '1.8', fontSize: '13px' }}>{p}</p>
          ))}
        </Reveal>
        <div className="skills-grid">
          <Reveal className="skills-block">
            <span className="eyebrow">METODOLOGI EKSEKUSI (5-TAHAP)</span>
            <div className="process-list">
              {profile.process.map(([step, name, desc]) => (
                <div className="process-row" key={step}>
                  <span className="process-step display">{step}</span>
                  <div>
                    <h4>{name}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal className="quote-panel">
        <span className="quote-mark display">“</span>
        <blockquote>{profile.about.quoteLines[0]}<br/>{profile.about.quoteLines[1]}<br/><em>{profile.about.quoteLines[2]}</em></blockquote>
        <span className="handwriting">{profile.about.quoteSign}</span>
        <div className="quote-bottom">{profile.about.quoteBottom.split('\n')[0]}<br/>{profile.about.quoteBottom.split('\n')[1]}<span className="quote-symbol" aria-hidden="true">✳</span></div>
      </Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="journey" className="journey section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">06 / THE JOURNEY</span>
        <h2>A JOURNEY IN BUILDING<span className="accent">.</span></h2>
      </div>
      <span className="eyebrow" style={{ color: '#a09c9a' }}>2017 → PRESENT</span>
    </Reveal>
    <div className="journey-grid">
      <div className="experience-list">
        {profile.journey.map((job, i) => (
          <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.area}>
            <button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              <span className="experience-date">{job.index}</span>
              <span><h3>{job.area}</h3><span className="experience-place">{job.tagline}</span></span>
              {open === i ? <Minus size={18}/> : <Plus size={18}/>}
            </button>
            <AnimatePresence initial={false}>
              {open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                <p>{job.text}</p>
              </motion.div>}
            </AnimatePresence>
          </Reveal>
        ))}
      </div>
      <Reveal className="awards-panel">
        <p className="eyebrow">SUBSTANTIVE OUTPUTS</p>
        <h3 className="display">PRODUK &amp;<br/><span className="accent">KERANGKA KERJA.</span></h3>
        <div className="award-list">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minHeight: '68px', borderTop: '1px solid var(--line)', padding: '12px 0' }}>
            <span style={{ color: '#e32b3c', fontSize: '11px', fontWeight: '700' }}>01</span>
            <div>
              <strong style={{ fontSize: '12px', display: 'block', color: '#f2efeb' }}>REAL ESTATE REWIRED (BOOK)</strong>
              <span style={{ fontSize: '10px', color: '#a09c9a' }}>Officially Published &amp; Independently Released Book</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minHeight: '68px', borderTop: '1px solid var(--line)', padding: '12px 0' }}>
            <span style={{ color: '#e32b3c', fontSize: '11px', fontWeight: '700' }}>02</span>
            <div>
              <strong style={{ fontSize: '12px', display: 'block', color: '#f2efeb' }}>REWIRED DEVELOPER MAP</strong>
              <span style={{ fontSize: '10px', color: '#a09c9a' }}>FILTER → LOCK → BLUEPRINT → TEAM → REVENUE → DELIVERY</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minHeight: '68px', borderTop: '1px solid var(--line)', padding: '12px 0' }}>
            <span style={{ color: '#e32b3c', fontSize: '11px', fontWeight: '700' }}>03</span>
            <div>
              <strong style={{ fontSize: '12px', display: 'block', color: '#f2efeb' }}>PROJECT CONTROL DISCIPLINE</strong>
              <span style={{ fontSize: '10px', color: '#a09c9a' }}>Scope, Cost, Schedule, Quality &amp; Documented Change</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>;
}

function Contact({ onProject }) {
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid">
      <Reveal className="contact-intro">
        <span className="eyebrow">{profile.contact.eyebrow}</span>
        <h2 className="display">{profile.contact.headline.split(' ')[0]} {profile.contact.headline.split(' ')[1]}<br/>{profile.contact.headline.split(' ').slice(2).join(' ')}<span className="accent">.</span></h2>
        <p>{profile.contact.text}</p>
        <Magnetic href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-cta">
          <span className="round-arrow"><Linkedin size={20}/></span>{profile.contact.cta}
        </Magnetic>
      </Reveal>
      <Reveal className="contact-links" delay={0.1}>
        <a href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
          <Linkedin/><span><small>LINKEDIN RESMI</small>linkedin.com/in/ervan-erianto</span><ArrowUpRight size={16}/>
        </a>
        <div>
          <Globe/><span><small>DISIPLIN UTAMA</small>Real Estate Developer · Founder · Author</span>
        </div>
        <div>
          <MapPin/><span><small>LOKASI OPERASIONAL</small>{profile.contact.location}</span>
        </div>
      </Reveal>
      <Reveal className="contact-reel" delay={0.2}>
        <button onClick={() => onProject(initiatives[0])} aria-label="Lihat inisiatif Dirham Land & Real Estate Development">
          <div className="reel-screen">
            <span className="reel-screen-top">{profile.wordmark}<span>THE PRACTICE</span></span>
            <MediaImage src="./Asset/img/initiatives/dirham-land.svg" alt="Real Estate Development Dirham Land"/>
            <span className="reel-screen-title display">REAL ESTATE<br/><span>DEVELOPER.</span></span>
            <span className="play-circle"><ArrowUpRight size={18} /></span>
          </div>
          <span className="reel-caption">DIRHAM LAND &amp; RESIDENTIAL PRACTICE</span>
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
          {project.role && <span className="accent" style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{project.role}</span>}
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#b9b5b2' }}>{project.description}</p>
          {project.tags && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
              {project.tags.map(t => (
                <span key={t} style={{ background: '#181516', border: '1px solid #333', padding: '3px 8px', fontSize: '10px', borderRadius: '3px', color: '#bbb' }}>{t}</span>
              ))}
            </div>
          )}
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
        <Hero onProject={p => setProject(p)}/>
        <Portfolio onProject={p => setProject(p)}/>
        <Writing/>
        <SelectedMilestones/>
        <Breakdown/>
        <About/>
        <Journey onProject={p => setProject(p)}/>
        <Contact onProject={p => setProject(p)}/>
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
