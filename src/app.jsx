import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Linkedin, Globe, MapPin, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import initiatives from './data/initiatives.js';
import brands from './data/brands.json';
import { profile } from './data/profile.js';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = profile.categories;
const featured = initiatives.filter(i => i.featured);

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
    {state === 'error' && <span className="image-fallback"><span className="display">E.</span><span>Visual Karya</span></span>}
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
        <a href="#portfolio">KARYA</a>
        <a href="#about">TENTANG</a>
        <a href="#principles">PENDEKATAN</a>
        <a href="#journey">PERJALANAN</a>
        <a href="#contact">KONTAK</a>
      </nav>
      <div className="header-actions">
        <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled} aria-label="Toggle animasi"><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
        <Magnetic href="#journey" className="cv-pill" aria-label="Lihat perjalanan Ervan Erianto"><span>PERJALANAN</span></Magnetic>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
    <AnimatePresence>
      {open && <motion.nav className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ ease: EASE, duration: 0.35 }}>
        <a href="#portfolio" onClick={() => setOpen(false)}>KARYA <ArrowUpRight size={18}/></a>
        <a href="#about" onClick={() => setOpen(false)}>TENTANG <ArrowUpRight size={18}/></a>
        <a href="#principles" onClick={() => setOpen(false)}>PENDEKATAN <ArrowUpRight size={18}/></a>
        <a href="#journey" onClick={() => setOpen(false)}>PERJALANAN <ArrowUpRight size={18}/></a>
        <a href="#contact" onClick={() => setOpen(false)}>KONTAK <ArrowUpRight size={18}/></a>
        <div className="mobile-menu-footer">
          <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled}><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
          <a href="#journey" onClick={() => setOpen(false)} className="cv-pill"><span>LIHAT PERJALANAN</span></a>
        </div>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);

  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top">
      <span>{profile.topline[0]}<br/><span className="muted">{profile.topline[1]}</span></span>
      <span className="availability"><i />BASED IN {profile.location.toUpperCase()}</span>
    </div>

    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>
      {profile.heroDisplayWord}
    </motion.div>

    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
      <img src={profile.portrait} alt={profile.portraitAlt} width="1024" height="1536" fetchPriority="high" />
    </motion.div>

    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p>
      <h1 className="display">{profile.name}<span>.</span></h1>
      <p className="hero-role">{profile.roleLines[0]}<br />{profile.roleLines[1]}</p>
      <p className="hero-description">{profile.subheadline}</p>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Magnetic href="#portfolio" className="primary-link">Jelajahi Karya <ArrowDown size={17}/></Magnetic>
        <a href="#about" style={{ fontSize: '11px', color: '#a09c9a', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: '4px' }}>Cara Berpikir →</a>
      </div>
      <span className="hero-location"><MapPin size={12} /> {profile.location}</span>
    </motion.div>

    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto">
        <span className="crosshair" aria-hidden="true">✳</span>
        <p>{profile.manifesto[0]}<br />{profile.manifesto[1]}</p>
      </div>
      <div className="hero-stats">
        {profile.pillars.map((pillar, idx) => (
          <div key={pillar.code}>
            <span className="display">0{idx + 1}</span>
            <p><strong>{pillar.code}</strong><br/>{pillar.tag}<br/><span style={{ fontSize: '8px', color: '#888' }}>{pillar.label}</span></p>
          </div>
        ))}
        <a href="#journey" style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '44px', fontSize: '9px', color: '#e32b3c' }}>
          <ArrowDown size={14}/><span>{profile.timelineLabel} · PROYEK &amp; PRAKTIK</span>
        </a>
      </div>
    </motion.div>

    <div className="hero-bottom">
      <button className="reel-button" onClick={() => onProject(featured[0])}>
        <span className="play-circle"><Compass size={13} /></span>
        EXPLORE INITIATIVES
        <span className="muted">ARKAVENA &amp; REWIRED</span>
      </button>
      <span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span>
      <span className="edition">SELECTED WORK &amp; PRACTICES / 2026</span>
    </div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: enabled ? 0.45 : 0, delay: (index % 3) * 0.04, ease: EASE }} exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat ${project.title}`}>
      <motion.div className="project-picture" style={enabled ? { y } : {}}>
        <MediaImage src={project.image} alt={project.title}/>
      </motion.div>
      <span className="project-type">{project.category.toUpperCase()}</span>
      <span className="project-hover"><ArrowUpRight size={22}/></span>
      <span className="project-frame" aria-hidden="true" />
    </button>
    <button className="project-caption" onClick={() => onOpen(project)}>
      <span className="project-category">{project.category} · {project.evidenceLabel || project.status}</span>
      <h3>{project.title}</h3>
      <span className="project-more">PENJELASAN <ArrowUpRight size={14}/></span>
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
      <p>INITIATIVES &amp; PRACTICE DISCIPLINES<br/><strong>ARKAVENA · REWIRED · DIRHAM LAND · SYSTEMS R&amp;D</strong></p>
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
      (category === 'Inisiatif' && p.type === 'initiative') ||
      p.category === category;
    const searchStr = `${p.title} ${p.category} ${p.role || ''} ${p.summary || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    const matchesQuery = searchStr.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const projects = results.slice(0, expanded ? results.length : limit);

  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">{profile.portfolioHeading.eyebrow}</span>
        <h2>{profile.portfolioHeading.headline}<span className="accent">.</span></h2>
      </div>
      <button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); } }}>
        {expanded ? 'KARYA UTAMA' : 'SEMUA BIDANG'}
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
        <input aria-label="Cari inisiatif atau bidang praktik" type="search" placeholder="Inisiatif, bidang, atau kata kunci…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); }}/>
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

