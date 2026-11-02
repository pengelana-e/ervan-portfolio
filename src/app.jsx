import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Youtube, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import { profile } from './data/profile.js';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['Semua', 'VFX', 'Film', '3D', 'Commercial', 'Photography', 'Visual', 'Manipulation', 'Websites'];
const featured = profile.featuredKeys.map(key => archive.find(p => p.media === key || p.title === key)).filter(Boolean);

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">{profile.wordmark[0]}.</span><span>Pratinjau tidak tersedia</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
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
  return <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner">
      <a className="wordmark" href="#home" aria-label={`${profile.name}, beranda`}>{profile.wordmark}<span>®</span></a>
      <nav className="nav-desktop">
        <a href="#portfolio">KARYA</a>
        <a href="#about">TENTANG</a>
        <a href="#experience">PERJALANAN</a>
        <a href="#contact">KONTAK</a>
      </nav>
      <div className="header-actions">
        <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled} aria-label="Toggle animasi"><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
        <Magnetic href={profile.cv} download className="cv-pill" aria-label="Unduh Resume"><Download size={14}/><span>RESUME</span></Magnetic>
        <button className="menu-burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
    <AnimatePresence>
      {open && <motion.nav className="nav-mobile" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ ease: EASE, duration: 0.35 }}>
        <a href="#portfolio" onClick={() => setOpen(false)}>KARYA</a>
        <a href="#about" onClick={() => setOpen(false)}>TENTANG</a>
        <a href="#experience" onClick={() => setOpen(false)}>PERJALANAN</a>
        <a href="#contact" onClick={() => setOpen(false)}>KONTAK</a>
        <div className="nav-mobile-footer">
          <button onClick={onToggle} className="motion-toggle" aria-pressed={enabled}><span className="motion-dot"/>MOTION {enabled ? 'ON' : 'OFF'}</button>
          <a href={profile.cv} download className="cv-pill"><Download size={14}/><span>RESUME</span></a>
        </div>
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top">
      <span>{profile.topline[0]}</span>
      <span className="hero-manifesto">{profile.manifesto[0]}<br/>{profile.manifesto[1]}</span>
      <span>{profile.topline[1]}</span>
    </div>
    <motion.h2 className="hero-title display" style={enabled ? { y: titleY } : {}}>PORTFOLIO</motion.h2>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}>
      <img src={profile.portrait} alt={profile.portraitAlt} width="1024" height="1536" fetchPriority="high" />
    </motion.div>
    <div className="hero-intro">
      <p className="handwriting">{profile.tagline}</p>
      <h1>{profile.roleLines[0]}<br/><span>{profile.roleLines[1]}</span></h1>
      <p className="hero-description">{profile.intro}</p>
      <div className="hero-cta-group">
        <Magnetic href="#portfolio" className="hero-cta"><ArrowDown size={17}/><span>JELAJAHI KARYA</span></Magnetic>
      </div>
      <div className="hero-location"><MapPin size={12}/><span>BASED IN {profile.location}</span></div>
    </div>
    <div className="hero-stats">
      {profile.stats.map((s, idx) => (
        <div key={idx} className={s.linksTo ? 'hero-award-stat' : ''}>
          <span className="display">{s.value}<span>{s.suffix || '+'}</span></span>
          {s.linksTo ? (
            <a href={s.linksTo} aria-label={s.label.join(' ')}>{s.label[0]}<br/>{s.label[1]}<ArrowUpRight size={12}/></a>
          ) : (
            <p>{s.label[0]}<br/>{s.label[1]}</p>
          )}
        </div>
      ))}
      <a href={profile.cv} download><Download size={16}/><span>DOWNLOAD CV</span></a>
    </div>
  </section>;
}

function ProjectCard({ project, onClick, index = 0 }) {
  const isVideo = project.type === 'youtube' || project.type === 'drive';
  return <Reveal className="project-card" delay={index * 0.04}>
    <button onClick={onClick} aria-label={`Buka detail ${project.title}`}>
      <div className="card-thumb">
        <MediaImage src={project.image} alt={project.title} />
        <span className="card-badge">{project.category}</span>
        {isVideo && <span className="play-badge"><Play size={14} fill="currentColor"/></span>}
      </div>
      <div className="card-info">
        <div className="card-title-row">
          <h3>{project.title}</h3>
          <ArrowUpRight size={18} className="card-arrow"/>
        </div>
        <p className="card-role">{project.role || project.category} {project.year && `· ${project.year}`}</p>
      </div>
    </button>
  </Reveal>;
}

