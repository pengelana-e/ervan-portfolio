import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, ArrowDown, X, Menu, Linkedin, MapPin, ExternalLink, Activity, CheckCircle2, FileText, Layers, Briefcase, Eye, EyeOff } from 'lucide-react';
import initiatives from './data/initiatives.js';
import { profile } from './data/profile.js';
import { caseStudies, getApprovedCaseStudies, getAllCaseStudies, getCaseStudyById } from './data/caseStudies.js';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];

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

function Header({ showSelectedWork }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', latest => setScrolled(latest > 40));

  const navLinks = [
    { href: '#work', label: 'WORK' },
    ...(showSelectedWork ? [{ href: '#selected-work', label: 'CASE STUDIES' }] : []),
    { href: '#milestones', label: 'MILESTONES' },
    { href: '#about', label: 'ABOUT' },
    { href: '#contact', label: 'CONTACT' }
  ];

  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner">
      <a className="wordmark" href="#home" aria-label={`${profile.name}, beranda`}>
        {profile.wordmark}<span>®</span>
      </a>

      <nav className="desktop-nav">
        {navLinks.map(link => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}>
        {open ? <X /> : <Menu />}
      </button>
    </div>

    <AnimatePresence>
      {open && <motion.nav className="mobile-menu" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ ease: EASE, duration: 0.3 }}>
        {navLinks.map(link => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label} <ArrowUpRight size={18} />
          </a>
        ))}
      </motion.nav>}
    </AnimatePresence>
  </header>;
}