function Principles() {
  const [expanded, setExpanded] = useState(false);

  return <section id="principles" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">{profile.thinkingHeading.eyebrow}</span>
      <h2 className="display">{profile.thinkingHeading.title}<span className="accent">.</span></h2>
      <div className="award-total" style={{ border: '1px solid #361f22', borderRadius: '8px', padding: '18px 24px' }}>
        <span className="display" style={{ fontSize: '72px', color: '#e32b3c', letterSpacing: '-0.02em', lineHeight: 1 }}>{profile.thinkingHeading.displayWord}</span>
        <span className="award-total-label" style={{ position: 'static', marginTop: '8px', display: 'block', fontSize: '9px', letterSpacing: '0.1em' }}>EVIDENCE &amp; GOVERNANCE</span>
      </div>
      <p>{profile.thinkingHeading.subtitle}</p>
      <a className="text-link award-proof" href="#about">
        CARA SAYA BERPIKIR<ArrowDown size={18}/>
      </a>
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>EVIDENCE-BASED PILLARS</span><span>DISIPLIN &amp; PRAKTIK</span></div>
      <ol id="recognition-list">
        {profile.thinkingPillars.map((pr, i) => (
          <Reveal as="li" className={`recognition-row ${i > 2 ? 'additional-award' : ''}`} key={pr.index} delay={i * 0.045}>
            <span className="award-index">{pr.index}</span>
            <div>
              <h3>{pr.title}</h3>
              <span style={{ fontSize: '10px', color: '#e32b3c', fontWeight: '700', textTransform: 'uppercase', display: 'block', margin: '2px 0 4px' }}>{pr.subtitle}</span>
              <p>{pr.desc}</p>
            </div>
            <span className="award-year display">0{i + 1}</span>
          </Reveal>
        ))}
      </ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={() => setExpanded(v => !v)}>
        {expanded ? 'Ringkas pilar' : 'Lihat semua pilar'}
        {expanded ? <Minus size={16}/> : <Plus size={16}/>}
      </button>
    </div>
  </section>;
}