function BrandStrip() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const x = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredBrand, setHoveredBrand] = useState(null);

  useAnimationFrame((time, delta) => {
    if (isPaused || !trackRef.current) return;
    const speed = 0.04;
    x.current -= delta * speed;
    const halfWidth = trackRef.current.scrollWidth / 2;
    if (Math.abs(x.current) >= halfWidth) {
      x.current += halfWidth;
    }
    trackRef.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
  });

  return <section className="brand-strip-wrap" aria-label="Studio and Brand Collaborations">
    <div className="brand-strip-header">
      <span className="eyebrow">STUDIO & BRAND COLLABORATORS</span>
      <span className="brand-strip-sub">SELECTED PARTNERS & PRODUCTION TEAMS</span>
    </div>
    <div className="brand-strip" ref={containerRef} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => { setIsPaused(false); setHoveredBrand(null); }}>
      <div className="brand-track" ref={trackRef}>
        {[...brands, ...brands].map((b, i) => (
          <div key={i} className="brand-item" onMouseEnter={() => setHoveredBrand(b.name)}>
            <img src={`./Asset/svg/brand/${b.file}`} alt={b.name} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <div className="brand-caption-row" aria-live="polite">
      <span>{hoveredBrand ? `PARTNER: ${hoveredBrand.toUpperCase()}` : 'DIARAHKAN UNTUK PRODUKSI DAN TAYANGAN BERKUALITAS'}</span>
      <button className="strip-pause-btn" onClick={() => setIsPaused(!isPaused)} aria-label={isPaused ? 'Lanjutkan scroll' : 'Jeda scroll'}>
        {isPaused ? <Play size={12}/> : <Pause size={12}/>}
      </button>
    </div>
  </section>;
}

function Portfolio({ onProject }) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = archive.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.role && p.role.toLowerCase().includes(search.toLowerCase())) || (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const visibleProjects = filtered.slice(0, visibleCount);

  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">01 / SELECTED WORK</span>
        <h2>KARYA UNGGULAN & EKSPLORASI<span className="accent">.</span></h2>
      </div>
      <p className="section-lead">Pilihan film, CGI, visual effects, dan eksperimen yang dirancang dengan presisi.</p>
    </Reveal>

    <div className="featured-grid">
      {featured.map((p, i) => (
        <ProjectCard key={p.title} project={p} onClick={() => onProject(p)} index={i} />
      ))}
    </div>

    <BrandStrip />

    <div className="archive-controls">
      <div className="category-filters" role="tablist" aria-label="Filter kategori portfolio">
        {categories.map(cat => (
          <button key={cat} role="tab" aria-selected={activeCategory === cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => { setActiveCategory(cat); setVisibleCount(9); }}>
            {cat}
            {activeCategory === cat && <motion.span layoutId="filterUnderline" className="filter-underline" transition={{ duration: 0.3, ease: EASE }}/>}
          </button>
        ))}
      </div>
      <div className="search-wrap">
        <Search size={16} className="search-icon"/>
        <input type="search" placeholder="Cari karya..." value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(9); }} aria-label="Cari portfolio"/>
      </div>
    </div>

    <div className="archive-grid">
      {visibleProjects.map((p, i) => (
        <ProjectCard key={`${p.title}-${i}`} project={p} onClick={() => onProject(p)} index={i % 6} />
      ))}
    </div>

    {visibleProjects.length === 0 && (
      <div className="empty-state">
        <p>Tidak ada proyek yang sesuai dengan kriteria pencarian.</p>
        <button className="outline-button" onClick={() => { setActiveCategory('Semua'); setSearch(''); }}>Reset Filter</button>
      </div>
    )}

    {visibleCount < filtered.length && (
      <div className="load-more-wrap">
        <button className="outline-button load-more-btn" onClick={() => setVisibleCount(v => v + 9)}>
          MUAT LEBIH BANYAK ({filtered.length - visibleCount} LAGI)
        </button>
      </div>
    )}
  </section>;
}

