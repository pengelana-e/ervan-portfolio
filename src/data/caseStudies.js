/**
 * Ervan Erianto — Selected Work Case Study Architecture
 * Scalable Content Model & Publication Control
 *
 * IMPORTANT STATUS:
 * All candidate slots below are development-only placeholders (publicationStatus: 'draft', isPlaceholder: true).
 * No fabricated claims, financial results, or unverified achievements are published.
 * Only records with publicationStatus: 'approved' and isPlaceholder: false appear in public view.
 */

/**
 * @typedef {Object} CaseStudy
 * @property {string} id - Unique project slug
 * @property {string} title - Project name or title
 * @property {string} category - Work category
 * @property {string} ventureId - ID of related venture
 * @property {string} [location] - Project location (city/province)
 * @property {string} [period] - Timeframe or year
 * @property {string} [status] - Status (e.g. Active, Completed)
 * @property {string} summary - Short editorial summary (1-2 sentences)
 *
 * Professional Involvement
 * @property {string} role - Owner's specific role
 * @property {string} [scope] - Scope of responsibility
 * @property {string} [context] - Real-world background & problem
 * @property {string} [challenges] - Key constraints or risks addressed
 * @property {string} [approach] - Strategic decisions & methods applied
 * @property {string} [process] - Execution sequence
 *
 * Outcomes
 * @property {string[]} [outcomes] - Verified deliverables & outcomes
 * @property {string} [deliverables] - Concrete output
 * @property {string} [supportingEvidence] - Verifiable documentation reference
 *
 * Media
 * @property {string} coverImage - Image path
 * @property {string[]} [gallery] - Gallery images
 * @property {string} [imageAttribution] - Photo credit
 * @property {string} [mediaPermission] - Usage permission note
 *
 * References
 * @property {string} [link] - Public URL if available
 * @property {string} [company] - Related company or entity
 *
 * Publication Control
 * @property {'draft' | 'awaiting_evidence' | 'ready_for_review' | 'approved'} publicationStatus
 * @property {boolean} isPlaceholder - Marker distinguishing dev slots from verified projects
 */