function Breakdown() {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(52);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(85 - v * 70)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title">
    <Reveal className="breakdown-copy">
      <span className="eyebrow">{profile.breakdown.eyebrow}</span>
      <motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>
        {profile.breakdown.titleLines[0]}<br/><span className="accent">{profile.breakdown.titleLines[1]}</span>
      </motion.h2>
      <p>{profile.breakdown.subtitle} Mengubah kumpulan asumsi, peta masalah, dan data mentah menjadi analisis kelayakan yang terstruktur.</p>
      <span className="breakdown-credit">{profile.breakdown.credit}</span>
    </Reveal>
    <Reveal className="comparison">
      <div className="comparison-stage" style={{ '--cut': `${enabled || manual ? cut : 50}%` }}>
        <MediaImage src={profile.breakdown.rawImage} alt="Idea dan raw input peta masalah"/>
        <div className="comparison-final">
          <MediaImage src={profile.breakdown.finalImage} alt="Structured analysis dan keputusan teruji"/>
        </div>
        <span className="comparison-label raw-label">{profile.breakdown.rawLabel}</span>
        <span className="comparison-label final-label">{profile.breakdown.finalLabel}</span>
        <div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div>
        <input aria-label="Perbandingan asumsi dan analisis terstruktur" aria-valuetext={`${cut}% ide mentah, ${100-cut}% analisis terstruktur`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/>
      </div>
      <div className="comparison-caption"><span>GESER UNTUK MELIHAT INTEGRASI ANALISIS</span><span>DRAG / SCROLL</span></div>
    </Reveal>
  </section>;
}

function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });

  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead">
      <div>
        <span className="eyebrow">{profile.about.eyebrow}</span>
        <h2 className="display">{profile.about.title[0]}<br/>{profile.about.title[1]}<span className="accent">{profile.about.accentTitle}</span></h2>
      </div>
      <div>
        {profile.about.paragraphs.map((p, idx) => (
          <p key={idx} style={{ marginBottom: '14px', fontSize: '13px', lineHeight: '1.8', color: '#b9b5b2' }}>{p}</p>
        ))}
      </div>
    </Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel">
        <h3 className="panel-heading">FIELDS OF PRACTICE</h3>
        <p className="eyebrow accent">FOKUS DISIPLIN</p>
        {profile.fieldsOfPractice.map(f => (
          <div className="education-row" key={f.title}>
            <strong>{f.title}</strong>
            <p>{f.desc}</p>
          </div>
        ))}
        <p className="eyebrow accent skills-heading">STRATEGIC TOOLKIT</p>
        <div className="skill-tags">
          {profile.capabilities.map(s => <span key={s}>{s}</span>)}
        </div>
      </Reveal>
      <div className="process-panel">
        <Reveal><h3 className="panel-heading">KEJELASAN SEBELUM KOMPLEKSITAS</h3></Reveal>
        <div className="process-list">
          <div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>
          {profile.process.map(([num, title, text], i) => (
            <Reveal key={num} className="process-row" delay={i * 0.035}>
              <span className="process-num display">{num}</span>
              <span className="process-node"/>
              <div><h4>{title}</h4><p>{text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="quote-panel">
        <span className="quote-mark display">“</span>
        <blockquote>{profile.about.quoteLines[0]}<br/>{profile.about.quoteLines[1]}<br/>{profile.about.quoteLines[2]}<br/><em>{profile.about.quoteLines[3]}</em></blockquote>
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
        <span className="eyebrow">04 / THE JOURNEY</span>
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
          {profile.substantiveOutputs.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: '14px', alignItems: 'center', minHeight: '68px', borderTop: '1px solid var(--line)', padding: '12px 0' }}>
              <span style={{ color: '#e32b3c', fontSize: '11px', fontWeight: '700' }}>{item.num}</span>
              <div>
                <strong style={{ fontSize: '12px', display: 'block', color: '#f2efeb' }}>{item.title}</strong>
                <span style={{ fontSize: '10px', color: '#a09c9a' }}>{item.detail}</span>
              </div>
            </div>
          ))}
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
          <Globe/><span><small>DISIPLIN</small>Property · Business · Systems</span>
        </div>
        <div>
          <MapPin/><span><small>LOKASI</small>{profile.contact.location}</span>
        </div>
      </Reveal>
      <Reveal className="contact-reel" delay={0.2}>
        <button onClick={() => onProject(featured[0])} aria-label="Lihat inisiatif Arkavena">
          <div className="reel-screen">
            <span className="reel-screen-top">{profile.wordmark}<span>FEATURED INITIATIVE</span></span>
            <MediaImage src="./Asset/img/initiatives/arkavena.svg" alt="Arkavena Project Control"/>
            <span className="reel-screen-title display">BUILD WITH<br/><span>CLARITY.</span></span>
            <span className="play-circle"><ArrowUpRight size={18} /></span>
          </div>
          <span className="reel-caption">ARKAVENA · PROJECT CONTROL PERSPECTIVE</span>
        </button>
      </Reveal>
    </div>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const enabled = useContext(MotionContext);

  useEffect(() => {
    const handleKeyDown = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const sourceUrl = project.externalUrl || profile.contact.linkedinUrl;

  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <motion.div className="dialog-window project-dialog" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading">
        <span className="eyebrow">{project.category} · {project.evidenceLabel || project.status}</span>
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
            {project.externalUrl ? 'Kunjungi Inisiatif' : 'Hubungi via LinkedIn'}
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
    setMotionOn(!motionOn);
    try { localStorage.setItem('ervan-motion', motionOn ? 'off' : 'on'); } catch {}
  };
  const close = React.useCallback(() => setProject(null), []);

  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <Principles/>
        <Breakdown/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">{profile.footer.wordmark}<span>®</span></a>
        <span>© {profile.footer.copyrightYear} {profile.footer.wordmark}. {profile.footer.signOff}</span>
        <div>
          <a href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Ervan Erianto"><Linkedin size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.id || project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