function Awards({ onProject }) {
  const [expanded, setExpanded] = useState(false);
  const laurelPath = 'M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z';
  
  if (!profile.showAwards) return null;

  return <section id="awards" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">RECOGNITION & AWARDS</span>
      <h2 className="display">THE WORK.<br/><span className="accent">THE RECOGNITION.</span></h2>
      <div className="award-total">
        <svg viewBox="0 0 60 100" aria-hidden="true"><path d={laurelPath} fill="currentColor"/></svg>
        <span className="display">10<span>+</span></span>
        <svg viewBox="0 0 60 100" aria-hidden="true"><g transform="translate(60 0) scale(-1 1)"><path d={laurelPath} fill="currentColor"/></g></svg>
        <span className="award-total-label">AWARDS WON</span>
      </div>
      <p>Karya yang dibuat dengan visi penuh rasa.<br/>Penghargaan dan sertifikasi dari eksplorasi sinematik.</p>
      {profile.certificates.length > 0 && (
        <button className="text-link award-proof" onClick={() => onProject({ ...profile.certificates[0], type: 'image', media: profile.certificates[0].image, category: 'Award', description: profile.certificates[0].description })}>
          LIHAT SERTIFIKAT<ArrowUpRight size={18}/>
        </button>
      )}
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>SELECTED RECOGNITION</span><span>2020 – 2025</span></div>
      <ol id="recognition-list">
        {profile.awards.map((award, i) => (
          <Reveal as="li" className={`recognition-row ${i > 2 ? 'additional-award' : ''}`} key={`${award.year}-${i}`} delay={i * 0.045}>
            <span className="award-index">0{i + 1}</span>
            <div><h3>{award.title}</h3><p>{award.event}</p></div>
            <span className="award-year display">{award.year}</span>
          </Reveal>
        ))}
      </ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={() => setExpanded(v => !v)}>
        {expanded ? 'Ringkas penghargaan' : 'Lihat penghargaan lainnya'}
        {expanded ? <Minus size={16}/> : <Plus size={16}/>}
      </button>
    </div>
  </section>;
}

