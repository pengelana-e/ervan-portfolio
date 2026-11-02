import fs from 'fs';

let css = fs.readFileSync('src/styles.css', 'utf8');

const printStyles = `

/* ==========================================================================
   PRINT / PDF EXPORT RECOVERY & OPTIMIZATION
   ========================================================================== */
@media print {
  *, *::before, *::after {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    background: #090909 !important;
    color: #f2efeb !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    font-size: 11pt !important;
  }

  /* Hide interactive/screen-only controls */
  .reading-progress,
  .motion-toggle,
  .menu-burger,
  .skip-link,
  .strip-pause-btn,
  .brand-pause,
  .brand-heading div,
  .filters,
  .search-box,
  .load-more,
  .award-expand,
  .comparison-caption,
  .dialog-backdrop {
    display: none !important;
  }

  /* Section Spacing & Page Breaks */
  .hero {
    height: 750px !important;
    page-break-after: always;
    break-after: page;
  }

  .portfolio,
  .recognition,
  .breakdown,
  .about,
  .journey,
  .contact {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-top: 30px !important;
    padding-top: 20px !important;
  }

  /* Ensure portfolio cards are 100% visible in print */
  .project-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 20px !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .project-card,
  .project-open,
  .project-picture,
  .media-image,
  .media-image > img {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  }

  .project-card:first-child {
    grid-column: 1 / -1 !important;
  }

  .brand-section {
    margin-top: 24px !important;
    page-break-inside: avoid;
  }

  .brand-viewport,
  .brand-full-grid {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 15px !important;
    overflow: visible !important;
  }

  .brand-logo {
    width: 110px !important;
    height: 50px !important;
  }

  .brand-logo > img {
    filter: none !important;
    opacity: 0.9 !important;
  }

  /* Awards & Recognition */
  .recognition-list ol li {
    opacity: 1 !important;
    display: flex !important;
  }

  .additional-award {
    display: flex !important;
  }

  /* Footer */
  .footer {
    border-top: 1px solid #333 !important;
    margin-top: 40px !important;
    page-break-inside: avoid;
  }
}
`;

if (!css.includes('@media print')) {
  css += printStyles;
  fs.writeFileSync('src/styles.css', css);
  console.log('Appended print stylesheet to src/styles.css');
} else {
  console.log('src/styles.css already has print styles');
}