export const caseStudies = [
  // CANDIDATE SLOT 01: REAL ESTATE DEVELOPMENT
  {
    id: "residential-development-practice",
    title: "Residential Land & Cluster Development",
    category: "Real Estate Development",
    ventureId: "real-estate-development",
    location: "Jawa Timur, Indonesia",
    period: "2016 → Present",
    status: "Active Practice",
    summary: "Perencanaan lahan, kemitraan pemilik tanah, dan pembangunan perumahan tapak berbasis kelayakan nyata.",
    
    // Professional Involvement
    role: "Property Developer / Equity & Execution Partner",
    scope: "Site acquisition, feasibility analysis, landowner structuring, and spatial licensing.",
    context: "Pengembangan kawasan perumahan mandiri yang menyeimbangkan antara keterjangkauan pasar dan kepatuhan legalitas pertanahan sejak tahap awal.",
    challenges: "Menghindari spekulasi tanah, memastikan validitas hak atas tanah, serta mengendalikan struktur permodalan agar proyek tetap likuid.",
    approach: "Memulai dari uji tuntas legalitas, menghitung struktur biaya secara rinci sebelum komitmen modal, dan menerapkan skema kemitraan lahan berkeadilan.",
    process: "Studi Kelayakan → Negosiasi Kemitraan Lahan → Perizinan & Tata Ruang → Pematangan Lahan → Pembangunan Unit → Serah Terima.",
    
    // Outcomes
    outcomes: [
      "Pengembangan proyek perumahan tapak di beberapa kota di Jawa Timur.",
      "Penerapan model kemitraan lahan mandiri tanpa spekulasi berisiko.",
      "Dokumentasi alur perizinan dan tata kelola tanah yang terstruktur."
    ],
    deliverables: "Klaster perumahan tapak, infrastruktur kawasan, dan sertifikasi tanah konsumen.",
    supportingEvidence: "Dokumentasi portofolio Dirham Land & kemitraan lapangan.",
    
    // Media
    coverImage: "./Asset/img/ventures/01_Real_Estate_Development.jpg",
    gallery: [
      "./Asset/img/ventures/01_Real_Estate_Development.jpg"
    ],
    imageAttribution: "Architectural maquette representation — awaiting site photography",
    mediaPermission: "Approved for architecture testing",
    
    // References
    link: null,
    company: "Dirham Land",
    
    // Publication Control
    publicationStatus: "draft",
    isPlaceholder: true
  },

  // CANDIDATE SLOT 02: CONSTRUCTION & PROJECT MANAGEMENT
  {
    id: "construction-project-control",
    title: "Project Control & Field Governance",
    category: "Construction & Project Management",
    ventureId: "construction-project-management",
    location: "Indonesia",
    period: "2022 → Present",
    status: "Active Practice",
    summary: "Pengendalian biaya konstruksi, pengawasan mutu lapangan, dan mitigasi deviasi anggaran proyek fisik.",
    
    // Professional Involvement
    role: "Co-Founder & Project Control Partner",
    scope: "Construction management, Bill of Quantities (BoQ) governance, and field progress auditing.",
    context: "Kebutuhan pemilik proyek atas transparansi eksekusi lapangan guna mencegah pembengkakan biaya dan penurunan spesifikasi teknis.",
    challenges: "Asimetri informasi antara kontraktor dan pemilik proyek, keterlambatan material, serta deviasi mutu pengerjaan di lapangan.",
    approach: "Membangun sistem pemantauan berkala berbasis deliverable, penguncian spesifikasi material sejak kontrak, dan verifikasi progres sebelum pencairan dana.",
    process: "Audit Gambar & BoQ → Penetapan Baseline Biaya & Jadwal → Pengawasan Lapangan Harian → Uji Mutu & Opname Progres → Laporan Transparan.",
    
    // Outcomes
    outcomes: [
      "Pelaksanaan proyek konstruksi dan renovasi dengan kendali mutu ketat.",
      "Perlindungan kepentingan pemilik proyek melalui pelaporan independen.",
      "Penerapan standar operasional lapangan yang terukur."
    ],
    deliverables: "Bangunan terealisasi, laporan kontrol biaya mingguan, dan berita acara serah terima pekerjaan.",
    supportingEvidence: "Praktik operasional Arkavena (PT Arkavena Solusi Dinamika).",
    
    // Media
    coverImage: "./Asset/img/ventures/02_Construction_Project_Management.jpg",
    gallery: [
      "./Asset/img/ventures/02_Construction_Project_Management.jpg"
    ],
    imageAttribution: "Architectural maquette representation — awaiting project documentation",
    mediaPermission: "Approved for architecture testing",
    
    // References
    link: "https://arkavena.com",
    company: "Arkavena",
    
    // Publication Control
    publicationStatus: "draft",
    isPlaceholder: true
  },

  // CANDIDATE SLOT 03: APPLIED AI & BUSINESS SYSTEMS
  {
    id: "applied-business-systems",
    title: "Intelligent Workflows & Business Systems",
    category: "AI & Software Development",
    ventureId: "ai-software-development",
    location: "Surabaya, Indonesia",
    period: "2025 → Present",
    status: "Active Exploration",
    summary: "Pengembangan agen AI terapan dan arsitektur alur kerja terstruktur untuk kebutuhan operasional bisnis nyata.",
    
    // Professional Involvement
    role: "Systems Architect & Applied AI Builder",
    scope: "Workflow architecture, domain logic modeling, and intelligent tool implementation.",
    context: "Kebutuhan organisasi bisnis untuk merapikan informasi, mengotomatisasi analisis dokumen kompleks, dan mendukung pengambilan keputusan yang lebih cepat.",
    challenges: "Mencegah 'AI hype' yang tidak relevan dengan pekerjaan harian serta memastikan sistem benar-benar menyederhanakan proses tanpa menambah beban operasional.",
    approach: "Memetakan masalah nyata di lapangan terlebih dahulu, mendesain logika alur data sebelum coding, dan memprioritaskan privasi serta kepastian analisis.",
    process: "Analisis Masalah Domain → Pemodelan Logika Sistem → Prototipe Workflow → Pengujian Lapangan → Iterasi & Integrasi.",
    
    // Outcomes
    outcomes: [
      "Arsitektur workflow terapan untuk analisis berkas dan perkara regulasi.",
      "Penyederhanaan proses kerja operasional yang berulang.",
      "Integrasi logika bisnis nyata ke dalam perangkat digital cerdas."
    ],
    deliverables: "Private workflow tools, modul pemrosesan dokumen, dan framework arsitektur sistem.",
    supportingEvidence: "Eksplorasi sistem PRAKARA OS & tools internal.",
    
    // Media
    coverImage: "./Asset/img/ventures/06_AI_Software_Development.jpg",
    gallery: [
      "./Asset/img/ventures/06_AI_Software_Development.jpg"
    ],
    imageAttribution: "Architectural maquette representation — awaiting product screenshots",
    mediaPermission: "Approved for architecture testing",
    
    // References
    link: null,
    company: "Private Architecture",
    
    // Publication Control
    publicationStatus: "draft",
    isPlaceholder: true
  }
];

/**
 * Returns only verified, owner-approved case studies for public viewing.
 * By default, returns [] until the owner supplies approved project data.
 */
export function getApprovedCaseStudies() {
  return caseStudies.filter(cs => cs.publicationStatus === "approved" && !cs.isPlaceholder);
}

/**
 * Returns all case studies (including draft candidate slots) for local development preview.
 */
export function getAllCaseStudies() {
  return caseStudies;
}

/**
 * Finds a case study by ID.
 */
export function getCaseStudyById(id) {
  return caseStudies.find(cs => cs.id === id) || null;
}

export default caseStudies;