function Breakdown() {
  const scene = featured.find(p => p.type === 'render');
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title">
    <Reveal className="breakdown-copy">
      <span className="eyebrow">A LOOK UNDER THE SURFACE</span>
      <motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>FROM RAW.<br/><span className="accent">TO REAL.</span></motion.h2>
      <p>Satu scene. Berlapis proses.<br/>Lihat bagaimana sebuah 3D environment berubah dari bentuk dasar menjadi dunia yang hidup.</p>
      <span className="breakdown-credit">CYBERPUNK ENVIRONMENT / 2025<br/>3D ARTIST · LIGHTING · RENDERING</span>
    </Reveal>
    <Reveal className="comparison">
      <div className="comparison-stage" style={{ '--cut': `${enabled || manual ? cut : 50}%` }}>
        <MediaImage src={resize(scene.renders[0].solid)} alt="Cyberpunk environment sebelum material dan pencahayaan"/>
        <div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="Cyberpunk environment hasil render akhir"/></div>
        <span className="comparison-label raw-label">SOLID VIEW</span>
        <span className="comparison-label final-label">FINAL RENDER</span>
        <div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div>
        <input aria-label="Perbandingan sebelum dan sesudah render" aria-valuetext={`${cut}% solid, ${100-cut}% final render`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/>
      </div>
      <div className="comparison-caption"><span>GESER UNTUK MELIHAT PROSESNYA</span><span>DRAG / SCROLL</span></div>
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
      <p>{profile.about.bio}</p>
    </Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel">
        <h3 className="panel-heading">EDUCATION & SKILLS</h3>
        <p className="eyebrow accent">PENDIDIKAN</p>
        {profile.education.map((edu, idx) => (
          <div key={idx} className="education-row">
            <strong>{edu.title}</strong>
            {edu.meta && <span>{edu.meta}</span>}
            {edu.text && <p>{edu.text}</p>}
          </div>
        ))}
        <p className="eyebrow accent skills-heading">CREATIVE TOOLKIT</p>
        <div className="skill-tags">
          {profile.skills.map(s => <span key={s}>{s}</span>)}
        </div>
        <div className="software-row">
          {profile.software.map(([file, name]) => (
            <img key={file} src={`./Asset/svg/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>
          ))}
        </div>
      </Reveal>
      <div className="process-panel">
        <Reveal><h3 className="panel-heading">FROM IDEA TO FINAL FRAME</h3></Reveal>
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
        <blockquote>{profile.about.quoteLines[0]}<br/>{profile.about.quoteLines[1]}<br/><em>{profile.about.quoteLines[2]}<br/>{profile.about.quoteLines[3]}</em></blockquote>
        <span className="handwriting">{profile.about.quoteSign}</span>
        <div className="quote-bottom">{profile.about.quoteBottom.split('\n')[0]}<br/>{profile.about.quoteBottom.split('\n')[1]}<span className="quote-symbol" aria-hidden="true">✳</span></div>
      </Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">03 / THE JOURNEY</span>
        <h2>TERUS BERGERAK. TERUS BERKARYA<span className="accent">.</span></h2>
      </div>
      <a className="text-link" href={profile.cv} download>RESUME<Download size={16}/></a>
    </Reveal>
    <div className="journey-grid">
      <div className="experience-list">
        {profile.experiences.map((job, i) => (
          <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}>
            <button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}>
              <span className="experience-date">{job.date}</span>
              <span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>
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
        <p className="eyebrow">A FEW MILESTONES</p>
        <h3 className="display">LITTLE WINS.<br/><span className="accent">BIG MEANING.</span></h3>
        <div className="award-list">
          {profile.certificates.map((cert, i) => (
            <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: 'Certificate', description: cert.description })}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{cert.title}<small>{cert.year}</small></span>
              <ArrowUpRight size={19}/>
            </button>
          ))}
        </div>
      </Reveal>
    </div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `${profile.contact.greeting}, saya ${data.get('name')}.\n\nJenis proyek: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/${profile.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid">
      <Reveal className="contact-intro">
        <span className="eyebrow">04 / YOUR NEXT STORY</span>
        <h2 className="display">LET’S WORK<br/>TOGETHER<span className="accent">.</span></h2>
        <p>Punya cerita yang ingin diwujudkan?<br/>Mari buat sesuatu yang layak ditonton.</p>
        <Magnetic href={`https://wa.me/${profile.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact-cta">
          <span className="round-arrow"><ArrowUpRight size={21}/></span>MULAI PERCAKAPAN
        </Magnetic>
      </Reveal>
      <Reveal className="contact-links" delay={0.1}>
        <a href={`mailto:${profile.contact.email}`}><Mail/><span><small>EMAIL</small>{profile.contact.email}</span><ArrowUpRight size={16}/></a>
        <a href={profile.contact.instagram.url} target="_blank" rel="noopener noreferrer"><Instagram/><span><small>INSTAGRAM</small>{profile.contact.instagram.handle}</span><ArrowUpRight size={16}/></a>
        <a href={`tel:${profile.contact.phoneDisplay}`}><Phone/><span><small>PHONE / WHATSAPP</small>{profile.contact.phoneDisplay}</span><ArrowUpRight size={16}/></a>
        <div><MapPin/><span><small>BASED IN</small>{profile.contact.basedIn}</span></div>
      </Reveal>
      <Reveal className="contact-reel" delay={0.2}>
        <button onClick={() => onProject(featured[0])} aria-label={`Putar showreel ${profile.wordmark}`}>
          <div className="reel-screen">
            <span className="reel-screen-top">{profile.wordmark}®<span>VFX / SHOWREEL</span></span>
            <MediaImage src={featured[0]?.image} alt={`Showreel ${profile.wordmark}`}/>
            <span className="reel-screen-title display">MAKE IT<br/><span>FEEL REAL.</span></span>
            <span className="play-circle"><Play size={18} fill="currentColor"/></span>
          </div>
          <span className="reel-caption">PRESS PLAY. ENTER MY WORLD.</span>
        </button>
      </Reveal>
    </div>
    <Reveal>
      <details className="project-brief">
        <summary>Ceritakan proyek Anda <Plus size={19}/></summary>
        <form onSubmit={send}>
          <label>Nama Anda<input name="name" required placeholder="Nama atau brand" autoComplete="name" maxLength="100"/></label>
          <label>Jenis proyek
            <select name="type">
              <option>Film & Video Editing</option>
              <option>VFX & CGI</option>
              <option>3D & Compositing</option>
              <option>Commercial Content</option>
              <option>Photography</option>
              <option>Website</option>
              <option>Kolaborasi lainnya</option>
            </select>
          </label>
          <label className="brief-message">Tentang proyek
            <textarea name="message" required rows="3" placeholder="Ceritakan ide, kebutuhan, dan perkiraan waktunya…" maxLength="3000"/>
          </label>
          <button className="solid-button" type="submit">Lanjut ke WhatsApp <ArrowUpRight size={18}/></button>
          <p className="form-note" role="status">{sent ? 'Draft pesan siap di WhatsApp. Tekan Kirim di sana untuk memulai percakapan.' : 'Brief akan dibuka sebagai draft pesan di WhatsApp.'}</p>
        </form>
      </details>
    </Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const enabled = useContext(MotionContext);
  const [shot, setShot] = useState(0);
  const [renderMode, setRenderMode] = useState(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);

  useEffect(() => {
    const handleKeyDown = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isVideo = project.type === 'youtube' || project.type === 'drive';
  const embedType = project.type;
  const embedMedia = project.media;

  const currentRender = project.renders?.[shot];
  const availableModes = currentRender ? Object.entries(currentRender).filter(([_, url]) => Boolean(url)) : [];
  const effectiveMode = renderMode || availableModes[availableModes.length - 1]?.[0] || 'final';
  const rendered = currentRender?.[effectiveMode] || project.image || project.media;

  const sourceUrl = project.type === 'youtube' ? `https://www.youtube.com/watch?v=${project.media}` : project.type === 'website' ? project.media : null;

  const changeShot = nextShot => {
    setShot(nextShot);
    const nextRender = project.renders?.[nextShot];
    if (nextRender && !nextRender[effectiveMode]) {
      const fallback = Object.keys(nextRender)[0];
      setRenderMode(fallback);
    }
  };

  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <motion.div className="dialog-window" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading">
        <span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span>
        <button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button>
      </div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? (
          <>
            {!mediaLoaded && (
              <div className="media-loading" role="status">
                {mediaFailed ? (
                  <>
                    <p>Preview belum bisa dimuat. Buka sumber aslinya untuk menonton.</p>
                    <button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button>
                  </>
                ) : (
                  <>
                    <span className={enabled ? 'loading-ring' : 'loading-ring paused'}/>
                    <p>Memuat film…</p>
                  </>
                )}
              </div>
            )}
            <iframe
              key={`${embedMedia}-${retried}`}
              src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`}
              title={project.title}
              width="1280"
              height="720"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }}
              onError={() => setMediaFailed(true)}
            />
          </>
        ) : (
          <MediaImage src={rendered} alt={project.title} priority/>
        )}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && (
        <div className="render-controls">
          <div role="group" aria-label="Tahap render">
            {availableModes.map(([mode, label]) => (
              <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
          {project.renders.length > 1 && (
            <div className="shot-controls">
              <button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button>
              <span>SHOT {shot + 1} / {project.renders.length}</span>
              <button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button>
            </div>
          )}
        </div>
      )}
      <div className="dialog-description">
        <div>
          <h2 id="dialog-title">{project.title}</h2>
          {project.role && <span className="accent">{project.role}</span>}
          <p>{project.description}</p>
        </div>
        {sourceUrl && (
          <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">
            {project.type === 'website' ? 'Kunjungi website' : 'Buka sumber asli'}
            <ExternalLink size={15}/>
          </a>
        )}
      </div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Buka sumber asli”.</p>}
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('portfolio-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => {
    setMotionOn(!motionOn);
    try { localStorage.setItem('portfolio-motion', motionOn ? 'off' : 'on'); } catch {}
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
        <Awards onProject={setProject}/>
        <Breakdown/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">{profile.wordmark}<span>®</span></a>
        <span>© {new Date().getFullYear()} {profile.wordmark}. {profile.footerNote}</span>
        <div>
          <a href={profile.contact.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube Channel"><Youtube size={17}/></a>
          <a href={profile.contact.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile"><Instagram size={17}/></a>
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