function Hero({ variant = 'a' }) {
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

  return <section id="home" className={`hero v4-clean-hero ${variant === 'b' ? 'hero-variant-b' : ''}`} ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
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
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Buka detail ${project.title}`}>
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

/* =========================================================================
 * SELECTED WORK (Case Studies Architecture)
 * ========================================================================= */
function CaseStudyCard({ item, index, onSelect }) {
  const enabled = useContext(MotionContext);

  return <motion.article
    className="case-study-card"
    initial={enabled ? { opacity: 0, y: 24 } : false}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
  >
    <div className="case-study-visual" onClick={() => onSelect(item)}>
      <MediaImage src={item.coverImage} alt={item.title} priority={false} />
      <div className="case-study-badge-tag">{item.category}</div>
      {item.isPlaceholder && (
        <div className="case-study-dev-slot-tag">CANDIDATE SLOT · DRAFT</div>
      )}
      <span className="case-study-overlay-link"><ArrowUpRight size={20} /></span>
    </div>

    <div className="case-study-info">
      <div className="case-study-top-meta">
        <span className="case-study-period">{item.period || '2024'}</span>
        {item.location && <span className="case-study-location"><MapPin size={11} /> {item.location}</span>}
      </div>

      <h3 className="case-study-title" onClick={() => onSelect(item)}>
        {item.title}
      </h3>

      <div className="case-study-role">
        <Briefcase size={13} />
        <span>{item.role}</span>
      </div>

      <p className="case-study-summary">{item.summary}</p>

      <button className="case-study-cta-btn" onClick={() => onSelect(item)}>
        <span>Lihat Case Study</span>
        <ArrowUpRight size={15} />
      </button>
    </div>
  </motion.article>;
}

function SelectedWorkSection({ caseStudiesList, isPreviewMode, onSelectCaseStudy }) {
  if (!caseStudiesList || caseStudiesList.length === 0) return null;

  return <section id="selected-work" className="selected-work-section section-wrap">
    <Reveal className="section-heading v4-heading">
      <div>
        <span className="eyebrow">{profile.selectedWorkHeading.eyebrow}</span>
        <h2 className="display">{profile.selectedWorkHeading.headline}<span className="accent">.</span></h2>
      </div>
      <p className="section-lead v4-lead">
        {profile.selectedWorkHeading.subtitle}
      </p>
    </Reveal>

    {isPreviewMode && (
      <Reveal className="dev-preview-notice-banner">
        <div className="dev-notice-inner">
          <span className="dev-notice-pill">DEVELOPMENT ARCHITECTURE PREVIEW</span>
          <p>
            Komponen Case Study telah siap secara teknis. Menampilkan 3 slot kandidat internal untuk validasi tata letak &amp; interaksi. Data proyek terverifikasi milik owner akan diintegrasikan pada tahap berikutnya.
          </p>
        </div>
      </Reveal>
    )}

    <div className="case-study-grid">
      {caseStudiesList.map((cs, idx) => (
        <CaseStudyCard
          key={cs.id}
          item={cs}
          index={idx}
          onSelect={onSelectCaseStudy}
        />
      ))}
    </div>
  </section>;
}

/* =========================================================================
 * CASE STUDY DETAIL MODAL (Project -> Context -> Role -> Approach -> Outcomes)
 * ========================================================================= */
function CaseStudyDetailModal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  return <motion.div
    className="dialog-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="case-study-dialog-title"
  >
    <motion.div
      className="dialog-window case-study-dialog"
      initial={{ scale: 0.96, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.96, y: 20 }}
      onClick={e => e.stopPropagation()}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="dialog-heading">
        <div className="dialog-eyebrow-group">
          <span className="eyebrow">{item.category}</span>
          {item.isPlaceholder && <span className="dev-tag-mini">INTERNAL PREVIEW SLOT</span>}
        </div>
        <button onClick={onClose} className="icon-button" aria-label="Tutup"><X /></button>
      </div>

      <div className="case-study-dialog-content">
        {/* Title & Top Metadata */}
        <div className="cs-dialog-header">
          <h2 id="case-study-dialog-title" className="cs-dialog-title">{item.title}</h2>
          <div className="cs-dialog-meta-row">
            {item.role && <span className="cs-meta-pill"><Briefcase size={13} /> {item.role}</span>}
            {item.period && <span className="cs-meta-pill"><Layers size={13} /> {item.period}</span>}
            {item.location && <span className="cs-meta-pill"><MapPin size={13} /> {item.location}</span>}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="cs-dialog-media">
          <MediaImage src={item.coverImage} alt={item.title} priority={true} />
          {item.imageAttribution && (
            <span className="cs-media-credit">{item.imageAttribution}</span>
          )}
        </div>

        {/* Narrative Flow: Context -> Role -> Approach -> Process */}
        <div className="cs-narrative-flow">
          {item.summary && (
            <div className="cs-narrative-summary">
              <p>{item.summary}</p>
            </div>
          )}

          <div className="cs-narrative-columns">
            {item.context && (
              <div className="cs-narrative-block">
                <h4>01 / Konteks Proyek</h4>
                <p>{item.context}</p>
              </div>
            )}

            {item.scope && (
              <div className="cs-narrative-block">
                <h4>02 / Lingkup Tanggung Jawab</h4>
                <p>{item.scope}</p>
              </div>
            )}

            {item.challenges && (
              <div className="cs-narrative-block">
                <h4>03 / Tantangan &amp; Risiko</h4>
                <p>{item.challenges}</p>
              </div>
            )}

            {item.approach && (
              <div className="cs-narrative-block">
                <h4>04 / Keputusan &amp; Pendekatan</h4>
                <p>{item.approach}</p>
              </div>
            )}
          </div>

          {item.process && (
            <div className="cs-process-strip">
              <h4>Alur Eksekusi:</h4>
              <p>{item.process}</p>
            </div>
          )}

          {/* Verified Outcomes Box */}
          {item.outcomes && item.outcomes.length > 0 && (
            <div className="cs-outcomes-box">
              <div className="cs-outcomes-header">
                <CheckCircle2 size={18} />
                <h4>Hasil &amp; Deliverable Terverifikasi</h4>
              </div>
              <ul className="cs-outcomes-list">
                {item.outcomes.map((out, i) => (
                  <li key={i}>{out}</li>
                ))}
              </ul>
              {item.deliverables && (
                <p className="cs-deliverables-line">
                  <strong>Deliverable:</strong> {item.deliverables}
                </p>
              )}
              {item.supportingEvidence && (
                <p className="cs-evidence-line">
                  <strong>Bukti Pendukung:</strong> {item.supportingEvidence}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="cs-dialog-footer">
          {item.link ? (
            <a className="solid-primary-button" href={item.link} target="_blank" rel="noopener noreferrer">
              <span>Kunjungi Proyek Publik</span>
              <ExternalLink size={15} />
            </a>
          ) : (
            <a className="solid-primary-button" href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <span>Diskusikan Kasus / Proyek Serupa</span>
              <ArrowUpRight size={15} />
            </a>
          )}
          <button className="outline-button" onClick={onClose}>
            <span>Tutup Preview</span>
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>;
}

/* =========================================================================
 * VENTURES DETAIL MODAL (Enhanced with Verified Areas & Roles)
 * ========================================================================= */
function VentureDetailModal({ project, onClose, onSelectCaseStudy }) {
  useEffect(() => {
    const handleKeyDown = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return <motion.div
    className="dialog-backdrop"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
  >
    <motion.div
      className="dialog-window project-dialog venture-enhanced-dialog"
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      onClick={e => e.stopPropagation()}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="dialog-heading">
        <span className="eyebrow">{project.number} · {project.field || 'VENTURE FIELD'}</span>
        <button onClick={onClose} className="icon-button" aria-label="Tutup"><X /></button>
      </div>

      <div className="dialog-media still">
        <MediaImage src={project.image} alt={project.title} priority={true} />
      </div>

      <div className="dialog-description venture-modal-body">
        <div>
          <h2 id="dialog-title">{project.title}</h2>
          
          {project.role && (
            <div className="venture-modal-role">
              <Briefcase size={14} />
              <span>{project.role}</span>
            </div>
          )}

          <p className="venture-modal-summary">{project.description}</p>

          {/* Specific Areas of Work */}
          {project.specificAreas && project.specificAreas.length > 0 && (
            <div className="venture-areas-section">
              <h4>Bidang &amp; Cakupan Pekerjaan:</h4>
              <ul className="venture-areas-list">
                {project.specificAreas.map((area, idx) => (
                  <li key={idx}>{area}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Verified Initiative */}
          {project.relatedInitiative && (
            <div className="venture-initiative-strip">
              <span className="strip-label">Inisiatif Terkait:</span>
              <span className="strip-value">{project.relatedInitiative}</span>
            </div>
          )}

          <div className="dialog-tags">
            {(project.tags || []).map(t => (
              <span key={t} className="dialog-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="venture-modal-actions">
          {project.externalUrl && (
            <a className="solid-primary-button" href={project.externalUrl} target="_blank" rel="noopener noreferrer">
              <span>Buka Situs Inisiatif ({new URL(project.externalUrl).hostname})</span>
              <ExternalLink size={15} />
            </a>
          )}
          <a className="outline-button" href={profile.contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <span>Diskusikan Bidang Ini di LinkedIn</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </motion.div>
  </motion.div>;
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

        {/* Primary & Secondary Collaboration Actions */}
        <div className="contact-v4-actions contact-cta-group">
          <Magnetic href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-primary-btn btn-discuss">
            <span>{c.primaryCta}</span>
            <ArrowUpRight size={18} />
          </Magnetic>

          <Magnetic href={c.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-secondary-btn btn-linkedin">
            <Linkedin size={18} />
            <span>{c.secondaryCta}</span>
          </Magnetic>
        </div>

        <div className="contact-v4-meta">
          <span><MapPin size={13} /> {c.location}</span>
          <span><Activity size={13} /> {c.roleDescriptor}</span>
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

/* =========================================================================
 * ROOT APP
 * ========================================================================= */
function App() {
  const reduced = useReducedMotion();
  const enabled = !reduced;
  
  // Modals state
  const [selectedVenture, setSelectedVenture] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Selected Work Preview Mode (for localhost development testing)
  const [previewSelectedWork, setPreviewSelectedWork] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('preview') === 'selected-work' || params.get('preview') === 'all') return true;
      return localStorage.getItem('ervan_preview_selected_work') === 'true';
    } catch {
      return false;
    }
  });

  const togglePreview = () => {
    setPreviewSelectedWork(prev => {
      const next = !prev;
      try { localStorage.setItem('ervan_preview_selected_work', next ? 'true' : 'false'); } catch {}
      return next;
    });
  };

  // Hero Composition Refinement (A/B Surgical Experiment)
  // Default: Variant B (Balanced Composition)
  // Optional: ?hero=a restores Baseline Control
  const [heroVariant, setHeroVariant] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('hero') === 'a') return 'a';
      return 'b';
    } catch {
      return 'b';
    }
  });

  const toggleHeroVariant = () => {
    setHeroVariant(prev => {
      const next = prev === 'b' ? 'a' : 'b';
      try {
        const url = new URL(window.location.href);
        if (next === 'b') {
          url.searchParams.set('hero', 'b');
        } else {
          url.searchParams.delete('hero');
        }
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        setHeroVariant(params.get('hero') === 'b' ? 'b' : 'a');
      } catch {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Determine active case studies
  // Standard public mode: only verified approved records (currently [])
  // Development preview mode: includes 3 candidate draft slots
  const approvedStudies = getApprovedCaseStudies();
  const activeCaseStudies = previewSelectedWork ? getAllCaseStudies() : approvedStudies;
  const showSelectedWork = activeCaseStudies.length > 0;

  // Listen to hash for direct linking (e.g. #case-study/residential-development-practice)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#case-study/')) {
        const id = hash.replace('#case-study/', '');
        const found = getCaseStudyById(id);
        if (found) setSelectedCaseStudy(found);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
  }, [enabled]);

  return <MotionConfig reducedMotion="user">
    <MotionContext.Provider value={enabled}>
      <a className="skip-link" href="#work">Lewati ke konten utama</a>
      <motion.div className="reading-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <Header showSelectedWork={showSelectedWork} />

      <main>
        {/* 1. Hero: Clean Editorial Dominance */}
        <Hero variant={heroVariant} />

        {/* 2. Ventures & Fields of Work: Exactly Six Approved Fields */}
        <SelectedVentures onProject={p => setSelectedVenture(p)} />

        {/* 3. Scalable Selected Work: Case Studies Architecture (Controlled Visibility) */}
        {showSelectedWork && (
          <SelectedWorkSection
            caseStudiesList={activeCaseStudies}
            isPreviewMode={previewSelectedWork && approvedStudies.length === 0}
            onSelectCaseStudy={cs => setSelectedCaseStudy(cs)}
          />
        )}

        {/* 4. Selected Milestones: Compact Editorial Timeline */}
        <SelectedMilestones />

        {/* 5. About: Founder Profile & Background Narrative */}
        <About />

        {/* 6. Contact: Clean Grand Closing & Collaboration CTAs */}
        <JourneyAndContact onProject={p => setSelectedVenture(p)} />
      </main>

      <footer className="footer">
        <a className="wordmark" href="#home">{profile.footer.wordmark}<span>®</span></a>
        <span>© {profile.footer.copyrightYear} {profile.footer.wordmark}. {profile.footer.signOff}</span>
        <span>{profile.footer.domain}</span>
      </footer>

      {/* Venture Detail Modal */}
      <AnimatePresence>
        {selectedVenture && (
          <VentureDetailModal
            project={selectedVenture}
            onClose={() => setSelectedVenture(null)}
            onSelectCaseStudy={cs => {
              setSelectedVenture(null);
              setSelectedCaseStudy(cs);
            }}
          />
        )}
      </AnimatePresence>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyDetailModal
            item={selectedCaseStudy}
            onClose={() => {
              setSelectedCaseStudy(null);
              if (window.location.hash.startsWith('#case-study/')) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
          />
        )}
      </AnimatePresence>
    </MotionContext.Provider>
  </MotionConfig>;
}

createRoot(document.getElementById('root')).render(<App />);
