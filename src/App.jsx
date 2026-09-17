import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Menu, X, Phone, MessageCircle, Mail, MapPin, ChevronRight,
  Clock, Briefcase, DollarSign, FileText, Plane, Home as HomeIcon,
  CheckCircle2, ArrowRight, Globe2
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

// Deterministic, always-available stock photos for the rest of the site (country cards, hero bg, etc).
const IMG = (seed) => `https://picsum.photos/seed/${seed}/900/600`;

// NC Migration logo (uploaded artwork, embedded so it always renders).
const NC_LOGO = "data:image/png;base64,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";

// Contact details used by the floating action buttons.
const PHONE_DISPLAY = "+91 76588-82546";
const PHONE_TEL = "tel:+917658882546";
const WHATSAPP_LINK = "https://wa.me/917658882546";


// --- 4 homepage service-card images -------------------------------------
// Self-contained inline SVG illustrations. No network request of any kind —
// they are embedded directly in this file as data: URIs, so they render
// even in environments that block external image hosts. Swap any of these
// for your own hosted photography later; the <img src="..."> plumbing in
// ServiceCard doesn't change either way.
const svgDataUri = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const WORK_VISA_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400">
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff7a5c"/><stop offset="100%" stop-color="#c9312a"/>
    </linearGradient>
  </defs>
  <rect width="900" height="400" fill="url(#g1)"/>
  <g opacity="0.15" fill="#fff">
    <circle cx="820" cy="60" r="120"/><circle cx="60" cy="360" r="100"/>
  </g>
  <g fill="#ffffff" opacity="0.92">
    <rect x="560" y="120" width="90" height="200" rx="4"/>
    <rect x="660" y="80" width="110" height="240" rx="4"/>
    <rect x="580" y="150" width="18" height="18"/><rect x="612" y="150" width="18" height="18"/>
    <rect x="580" y="190" width="18" height="18"/><rect x="612" y="190" width="18" height="18"/>
    <rect x="580" y="230" width="18" height="18"/><rect x="612" y="230" width="18" height="18"/>
    <rect x="686" y="110" width="18" height="18"/><rect x="722" y="110" width="18" height="18"/>
    <rect x="686" y="150" width="18" height="18"/><rect x="722" y="150" width="18" height="18"/>
    <rect x="686" y="190" width="18" height="18"/><rect x="722" y="190" width="18" height="18"/>
    <rect x="686" y="230" width="18" height="18"/><rect x="722" y="230" width="18" height="18"/>
  </g>
  <g transform="translate(180,150)">
    <circle cx="90" cy="30" r="34" fill="#161233"/>
    <rect x="30" y="70" width="120" height="130" rx="18" fill="#161233"/>
    <rect x="10" y="90" width="30" height="90" rx="12" fill="#161233"/>
    <rect x="150" y="90" width="30" height="90" rx="12" fill="#161233"/>
    <rect x="55" y="10" width="70" height="26" rx="6" fill="#ffc72c"/>
    <rect x="60" y="170" width="60" height="60" rx="8" fill="#ffc72c"/>
  </g>
</svg>`);

const VISITOR_VISA_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400">
  <defs>
    <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22c2b5"/><stop offset="100%" stop-color="#00706a"/>
    </linearGradient>
  </defs>
  <rect width="900" height="400" fill="url(#g2)"/>
  <circle cx="740" cy="90" r="60" fill="#ffc72c" opacity="0.9"/>
  <g fill="#ffffff" opacity="0.85">
    <polygon points="80,320 220,150 360,320"/>
    <polygon points="260,320 400,190 540,320"/>
  </g>
  <g fill="#0e2a52">
    <ellipse cx="450" cy="330" rx="420" ry="40"/>
  </g>
  <g transform="translate(430,110) rotate(-18)" fill="#ffffff">
    <path d="M0 20 L140 0 L170 20 L140 40 L60 34 L20 46 L0 40 L14 30 Z"/>
    <polygon points="35,22 5,4 20,22 5,40"/>
  </g>
</svg>`);

const VISIT_TO_WORK_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400">
  <defs>
    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e79a2e"/><stop offset="100%" stop-color="#a5630f"/>
    </linearGradient>
  </defs>
  <rect width="900" height="400" fill="url(#g3)"/>
  <g opacity="0.15" fill="#fff"><circle cx="90" cy="80" r="90"/><circle cx="800" cy="330" r="120"/></g>
  <g transform="translate(140,110)">
    <circle cx="70" cy="30" r="30" fill="#161233"/>
    <rect x="20" y="65" width="100" height="110" rx="16" fill="#161233"/>
    <rect x="0" y="150" width="55" height="70" rx="8" fill="#ffc72c"/>
    <rect x="10" y="140" width="35" height="14" rx="6" fill="#ffc72c"/>
  </g>
  <g stroke="#ffffff" stroke-width="4" stroke-dasharray="10 10" fill="none" opacity="0.85">
    <path d="M300 230 C 420 150, 520 150, 620 210"/>
  </g>
  <g transform="translate(620,175)">
    <rect x="0" y="20" width="90" height="65" rx="10" fill="#161233"/>
    <rect x="30" y="4" width="30" height="20" rx="6" fill="#161233"/>
    <rect x="0" y="46" width="90" height="12" fill="#ffc72c"/>
  </g>
</svg>`);

const UK_EXTENSION_IMG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 400">
  <defs>
    <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7b64e8"/><stop offset="100%" stop-color="#2a2166"/>
    </linearGradient>
  </defs>
  <rect width="900" height="400" fill="url(#g4)"/>
  <g fill="#0e0a33" opacity="0.9">
    <rect x="60" y="200" width="60" height="120"/><rect x="140" y="170" width="70" height="150"/>
    <rect x="700" y="190" width="70" height="130"/><rect x="790" y="230" width="60" height="90"/>
  </g>
  <g transform="translate(360,40)">
    <rect x="60" y="60" width="60" height="260" fill="#0e0a33"/>
    <polygon points="60,60 90,10 120,60" fill="#0e0a33"/>
    <circle cx="90" cy="100" r="26" fill="#ffc72c"/>
    <rect x="30" y="150" width="120" height="16" fill="#0e0a33"/>
    <rect x="40" y="190" width="14" height="130" fill="#0e0a33"/>
    <rect x="126" y="190" width="14" height="130" fill="#0e0a33"/>
    <rect x="0" y="300" width="180" height="20" fill="#0e0a33"/>
  </g>
  <rect x="0" y="330" width="900" height="70" fill="#0e0a33" opacity="0.5"/>
</svg>`);

const NAVY = "#121140";
const NAVY2 = "#1a1854";
const ROYAL = "#e0203a";
const CORAL = "#ff5a3c";
const TEAL = "#00a99d";
const SUN = "#ffc72c";
const GOLD = "#ffc72c";
const INK = "#161233";
const PAPER = "#faf7f2";


const WORK_COUNTRIES = {
  spain: {
    flag: "🇪🇸", name: "Spain",
    hero: "linear-gradient(135deg,#8a2f12,#c9601f)",
    duration: "2 Year Work permission.",
    eligible: "Applicants with relevant experience in hospitality, agriculture, logistics or trades, subject to Spanish immigration rules and employer requirements.",
    jobs: ["Hospitality", "Warehouse & logistics", "Packing", "Agriculture", "Shop assistant", "Manufacturing"],
    permission: "Work in Spain requires an appropriate work authorisation or residence permit. Routes vary by occupation and applicant profile.",
    why: "Spain has seasonal and year-round demand across hospitality, agriculture and logistics, with EU residence pathways for eligible applicants.",
  },
  italy: {
    flag: "🇮🇹", name: "Italy",
    hero: "linear-gradient(135deg,#0f3d2e,#136c50)",
    duration: "2 Year Work permission.",
    eligible: "Applicants whose occupation falls within Italy's quota-based and seasonal work schemes, subject to eligibility and annual allocations.",
    jobs: ["Hospitality", "Agriculture", "Manufacturing", "Logistics", "Construction", "Care and domestic work"],
    permission: "Italy operates quota-based work authorisation schemes. Availability depends on the published decree, occupation and employer sponsorship.",
    why: "Italy's seasonal and quota schemes open periodically across hospitality, agriculture and manufacturing for eligible applicants.",
  },
  germany: {
    flag: "🇩🇪", name: "Germany",
    hero: "linear-gradient(135deg,#111827,#2a2a2a)",
    duration: "2 Year Work permission.",
    eligible: "Skilled and semi-skilled applicants with relevant experience or recognised qualifications, subject to German immigration rules.",
    jobs: ["Packing", "Warehouse", "Factory & production", "Logistics", "Skilled trades"],
    permission: "Germany offers several work authorisation routes, including skilled worker pathways. Some routes may be extendable where conditions are met.",
    why: "Germany has one of Europe's largest manufacturing and logistics sectors, with established legal routes for skilled and semi-skilled workers.",
  },
  "new-zealand": {
    flag: "🇳🇿", name: "New Zealand",
    hero: "linear-gradient(135deg,#0d2b4e,#1c4a7a)",
    duration: "3 Year Work permission.",
    eligible: "Applicants with experience in driving, warehousing, IT or other in-demand occupations, subject to accredited employer requirements.",
    jobs: ["Driving", "Warehouse", "IT roles", "Other occupations matched to your CV and profile"],
    permission: "Most work routes require a job offer from an accredited employer. Eligibility depends on occupation, experience and immigration rules.",
    why: "New Zealand's accredited employer system provides a structured route for workers in occupations with demonstrated demand.",
  },
  uk: {
    flag: "🇬🇧", name: "United Kingdom",
    hero: "linear-gradient(135deg,#101d3d,#233a72)",
    duration: "1 Year & 5 Year Work Visa  .",
    eligible: "Applicants who can meet Skilled Worker or other route requirements, including employer sponsorship, salary and English language thresholds.",
    jobs: ["Healthcare", "Hospitality", "IT", "Warehouse & logistics", "Construction", "Skilled professions"],
    permission: "Most UK work routes require a licensed sponsor and a Certificate of Sponsorship. Eligibility is assessed against current Home Office rules.",
    why: "The UK's Skilled Worker route covers a wide range of occupations, though sponsorship and eligibility requirements apply throughout.",
    cta: "Check My Eligibility",
  },
  uae: {
    flag: "🇦🇪", name: "UAE",
    hero: "linear-gradient(135deg,#3d2b0d,#8a6512)",
    duration: "2 Year Work permission.",
    eligible: "Applicants across experience levels in hospitality, retail, driving, security and office support, subject to employer requirements.",
    jobs: ["Hospitality", "Hotel staff", "Sales & retail", "Driving", "Security", "Warehouse", "Office support", "Customer service"],
    permission: "UAE work permits are employer-sponsored. Terms, duration and conditions are set by the employer and relevant authorities.",
    why: "The UAE's hospitality, retail and logistics sectors recruit across a broad range of experience levels.",
  },
  slovakia: {
    flag: "🇸🇰", name: "Slovakia",
    hero: "linear-gradient(135deg,#122c4d,#1f5091)",
    duration: "3 Year Work permission.",
    eligible: "Applicants with manufacturing, logistics or automotive experience, subject to Slovak immigration rules and employer requirements.",
    jobs: ["Warehouse", "Packing", "Manufacturing", "Factory work", "Logistics", "Automotive industry"],
    permission: "Work in Slovakia requires an appropriate work and residence authorisation. Requirements vary by occupation and employer.",
    why: "Slovakia's automotive and manufacturing base is among the most concentrated in Europe relative to its size.",
  },
  bulgaria: {
    flag: "🇧🇬", name: "Bulgaria",
    hero: "linear-gradient(135deg,#0f3d2e,#136c50)",
    duration: "2 Year Work permission.",
    eligible: "Applicants with experience in manufacturing, warehousing or hospitality, subject to Bulgarian immigration rules.",
    jobs: ["Warehouse", "Factory", "Packing", "Manufacturing", "Hospitality"],
    permission: "Work authorisation is required and is generally tied to a specific employer and occupation.",
    why: "Bulgaria offers an accessible entry point into the EU labour market across manufacturing and hospitality.",
  },
  serbia: {
    flag: "🇷🇸", name: "Serbia",
    hero: "linear-gradient(135deg,#3b0d0d,#7a1c1c)",
    duration: "3 Year Work permission.",
    eligible: "Applicants with construction, manufacturing, warehousing or hospitality backgrounds, subject to Serbian immigration rules.",
    jobs: ["Warehouse", "Packing", "Factory", "Construction", "Hospitality"],
    permission: "A work permit and residence approval are generally required, tied to the employer and role.",
    why: "Serbia's construction and industrial sectors have expanding demand, with arrangements that may be extendable where conditions are met.",
  },
};

const VISITOR_IMAGES = {
  UAE:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",

  Singapore:
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",

  Thailand:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=85",

  Malaysia:
    "https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=1200&q=85",

  Vietnam:
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85",

  "United Kingdom":
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",

  "Australia":
  "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=85",
  "New Zealand":
    "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85",

  Switzerland:
    "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85",

  "Schengen Europe":
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
};
const VISITOR_COUNTRIES = {
  uae: {
    flag: "🇦🇪",
    name: "UAE",
    label: "Tourist Visa",
    hero: "linear-gradient(135deg,#3d2b0d,#8a6512)",
    overview: "Short-stay tourist visas for holidays, shopping trips and family visits across Dubai, Abu Dhabi and the wider Emirates.",
    purpose: "Tourism, family visits, transit and short leisure stays."
  },

  singapore: {
    flag: "🇸🇬",
    name: "Singapore",
    label: "Visitor Visa",
    hero: "linear-gradient(135deg,#7a1c1c,#c9312a)",
    overview: "Visitor visa guidance for short leisure and family visit trips to Singapore.",
    purpose: "Tourism, family visits and short social visits."
  },

  thailand: {
    flag: "🇹🇭",
    name: "Thailand",
    label: "Tourist Visa",
    hero: "linear-gradient(135deg,#122c4d,#1f5091)",
    overview: "Tourist visa guidance for holidays and leisure travel across Thailand.",
    purpose: "Tourism and short leisure stays."
  },

  malaysia: {
    flag: "🇲🇾",
    name: "Malaysia",
    label: "Tourist Visa",
    hero: "linear-gradient(135deg,#0f3d2e,#136c50)",
    overview: "Visitor and tourist visa guidance for trips to Kuala Lumpur, Penang, Langkawi and beyond.",
    purpose: "Tourism, family visits and short leisure stays."
  },

  vietnam: {
    flag: "🇻🇳",
    name: "Vietnam",
    label: "Tourist Visa",
    hero: "linear-gradient(135deg,#8a2f12,#c9601f)",
    overview: "Tourist visa guidance for leisure travel across Vietnam.",
    purpose: "Tourism and short leisure stays."
  },

  uk: {
    flag: "🇬🇧",
    name: "United Kingdom",
    label: "Visitor Visa",
    hero: "linear-gradient(135deg,#101d3d,#233a72)",
    overview: "UK Standard Visitor visa guidance for tourism, family visits and permitted short business activities.",
    purpose: "Tourism, visiting family or friends, and certain permitted business activities. Visitors may not work in the UK."
  },

  australia: {
    flag: "🇦🇺",
    name: "Australia",
    label: "Visitor Visa",
    hero: "linear-gradient(135deg,#0f3d2e,#136c50)",
    overview: "Visitor visa guidance for holidays and family visits to Australia.",
    purpose: "Tourism and visiting family or friends."
  },

  "new-zealand": {
    flag: "🇳🇿",
    name: "New Zealand",
    label: "Visitor Visa",
    hero: "linear-gradient(135deg,#122c4d,#1f5091)",
    overview: "Visitor visa guidance for holidays and family visits to New Zealand.",
    purpose: "Tourism and visiting family or friends."
  },

  switzerland: {
    flag: "🇨🇭",
    name: "Switzerland",
    label: "Visitor Visa",
    hero: "linear-gradient(135deg,#7a1c1c,#a62b22)",
    overview: "Switzerland is part of the Schengen Area. Visitor travel is generally covered by a Schengen short-stay visa.",
    purpose: "Tourism, family visits and short leisure stays within the Schengen Area."
  },

  schengen: {
    flag: "🇪🇺",
    name: "Schengen Europe",
    label: "Schengen Visa",
    hero: "linear-gradient(135deg,#0d2b4e,#1c4a7a)",
    overview: "A Schengen short-stay visa may allow travel across participating European countries, subject to destination-specific requirements.",
    purpose: "Tourism, family visits and short stays across the Schengen Area."
  }
};
const SCHENGEN_MEMBERS = [
  ["🇫🇷", "France"], ["🇩🇪", "Germany"], ["🇮🇹", "Italy"], ["🇪🇸", "Spain"],
  ["🇬🇷", "Greece"], ["🇨🇭", "Switzerland"], ["🇳🇱", "Netherlands"],
  ["🇦🇹", "Austria"], ["🇵🇹", "Portugal"],
];

const VISIT_STEPS = [
  { title: "Documentation", desc: "Gather passport, financial, employment and supporting documents." },
  { title: "Application preparation", desc: "Complete and review your visa application in full." },
  { title: "Biometric appointment", desc: "Attend a biometric appointment where applicable." },
  { title: "Embassy / visa filing", desc: "Submit your application to the relevant embassy or authority." },
  { title: "Application tracking", desc: "We help you track your application status." },
  { title: "Travel planning", desc: "Plan your trip once a decision has been issued." },
];

const VISIT_TO_WORK_OPTIONS = {
  uk: {
    flag: "🇬🇧", name: "United Kingdom",
    hero: "linear-gradient(135deg,#101d3d,#233a72)",
    pathway: "After reaching UK on visitor visa its directly converted to 1 Year Work Permit.",
    considerations: ["Current and previous immigration status", "Whether a licensed sponsor is available", "Skilled Worker eligibility criteria", "Whether an application must be made from outside the UK"],
  },
  spain: {
    flag: "🇪🇸", name: "Spain",
    hero: "linear-gradient(135deg,#8a2f12,#c9601f)",
    pathway: "2 Year Schengen TRC Card - Spain operates work authorisation and residence routes with specific eligibility criteria. A visitor cannot work without obtaining the appropriate authorisation.",
    considerations: ["Occupation and sector demand", "Employer willingness to support an application", "Residence and work authorisation requirements", "Individual immigration history"],
  },
  germany: {
    flag: "🇩🇪", name: "Germany",
    hero: "linear-gradient(135deg,#111827,#2a2a2a)",
    pathway: "2 Year Schengen TRC Card - Germany has structured skilled worker and job-seeker routes. Requirements depend on qualifications, recognition and the specific route applied for.",
    considerations: ["Recognised qualifications or experience", "German language ability for some routes", "Whether a job offer is in place", "Applicable route and where it must be applied for"],
  },
  greece: {
    flag: "🇬🇷", name: "Greece",
    hero: "linear-gradient(135deg,#0d2b4e,#1c4a7a)",
    pathway: "2 Year Schengen TRC Card - Greece operates seasonal and quota-based work authorisation schemes. Availability depends on published allocations and occupation.",
    considerations: ["Seasonal scheme availability", "Occupation and sector", "Employer sponsorship", "Residence permit requirements"],
  },
  italy: {
    flag: "🇮🇹", name: "Italy",
    hero: "linear-gradient(135deg,#0f3d2e,#136c50)",
    pathway: "2 Year Schengen TRC Card  - Italy's work authorisation is largely quota-based through periodic decrees. Eligibility depends on the scheme open at the time of application.",
    considerations: ["Whether a quota scheme is currently open", "Occupation covered by the decree", "Employer sponsorship", "Application timing and location"],
  },
  lithuania: {
    flag: "🇱🇹", name: "Lithuania",
    hero: "linear-gradient(135deg,#3b0d0d,#7a1c1c)",
    pathway: "2 Year Schengen TRC Card - Lithuania issues work and residence permits tied to a specific employer and occupation. Visitor status does not itself permit work.",
    considerations: ["Employer sponsorship", "Occupation and shortage list", "Work and residence permit requirements", "Individual immigration history"],
  },
};

/* ------------------------------------------------------------------ */
/*  THEMED PAGE BACKGROUNDS                                             */
/* ------------------------------------------------------------------ */

const PAGE_THEMES = {
  work: {
    tint: "linear-gradient(160deg,#f4f6fb 0%,#eef2f9 55%,#f7f5f0 100%)",
    accent: CORAL,
    wash: `radial-gradient(1100px 420px at 12% -8%, rgba(255,90,60,0.13), transparent 60%),
           radial-gradient(900px 400px at 92% 4%, rgba(30,79,163,0.12), transparent 62%)`,
  },
  visitor: {
    tint: "linear-gradient(160deg,#eef8f7 0%,#f2f7fb 55%,#fbf8f2 100%)",
    accent: TEAL,
    wash: `radial-gradient(1000px 420px at 8% -6%, rgba(0,169,157,0.16), transparent 60%),
           radial-gradient(900px 380px at 95% 6%, rgba(255,199,44,0.14), transparent 62%)`,
  },
  pathway: {
    tint: "linear-gradient(160deg,#fbf5ec 0%,#f5f4fb 55%,#f2f8f7 100%)",
    accent: "#c9700e",
    wash: `radial-gradient(1000px 400px at 10% -6%, rgba(201,112,14,0.15), transparent 60%),
           radial-gradient(950px 400px at 92% 8%, rgba(0,169,157,0.12), transparent 62%)`,
  },
  uk: {
    tint: "linear-gradient(160deg,#f1f0fa 0%,#eef1f9 55%,#f8f7f4 100%)",
    accent: "#6c4fd1",
    wash: `radial-gradient(1050px 420px at 14% -8%, rgba(108,79,209,0.16), transparent 60%),
           radial-gradient(900px 380px at 94% 4%, rgba(30,79,163,0.12), transparent 62%)`,
  },
  about: {
    tint: "linear-gradient(160deg,#f3f5fb 0%,#f7f4ef 55%,#eff7f6 100%)",
    accent: ROYAL,
    wash: `radial-gradient(1100px 440px at 10% -8%, rgba(30,79,163,0.13), transparent 60%),
           radial-gradient(900px 400px at 93% 6%, rgba(0,169,157,0.12), transparent 62%)`,
  },
  contact: {
    tint: "linear-gradient(160deg,#eef1f9 0%,#f4f2fb 55%,#f9f7f2 100%)",
    accent: ROYAL,
    wash: `radial-gradient(1000px 420px at 12% -6%, rgba(22,18,51,0.14), transparent 60%),
           radial-gradient(900px 380px at 94% 8%, rgba(255,90,60,0.10), transparent 62%)`,
  },
};

// Subtle drifting route-lines + map dots layer used behind inner pages.
function PageBackdrop({ theme }) {
  const t = PAGE_THEMES[theme] || PAGE_THEMES.about;
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: t.tint }} />
      <div style={{ position: "absolute", inset: 0, background: t.wash }} />
      {/* dotted world-map style grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: `radial-gradient(${t.accent}22 1.4px, transparent 1.4px)`,
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, #000 35%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, #000 35%, transparent 78%)",
      }} />
      {/* soft travel route arcs */}
      <svg viewBox="0 0 1200 420" preserveAspectRatio="none"
           style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 420, opacity: 0.4 }}>
        <path d="M-40 300 C 260 150, 520 150, 780 250 S 1180 330, 1260 190" fill="none"
              stroke={t.accent} strokeWidth="1.5" strokeDasharray="7 11" opacity="0.55" />
        <path d="M-40 380 C 300 260, 640 300, 900 200 S 1200 120, 1260 150" fill="none"
              stroke={t.accent} strokeWidth="1.2" strokeDasharray="4 12" opacity="0.4" />
      </svg>
    </div>
  );
}

// Wraps an inner page so its content sits on a themed, readable background.
function PageShell({ theme, children }) {
  return (
    <div style={{ position: "relative", isolation: "isolate" }}>
      <PageBackdrop theme={theme} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

// Glass card used over themed backdrops so text stays highly readable.
function Glass({ children, style, pad = 26 }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 10px 30px rgba(16,22,48,0.08)",
      borderRadius: 16, padding: pad, ...style,
    }}>{children}</div>
  );
}

// Standard hero block for inner pages.
function PageHero({ eyebrow, h1, sub, desc, children, theme }) {
  const t = PAGE_THEMES[theme] || PAGE_THEMES.about;
  return (
    <Section style={{ paddingTop: 62, paddingBottom: 34 }}>
      <Glass pad={38} style={{ maxWidth: 860 }}>
        <div style={{ color: t.accent, fontWeight: 700, fontSize: 12.5, letterSpacing: 0.9, marginBottom: 12, textTransform: "uppercase" }}>{eyebrow}</div>
        <h1 style={{ fontSize: 36, color: INK, margin: "0 0 12px", lineHeight: 1.18 }}>{h1}</h1>
        {sub && <h2 style={{ fontSize: 16, color: "#4a5568", fontWeight: 600, margin: "0 0 14px", lineHeight: 1.5 }}>{sub}</h2>}
        {desc && <p style={{ color: "#3c485c", fontSize: 15, lineHeight: 1.8, margin: "0 0 22px", maxWidth: 680 }}>{desc}</p>}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{children}</div>
      </Glass>
    </Section>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Anchor({ id }) {
  return <div id={id} style={{ scrollMarginTop: 96 }} />;
}

function Disclaimer({ children }) {
  return (
    <div style={{
      background: "#fff8ec", border: "1px solid #e9d7a8", borderRadius: 10,
      padding: "14px 18px", fontSize: 13.5, color: "#6b5518", lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
}

function Section({ children, bg, style }) {
  return (
    <section className="nc-section" style={{ background: bg || "transparent", padding: "72px 24px", ...style }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Eyebrow({ children, light }) { return <div style={{ color: light ? SUN : CORAL, fontWeight: 700, fontSize: 13, letterSpacing: 0.4, marginBottom: 10, textTransform: "uppercase" }}>{children}</div>; }

function Btn({ children, onClick, variant = "gold", style }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 26px",
    borderRadius: 30, fontSize: 14.5, fontWeight: 700, cursor: "pointer",
    border: "none", transition: "transform .15s ease, box-shadow .15s ease",
  };
  const variants = {
    gold: { background: `linear-gradient(100deg,${SUN},#ffb100)`, color: "#211500", boxShadow: "0 8px 18px rgba(255,183,0,0.35)" },
    coral: { background: `linear-gradient(100deg,${CORAL},${ROYAL})`, color: "#fff", boxShadow: "0 8px 18px rgba(230,40,50,0.35)" },
    teal: { background: `linear-gradient(100deg,${TEAL},#007b72)`, color: "#fff", boxShadow: "0 8px 18px rgba(0,169,157,0.3)" },
    outline: { background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.6)" },
    navy: { background: NAVY, color: "#fff" },
    ghost: { background: "rgba(255,255,255,0.16)", color: "#fff" },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

// Generic city-skyline silhouette used behind country cards, tinted per country.
const SKYLINE_SVG = svgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260">
  <g fill="#ffffff" opacity="0.30">
    <rect x="20" y="150" width="46" height="110"/>
    <rect x="76" y="110" width="38" height="150"/>
    <rect x="124" y="170" width="52" height="90"/>
    <rect x="186" y="80" width="34" height="180"/>
    <polygon points="186,80 203,40 220,80"/>
    <rect x="232" y="140" width="58" height="120"/>
    <rect x="300" y="100" width="40" height="160"/>
    <rect x="350" y="160" width="60" height="100"/>
    <rect x="420" y="120" width="36" height="140"/>
    <polygon points="420,120 438,86 456,120"/>
    <rect x="466" y="165" width="54" height="95"/>
    <rect x="530" y="135" width="50" height="125"/>
  </g>
  <g fill="#ffffff" opacity="0.5">
    <rect x="88" y="130" width="6" height="8"/><rect x="100" y="130" width="6" height="8"/>
    <rect x="88" y="152" width="6" height="8"/><rect x="100" y="152" width="6" height="8"/>
    <rect x="310" y="120" width="6" height="8"/><rect x="322" y="120" width="6" height="8"/>
    <rect x="310" y="145" width="6" height="8"/><rect x="322" y="145" width="6" height="8"/>
    <rect x="542" y="155" width="6" height="8"/><rect x="556" y="155" width="6" height="8"/>
  </g>
</svg>`);

function CountryCard({ flag, name, gradient, image, subtitle, accent, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer", borderRadius: 16, overflow: "hidden",
        height: 210, position: "relative",
        background: gradient || `linear-gradient(135deg,${NAVY},${ROYAL})`,
        transform: hover ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
        boxShadow: hover ? `0 20px 38px rgba(10,31,60,0.32)` : "0 8px 18px rgba(10,31,60,0.16)",
        transition: "transform .25s ease, box-shadow .25s ease",
        border: `1px solid ${accent || "rgba(255,255,255,0.08)"}`,
      }}
    >
      {/* Giant flag watermark */}
      <div style={{
        position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)",
        fontSize: 150, lineHeight: 1, opacity: 0.28, pointerEvents: "none", userSelect: "none",
      }}>{flag}</div>

      {/* Skyline silhouette */}
      <img src={SKYLINE_SVG} alt="" aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, width: "100%", height: 130,
        objectFit: "cover", objectPosition: "bottom", pointerEvents: "none",
        transform: hover ? "scale(1.06)" : "scale(1)", transformOrigin: "bottom center",
        transition: "transform .4s ease",
      }} />

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(10,20,40,0.05) 35%, rgba(10,20,40,0.82) 100%)",
      }} />

      <div style={{
        position: "absolute", top: 16, left: 16, fontSize: 30, width: 46, height: 46,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", borderRadius: 10,
      }}>{flag}</div>
      <div style={{ position: "absolute", bottom: 18, left: 20, right: 20 }}>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 700, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>{name}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12.5, marginTop: 4, fontWeight: 500 }}>{subtitle}</div>}
      </div>
      <div style={{
        position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%",
        background: GOLD, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hover ? 1 : 0.85, transform: hover ? "translateX(0)" : "translateX(2px)", transition: "all .2s ease",
      }}>
        <ChevronRight size={16} color="#1a1204" />
      </div>
    </div>
  );
}

function InfoStat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ background: "rgba(30,79,163,0.1)", padding: 10, borderRadius: 10, color: ROYAL }}>
        <Icon size={18} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#7a8699", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
        <div style={{ fontSize: 15, color: INK, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NAV + FOOTER                                                       */
/* ------------------------------------------------------------------ */

function Navbar({ go, current }) {
  const [open, setOpen] = useState(false);
  const links = [
    ["Home", "home"], ["Work Visa", "work-visa"], ["Visitor Visa", "visitor-visa"],
    ["Visit to Work", "visit-to-work"], ["UK Visa Extension", "uk-extension"],
    ["About Us", "about"], ["Contact Us", "contact"],
  ];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", boxShadow: "0 2px 14px rgba(20,20,60,0.08)" }}>
      <div style={{ height: 4, background: `linear-gradient(90deg,${CORAL},${SUN},${TEAL},${ROYAL})` }} />
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9 }}>
          <img src={NC_LOGO} alt="NC Migration" style={{ height: 48, width: "auto", display: "block" }} />
        </div>

        <div style={{ display: "flex", gap: 26 }} className="nc-desktop-nav">
          {links.map(([label, key]) => (
            <div key={key} onClick={() => go(key)} style={{
              cursor: "pointer", fontSize: 14, fontWeight: 600,
              color: current === key ? ROYAL : "#4a4a63",
              borderBottom: current === key ? `2px solid ${CORAL}` : "2px solid transparent",
              paddingBottom: 4,
            }}>{label}</div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "none" }} className="nc-desktop-cta">
            <Btn variant="coral" onClick={() => go("contact")}>Get Free Consultation</Btn>
          </div>
          <button onClick={() => setOpen(!open)} style={{ background: "transparent", border: "none", color: INK, cursor: "pointer" }} className="nc-mobile-toggle">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ background: PAPER, padding: "10px 24px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(([label, key]) => (
            <div key={key} onClick={() => { go(key); setOpen(false); }} style={{ color: INK, padding: "10px 4px", fontSize: 15, cursor: "pointer", borderBottom: "1px solid #e7e2d8" }}>{label}</div>
          ))}
          <div style={{ marginTop: 12 }}><Btn variant="coral" onClick={() => { go("contact"); setOpen(false); }} style={{ width: "100%", justifyContent: "center" }}>Get Free Consultation</Btn></div>
        </div>
      )}
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ background: "#0e0c2e", color: "rgba(255,255,255,0.75)", padding: "0 0 28px" }}>
      <div style={{ height: 5, background: `linear-gradient(90deg,${CORAL},${SUN},${TEAL},${ROYAL})` }} />
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "56px 24px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 32 }} className="nc-footer-grid">
          <div>
            <img src={NC_LOGO} alt="NC Migration" style={{ height: 54, width: "auto", display: "block", marginBottom: 12, filter: "brightness(0) invert(1)" }} />
            <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 280 }}>Guidance for work opportunities, visitor visas and international travel — built around your profile.</p>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Quick Links</div>
            {["Home", "About Us", "Contact Us"].map((l, i) => (
              <div key={i} onClick={() => go(["home", "about", "contact"][i])} style={{ fontSize: 13.5, marginBottom: 9, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Services</div>
            {["Work Visa", "Visitor Visa", "Visit to Work", "UK Visa Extension"].map((l, i) => (
              <div key={i} onClick={() => go(["work-visa", "visitor-visa", "visit-to-work", "uk-extension"][i])} style={{ fontSize: 13.5, marginBottom: 9, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Contact</div>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>+91 76588 82546</div>
            <div style={{ fontSize: 13.5, marginBottom: 9 }}>info@ncmigration.com</div>
            <div style={{ fontSize: 13.5 }}>Sector 17, Chandigarh</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 40, paddingTop: 20, fontSize: 12, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>
          NC MIGRATION provides consultancy and guidance services. Visa approval, employment opportunities and immigration decisions are subject to the requirements and decisions of relevant employers, embassies and government authorities.
        </div>
      </div>
    </footer>
  );
}

function FloatingCTAs() {
  const [hovered, setHovered] = useState(null);
  const bubble = (show) => ({
    position: "absolute", right: 62, top: "50%", transform: "translateY(-50%)",
    background: "#161233", color: "#fff", padding: "8px 14px", borderRadius: 8,
    fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap",
    boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
    opacity: show ? 1 : 0, pointerEvents: "none",
    transition: "opacity .18s ease", 
  });
  const circle = (bg) => ({
    width: 54, height: 54, borderRadius: "50%", background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)", cursor: "pointer",
    textDecoration: "none", position: "relative",
  });

  return (
    <div style={{ position: "fixed", bottom: 22, right: 22, display: "flex", flexDirection: "column", gap: 14, zIndex: 60 }}>
      <div style={{ position: "relative" }}
           onMouseEnter={() => setHovered("wa")} onMouseLeave={() => setHovered(null)}>
        <span style={bubble(hovered === "wa")}>{PHONE_DISPLAY}</span>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
           aria-label={`WhatsApp us at ${PHONE_DISPLAY}`} style={circle("#25D366")}>
          {/* WhatsApp glyph */}
          <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true">
            <path d="M16.04 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.72 6.4L3.2 28.8l6.57-1.72a12.74 12.74 0 0 0 6.27 1.6h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.05-3.63zm0 23.32h-.01c-1.94 0-3.85-.52-5.51-1.51l-.4-.23-4.09 1.07 1.09-3.99-.26-.41a10.56 10.56 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.57 10.57 0 0 1 3.11 7.52c0 5.87-4.77 10.71-10.47 10.71zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.73-.98-2.36-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z"/>
          </svg>
        </a>
      </div>

      <div style={{ position: "relative" }}
           onMouseEnter={() => setHovered("call")} onMouseLeave={() => setHovered(null)}>
        <span style={bubble(hovered === "call")}>{PHONE_DISPLAY}</span>
        <a href={PHONE_TEL} aria-label={`Call us at ${PHONE_DISPLAY}`}
           style={circle(`linear-gradient(135deg,${CORAL},${ROYAL})`)}>
          <Phone color="#fff" size={22} />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HOME                                                                */
/* ------------------------------------------------------------------ */

const TICKER_CURRENCIES = [
  ["🇬🇧", "United Kingdom", "GBP"],
  ["🇪🇺", "Euro", "EUR"],
  ["🇺🇸", "USA", "USD"],
  ["🇦🇪", "UAE", "AED"],
  ["🇳🇿", "New Zealand", "NZD"],
  ["🇦🇺", "Australia", "AUD"],
  ["🇸🇬", "Singapore", "SGD"],
  ["🇨🇦", "Canada", "CAD"],
  ["🇨🇭", "Switzerland", "CHF"],
  ["🇲🇾", "Malaysia", "MYR"],
  ["🇹🇭", "Thailand", "THB"],
  ["🇻🇳", "Vietnam", "VND"],
];

function CurrencyTicker() {
  const [rates, setRates] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadRates = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/rates"
      );

      if (!response.ok) {
        throw new Error("Rates unavailable");
      }

      const data = await response.json();

      if (!data?.rates) {
        throw new Error("No rates returned");
      }

      const converted = {};

      Object.entries(data.rates).forEach(([currency, inrToCurrency]) => {
        if (inrToCurrency > 0) {
          converted[currency] = 1 / inrToCurrency;
        }
      });

      setRates(converted);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Currency rates error:", error);
    }
  }, []);

  useEffect(() => {
    loadRates();

    const timer = setInterval(loadRates, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, [loadRates]);

  const formatRate = (code) => {
    const value = rates[code];

    if (value == null) {
      return "—";
    }

    if (value < 0.01) {
      return `₹${value.toFixed(5)}`;
    }

    if (value < 1) {
      return `₹${value.toFixed(3)}`;
    }

    return `₹${value.toFixed(2)}`;
  };

  const items = [...TICKER_CURRENCIES, ...TICKER_CURRENCIES];

  return (
    <div
      style={{
        background: NAVY,
        borderBottom: `2px solid ${SUN}`,
        position: "relative",
        maxWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          className="nc-ticker-track"
          style={{
            display: "flex",
            width: "max-content",
            padding: "11px 0",
          }}
        >
          {items.map(([flag, country, code], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "0 22px",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 17 }}>{flag}</span>

              <span
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 12.5,
                  fontWeight: 500,
                }}
              >
                {country}
              </span>

              <span
                style={{
                  color: "#fff",
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                {formatRate(code)}
              </span>

              <span
                style={{
                  color: SUN,
                  marginLeft: 10,
                  opacity: 0.6,
                }}
              >
                {"\u2022"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 10.5,
          color: "rgba(255,255,255,0.55)",
          paddingBottom: 4,
        }}
      >
        {lastUpdated
          ? `Exchange rates • Updated ${lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Loading exchange rates..."}
      </div>
    </div>
  );
}

function Hero({ go }) {
  const cards = [
    {
      title: "WORK VISA",
      subtitle: "Europe · New Zealand · UK · UAE · And More",
      description: "Skilled and semi-skilled roles matched to your CV.",
      badge: "8 COUNTRIES",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
      flags: ["🇳🇿", "🇩🇪", "🇧🇬", "🇷🇸", "🇸🇰", "🇦🇪", "🇬🇧"],
      route: "work-visa",
      accent: "#e0203a",
    },

    {
      title: "VISIT TO WORK",
      subtitle: "Schengen · United Kingdom · Europe",
      description: "Legal pathways from a visit toward work authorisation.",
      badge: "NEW PATHWAY",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
      flags: ["🇪🇺", "🇪🇸", "🇱🇹", "🇬🇧"],
      route: "visit-to-work",
      accent: "#c9700e",
    },

    {
      title: "VISITOR VISA",
      subtitle: "Schengen · UK · UAE · Singapore · Australia",
      description: "Guided applications for tourism and family visits.",
      badge: "EXPLORE THE WORLD",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
      flags: ["🇪🇺", "🇬🇧", "🇦🇺", "🇳🇿", "🇦🇪", "🇸🇬"],
      route: "visitor-visa",
      accent: "#00a99d",
    },

    {
      title: "UK VISA EXTENSION",
      subtitle: "Right to Work · Share Code · COS",
      description:
        "Understand your UK visa extension and right-to-work options.",
      badge: "PROFILE ASSESSMENT",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
      flags: ["🇬🇧"],
      route: "uk-extension",
      accent: "#6c4fd1",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 650,
        padding: "105px 24px 70px",
        backgroundImage:
          "linear-gradient(110deg, rgba(7,24,55,0.88) 0%, rgba(12,42,82,0.62) 45%, rgba(7,25,52,0.48) 100%), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,18,40,0.15), rgba(5,18,40,0.55))",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1250,
          margin: "0 auto",
        }}
      >
        {/* HERO TEXT */}
        <div
          style={{
            maxWidth: 900,
            marginBottom: 38,
          }}
        >
          <div
            style={{
              color: "#ffc72c",
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: 2.2,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            NC Migration · Global Work & Travel Consultancy
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(38px, 5.5vw, 68px)",
              lineHeight: 1.05,
              fontWeight: 850,
              margin: 0,
              maxWidth: 850,
              textShadow: "0 5px 25px rgba(0,0,0,0.35)",
            }}
          >
            Your journey to the world starts with NC Migration
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.94)",
              fontSize: 19,
              marginTop: 20,
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            Work Abroad &nbsp;|&nbsp; Visit the World &nbsp;|&nbsp; Explore New
            Opportunities
          </p>
        </div>

        {/* FOUR SERVICE CARDS */}
        <div
          className="nc-4col nc-services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => go(card.route)}
              style={{
                position: "relative",
                height: 360,
                borderRadius: 22,
                overflow: "hidden",
                cursor: "pointer",
                background: "#071b3b",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.30)",
                transition:
                  "transform .3s ease, box-shadow .3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0 28px 55px rgba(0,0,0,0.42)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 18px 45px rgba(0,0,0,0.30)";
              }}
            >
              {/* PHOTO */}
              <img
                src={card.image}
                alt={card.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform .5s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              />

              {/* IMAGE DARK GRADIENT */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(4,15,35,0.02) 15%, rgba(4,15,35,0.22) 40%, rgba(4,15,35,0.96) 100%)",
                }}
              />

              {/* BADGE */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  background: card.accent,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 0.9,
                  padding: "7px 12px",
                  borderRadius: 30,
                  boxShadow: "0 5px 14px rgba(0,0,0,0.22)",
                }}
              >
                {card.badge}
              </div>

              {/* FLAGS */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 14,
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  maxWidth: 125,
                }}
              >
                {card.flags.map((flag, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: 17,
                      background: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(7px)",
                      padding: "4px 5px",
                      borderRadius: 6,
                    }}
                  >
                    {flag}
                  </span>
                ))}
              </div>

              {/* CONTENT */}
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  right: 18,
                  bottom: 18,
                  color: "#fff",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 25,
                    lineHeight: 1.05,
                    fontWeight: 850,
                    letterSpacing: -0.4,
                  }}
                >
                  {card.title}
                </h2>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  {card.subtitle}
                </div>

                <p
                  style={{
                    margin: "12px 0 0",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.88)",
                    maxWidth: 280,
                  }}
                >
                  {card.description}
                </p>

                {/* ARROW */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(5px)",
                    fontSize: 25,
                  }}
                >
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ServiceCard({ big, sub, desc, image, badge, badgeColor, flags, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="service-card"
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer", borderRadius: 18, overflow: "hidden", height: 420,
        display: "flex", flexDirection: "column",
        background: NAVY, position: "relative", zIndex: 0,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 26px 46px rgba(10,31,60,0.4)" : "0 10px 24px rgba(10,31,60,0.22)",
        transition: "transform .25s ease, box-shadow .25s ease",
      }}
    >
      <div className="service-image" style={{ width: "100%", height: 160, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img
          src={image}
          alt={big}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hover ? "scale(1.12)" : "scale(1)",
            transition: "transform .5s ease",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,17,64,0.1) 40%, rgba(10,17,64,0.85) 100%)", pointerEvents: "none" }} />
        {badge && (
          <div style={{ position: "absolute", top: 14, left: 16, background: badgeColor || CORAL, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, padding: "5px 11px", borderRadius: 20 }}>{badge}</div>
        )}
        {flags && (
          <div style={{ position: "absolute", bottom: 10, left: 14, right: 14, display: "flex", flexWrap: "wrap", gap: 6, pointerEvents: "none" }}>
            {flags.map((f, i) => (
              <span key={i} style={{
                fontSize: 19, lineHeight: 1, background: "rgba(255,255,255,0.22)",
                padding: "3px 5px", borderRadius: 5, backdropFilter: "blur(3px)",
              }}>{f}</span>
            ))}
          </div>
        )}
      </div>
      <div className="service-content" style={{ height: "calc(100% - 160px)", padding: "18px 22px 22px", display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#fff", fontSize: 21, fontWeight: 800, lineHeight: 1.2 }}>{big}</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 8, fontWeight: 500 }}>{sub}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginTop: 10, lineHeight: 1.5 }}>{desc}</div>
        <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", gap: 6, color: SUN, fontWeight: 700, fontSize: 13 }}>
          Explore <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, h2, h3, light }) {
  return (
    <>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2 style={{ fontSize: 28, color: light ? "#fff" : INK, margin: "0 0 8px" }}>{h2}</h2>
      {h3 && <h3 style={{ fontSize: 15.5, color: light ? "rgba(255,255,255,0.8)" : "#5a6577", fontWeight: 500, margin: "0 0 28px", maxWidth: 720, lineHeight: 1.6 }}>{h3}</h3>}
    </>
  );
}

// Compact clickable country tile used on home + inner pages.
function CountryTile({ flag, name, label, onClick, accent }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer", background: "#fff", borderRadius: 14,
        border: "1px solid #e7eaf2", borderTop: `3px solid ${accent || CORAL}`,
        padding: "20px 18px", display: "flex", flexDirection: "column",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hover ? "0 18px 32px rgba(16,22,48,0.14)" : "0 4px 12px rgba(16,22,48,0.06)",
        transition: "transform .2s ease, box-shadow .2s ease",
      }}
    >
      <div role="img" aria-label={`${name} flag`} style={{ fontSize: 30, lineHeight: 1 }}>{flag}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginTop: 10 }}>{name}</div>
      <div style={{ fontSize: 12.5, color: "#7a8699", marginTop: 3 }}>{label}</div>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 5, color: accent || CORAL, fontSize: 12.5, fontWeight: 700 }}>
        View Details <ArrowRight size={13} style={{ transform: hover ? "translateX(3px)" : "none", transition: "transform .2s ease" }} />
      </div>
    </div>
  );
}

function StepFlow({ steps, light }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: 14 }} className="nc-4col">
      {steps.map(([n, t, d], i) => (
        <div key={i} style={{
          background: light ? "rgba(255,255,255,0.08)" : "#fff",
          border: light ? "1px solid rgba(255,255,255,0.14)" : "1px solid #e7eaf2",
          borderRadius: 14, padding: "20px 18px", position: "relative",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: light ? SUN : CORAL, lineHeight: 1 }}>{n}</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: light ? "#fff" : INK, marginTop: 10 }}>{t}</div>
          {d && <div style={{ fontSize: 12.5, color: light ? "rgba(255,255,255,0.72)" : "#5a6577", marginTop: 6, lineHeight: 1.6 }}>{d}</div>}
        </div>
      ))}
    </div>
  );
}

function HomePage({ go }) {
  const workList = Object.entries(WORK_COUNTRIES);
  const visitList = Object.entries(VISITOR_COUNTRIES);
  return (
    <>
      <CurrencyTicker />
      <Hero go={go} />

      {/* WORK VISA COUNTRIES */}
      <Section bg={PAPER}>
        <Anchor id="work-countries" />
        <SectionHead
          eyebrow="Work Visa"
          h2="Work visa opportunities around the world"
          h3="Explore country-specific work visa routes across Europe, the UK, New Zealand and the UAE."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="nc-5col">
          {workList.map(([key, c]) => (
            <CountryTile key={key} flag={c.flag} name={c.name} label="Work Visa" accent={CORAL}
                         onClick={() => go("work-country", key)} />
          ))}
        </div>
        <Btn variant="coral" onClick={() => go("work-visa")} style={{ marginTop: 26 }}>
          Explore Work Visa <ArrowRight size={15} />
        </Btn>
      </Section>

      {/* VISITOR VISA DESTINATIONS */}
      <Section>
        <SectionHead
          eyebrow="Visitor Visa"
          h2="Popular visitor visa destinations"
          h3="Tourist and visitor visa assistance for holidays, family visits and international trips."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="nc-5col">
          {visitList.map(([key, c]) => (
            <CountryTile key={key} flag={c.flag} name={c.name} label={c.label} accent={TEAL}
                         onClick={() => go("visitor-country", key)} />
          ))}
        </div>
        <Btn variant="teal" onClick={() => go("visitor-visa")} style={{ marginTop: 26 }}>
          Explore Visitor Visa <ArrowRight size={15} />
        </Btn>
      </Section>

          {/* WHY NC MIGRATION */}
      <Section
        style={{
          background: "#f7f8fb",
          paddingTop: 76,
          paddingBottom: 76,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1.95fr",
            gap: 34,
            alignItems: "stretch",
          }}
          className="nc-why-grid"
        >
          <div
            style={{
              minHeight: 390,
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 18px 45px rgba(10,31,60,0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg,rgba(8,18,45,0.08) 15%,rgba(8,18,45,0.82) 100%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: 28,
                right: 28,
                bottom: 28,
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  color: SUN,
                  marginBottom: 10,
                }}
              >
                NC MIGRATION
              </div>

              <div
                style={{
                  fontSize: 27,
                  lineHeight: 1.2,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                Guidance built around your profile.
              </div>

              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                Clear information, country-specific guidance and support
                throughout your application journey.
              </div>
            </div>
          </div>

          <div>
            <SectionHead
              eyebrow="Why Us"
              h2="Why choose NC Migration?"
              h3="Simple, profile-based guidance for work visas, visitor visas and UK immigration services."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
              className="nc-2col"
            >
              {[
                ["01", "Profile assessment", "We understand your background and requirements.", CORAL],
                ["02", "Country-specific guidance", "We explain the relevant route and requirements.", TEAL],
                ["03", "Documentation support", "We help you understand the documents needed.", SUN],
                ["04", "Application assistance", "We support you through preparation and submission.", ROYAL],
              ].map(([num, title, desc, color]) => (
                <div
                  key={num}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "22px 20px",
                    border: "1px solid #e6e9f0",
                    boxShadow: "0 6px 18px rgba(16,22,48,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${color}18`,
                      color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 13,
                      marginBottom: 15,
                    }}
                  >
                    {num}
                  </div>

                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 750,
                      color: INK,
                      marginBottom: 7,
                    }}
                  >
                    {title}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "#667085",
                    }}
                  >
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section style={{ paddingTop: 74, paddingBottom: 74 }}>
        <SectionHead
          eyebrow="How It Works"
          h2="Your journey in four simple steps"
          h3="From profile assessment to application support, we keep the process clear and easy to follow."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            marginTop: 34,
          }}
          className="nc-4col"
        >
          {[
            ["01", "Profile assessment", "We review your background, experience and immigration history."],
            ["02", "Country & route guidance", "We explain which routes may realistically apply to you."],
            ["03", "Documentation", "We guide you through the documents each route requires."],
            ["04", "Application support", "We support you through preparation and submission."],
          ].map(([num, title, desc], i) => (
            <div
              key={num}
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: 18,
                padding: "26px 22px",
                border: "1px solid #e5e8ef",
                boxShadow: "0 7px 20px rgba(16,22,48,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 850,
                  color: CORAL,
                  lineHeight: 1,
                  marginBottom: 18,
                }}
              >
                {num}
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 750,
                  color: INK,
                  marginBottom: 8,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#667085",
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </div>

              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    right: -15,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#fff",
                    border: "1px solid #e5e8ef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: CORAL,
                    zIndex: 2,
                  }}
                  className="nc-step-arrow"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <section
        style={{
          position: "relative",
          minHeight: 390,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(8,18,45,0.88),rgba(8,18,45,0.58),rgba(8,18,45,0.78))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: 760,
            padding: "70px 24px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "7px 14px",
              borderRadius: 30,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: SUN,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.2,
              marginBottom: 18,
            }}
          >
            START YOUR JOURNEY
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: 38,
              lineHeight: 1.15,
              margin: "0 0 16px",
              fontWeight: 850,
            }}
          >
            Ready to explore your next opportunity?
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.84)",
              fontSize: 16,
              lineHeight: 1.7,
              margin: "0 auto 28px",
              maxWidth: 650,
            }}
          >
            Speak with our team and understand which visa routes may apply
            to your profile.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Btn variant="gold" onClick={() => go("contact")}>
              Get Free Consultation <ArrowRight size={15} />
            </Btn>

            <Btn variant="ghost" onClick={() => go("work-visa")}>
              Explore Work Visa <ArrowRight size={15} />
            </Btn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  WORK VISA + COUNTRY DETAIL                                       */
/* ------------------------------------------------------------------ */
function WorkVisaPage({ go }) {
  return (
    <PageShell theme="work">

      {/* HERO */}
      <PageHero
        theme="work"
        eyebrow="Work Visa Opportunities"
        h1="Work abroad. Build your future."
        sub="Explore work visa opportunities across Europe, the UK, New Zealand & UAE"
        desc="Explore country-specific work visa pathways and immigration requirements based on your profile, occupation and applicable rules."
      >
        <Btn
          variant="coral"
          onClick={() => scrollToId("wv-countries")}
        >
          Explore Countries ↓
        </Btn>

        <Btn
          variant="navy"
          onClick={() => go("contact")}
        >
          Get Free Consultation
        </Btn>
      </PageHero>


      {/* COUNTRY DESTINATIONS */}
      <Section style={{ paddingTop: 18, paddingBottom: 20 }}>

        <Anchor id="wv-countries" />

        <SectionHead
          eyebrow="Destinations"
          h2="Choose a destination"
          h3="Select a country to see who may be eligible, common work areas, documentation and the route requirements that apply."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 20,
            marginTop: 30,
          }}
          className="nc-work-country-grid"
        >
          {Object.entries(WORK_COUNTRIES).map(([key, c]) => (
            <WorkCountryCard
              key={key}
              c={c}
              onClick={() => go("work-country", key)}
            />
          ))}
        </div>

        <p
          style={{
            fontSize: 13,
            color: "#6b7689",
            marginTop: 18,
            lineHeight: 1.6,
          }}
        >
          Duration varies by route and employment conditions. Available roles
          may vary by employer, occupation and current demand.
        </p>

      </Section>


      {/* VISIT TO WORK CTA */}
      <Section style={{ paddingTop: 8, paddingBottom: 70 }}>

        <div
          onClick={() => go("visit-to-work")}
          style={{
            borderRadius: 20,
            padding: "30px 32px",
            cursor: "pointer",
            background: `linear-gradient(115deg, ${TEAL}, #0d6b62)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            boxShadow: "0 15px 35px rgba(13,107,98,0.18)",
          }}
        >

          <div>

            <div
              style={{
                color: SUN,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.2,
                marginBottom: 8,
              }}
            >
              ANOTHER PATHWAY
            </div>

            <div
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              Not eligible for a direct work visa?
            </div>

            <div
              style={{
                color: "rgba(255,255,255,0.84)",
                fontSize: 13.5,
                marginTop: 8,
                maxWidth: 580,
                lineHeight: 1.65,
              }}
            >
              Explore whether a lawful pathway may be available based on your
              destination and individual eligibility.
            </div>

          </div>

          <Btn
            variant="gold"
            onClick={() => go("visit-to-work")}
          >
            Explore Visit to Work
            <ArrowRight size={15} />
          </Btn>

        </div>

      </Section>

    </PageShell>
  );
}
function WorkCountryCard({ c, onClick }) {

  const [hover, setHover] = useState(false);

  const COUNTRY_IMAGES = {
    Spain:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",

    Italy:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",

    Germany:
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85",

    "New Zealand":
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=85",

    "United Kingdom":
      "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1200&q=85",

    UAE:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",

   Slovakia:
     "https://images.unsplash.com/photo-1602356862498-43139e75df4f?auto=format&fit=crop&w=1200&q=85",

Bulgaria:
     "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=1200&q=85",

Serbia:
     "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=85",
  };

  const image = COUNTRY_IMAGES[c.name];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid #e7eaf2",

        transform: hover
          ? "translateY(-6px)"
          : "translateY(0)",

        boxShadow: hover
          ? "0 22px 40px rgba(16,22,48,0.18)"
          : "0 7px 18px rgba(16,22,48,0.08)",

        transition:
          "transform .25s ease, box-shadow .25s ease",

        minWidth: 0,
      }}
    >

      {/* LANDMARK IMAGE */}
      <div
        style={{
          height: 155,
          position: "relative",
          overflow: "hidden",
          background: c.hero || "#dfe5ef",
        }}
      >

        {image && (
          <img
            src={image}
            alt={`${c.name} landmark`}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",

              transform: hover
                ? "scale(1.07)"
                : "scale(1)",

              transition:
                "transform .45s ease",

              filter:
                "saturate(1.05) contrast(1.02)",
            }}
          />
        )}

        {/* IMAGE OVERLAY */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(8,18,45,0.05) 25%, rgba(8,18,45,0.30) 100%)",
          }}
        />

        {/* FLAG */}
        <div
          role="img"
          aria-label={`${c.name} flag`}
          style={{
            position: "absolute",
            top: 12,
            left: 14,

            fontSize: 25,
            lineHeight: 1,

            background:
              "rgba(255,255,255,0.88)",

            backdropFilter:
              "blur(6px)",

            borderRadius: 9,

            width: 40,
            height: 40,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            boxShadow:
              "0 5px 15px rgba(0,0,0,0.14)",
          }}
        >
          {c.flag}
        </div>

      </div>


      {/* CARD INFORMATION */}
      <div
        style={{
          padding: "17px 20px 19px",
        }}
      >

        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.25,
          }}
        >
          {c.name}
        </div>

        <div
          style={{
            fontSize: 12.5,
            color: "#7a8699",
            marginTop: 3,
            fontWeight: 600,
          }}
        >
          Work Visa
        </div>

        <div
          style={{
            marginTop: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,

            color: CORAL,
            fontWeight: 800,
            fontSize: 13.5,
          }}
        >
          View Details

          <ArrowRight
            size={15}
            style={{
              transform: hover
                ? "translateX(5px)"
                : "translateX(0)",

              transition:
                "transform .2s ease",
            }}
          />
        </div>

      </div>

    </div>
  );
}
function DetailHero({ theme, flag, title, sub, back, backLabel, go }) {
  const t = PAGE_THEMES[theme] || PAGE_THEMES.about;
  return (
    <Section style={{ paddingTop: 52, paddingBottom: 26 }}>
      <div onClick={back} style={{ color: t.accent, fontSize: 13.5, cursor: "pointer", marginBottom: 16, fontWeight: 600 }}>
        &larr; {backLabel}
      </div>
      <Glass pad={34} style={{ maxWidth: 820 }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>{flag}</div>
        <h1 style={{ fontSize: 32, color: INK, margin: "14px 0 8px" }}>{title}</h1>
        {sub && <p style={{ color: "#4a5568", fontSize: 15, margin: 0, lineHeight: 1.7 }}>{sub}</p>}
      </Glass>
    </Section>
  );
}

function InfoBlock({ h, children }) {
  return (
    <Glass style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, color: INK, margin: "0 0 12px" }}>{h}</h2>
      {children}
    </Glass>
  );
}

function CountryDetailPage({ countryKey, go }) {
  const c = WORK_COUNTRIES[countryKey];
  if (!c) return null;
  return (
    <PageShell theme="work">
      <DetailHero
        theme="work" flag={c.flag} title={`${c.name} work visa opportunities`}
        sub={c.why} back={() => go("work-visa")} backLabel="Back to Work Visa"
      />

      <Section style={{ paddingTop: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 34 }} className="nc-2col">
          <div>
            <InfoBlock h="Who may be eligible?">
              <p style={{ color: "#3c485c", fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>{c.eligible}</p>
            </InfoBlock>

            <InfoBlock h="Common work areas">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {c.jobs.map((j, i) => (
                  <span key={i} style={{ background: "#fff", border: "1px solid #e7eaf2", borderRadius: 24, padding: "8px 15px", fontSize: 13, color: INK, fontWeight: 600 }}>{j}</span>
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: "#7a8699", marginTop: 14, marginBottom: 0, lineHeight: 1.6 }}>
                Available roles may vary by employer, occupation and current demand. NC Migration is a consultancy and is not the employer.
              </p>
            </InfoBlock>

            <InfoBlock h="Visa / work permission">
              <p style={{ color: "#3c485c", fontSize: 14.5, lineHeight: 1.8, margin: "0 0 10px" }}>{c.permission}</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", background: "#fff", borderRadius: 10, padding: "12px 15px", border: "1px solid #e7eaf2" }}>
                <Clock size={16} color={CORAL} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: INK, fontWeight: 600 }}>{c.duration}</span>
              </div>
            </InfoBlock>

            <InfoBlock h="Common documentation">
              <ul style={{ paddingLeft: 18, color: "#3c485c", fontSize: 14, lineHeight: 1.95, margin: 0 }}>
                <li>Valid passport and travel history</li>
                <li>Education certificates, where relevant to the route</li>
                <li>Work experience and reference documents</li>
                <li>An up-to-date CV</li>
                <li>Employer or sponsorship documents, where the route requires them</li>
                <li>Any additional documents specified by the relevant authority</li>
              </ul>
              <p style={{ fontSize: 12.5, color: "#7a8699", marginTop: 12, marginBottom: 0 }}>
                Exact requirements vary by route and are confirmed after a profile assessment.
              </p>
            </InfoBlock>

            <InfoBlock h="Eligibility considerations">
              <ul style={{ paddingLeft: 18, color: "#3c485c", fontSize: 14, lineHeight: 1.95, margin: 0 }}>
                <li>Your occupation and level of experience</li>
                <li>Qualification recognition, where the route requires it</li>
                <li>Language requirements, where applicable</li>
                <li>Employer sponsorship availability</li>
                <li>Your immigration and travel history</li>
                <li>Current rules in force at the time of application</li>
              </ul>
            </InfoBlock>
          </div>

          <div>
            <Glass style={{ position: "sticky", top: 96 }}>
              <h2 style={{ fontSize: 17, color: INK, margin: "0 0 14px" }}>How NC Migration helps</h2>
              {["Profile assessment", "Route and country guidance", "Documentation support", "Application preparation", "Ongoing support"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: i < 4 ? "1px solid #eceef4" : "none" }}>
                  <CheckCircle2 size={16} color={CORAL} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: "#3c485c" }}>{t}</span>
                </div>
              ))}
              <Btn variant="coral" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                {c.cta || "Check My Eligibility"} <ArrowRight size={15} />
              </Btn>
              <Btn variant="navy" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
                Get Free Consultation
              </Btn>
            </Glass>
            <div style={{ marginTop: 18 }}>
              <Disclaimer>
                Visa outcomes and job availability depend on eligibility, employer requirements and applicable immigration rules. Decisions are made by the relevant authorities and employers, not by NC Migration.
              </Disclaimer>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  VISITOR VISA                                                        */
/* ------------------------------------------------------------------ */
function VisitorCountryCard({ c, onClick }) {
  const [hover, setHover] = useState(false);

  const image =
    VISITOR_IMAGES[c.name] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #e3e8ef",
        boxShadow: hover
          ? "0 16px 30px rgba(16,22,48,0.16)"
          : "0 5px 14px rgba(16,22,48,0.07)",
        transform: hover
          ? "translateY(-5px)"
          : "translateY(0)",
        transition:
          "transform .22s ease, box-shadow .22s ease",
      }}
    >

      {/* IMAGE */}
      <div
        style={{
          height: 112,
          position: "relative",
          overflow: "hidden",
          background: "#dce8ed",
        }}
      >
        <img
          src={image}
          alt={`${c.name} destination`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hover ? "scale(1.08)" : "scale(1)",
            transition: "transform .45s ease",
          }}
        />

        {/* dark image overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.28))",
          }}
        />

        {/* FLAG */}
        <div
          role="img"
          aria-label={`${c.name} flag`}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 35,
            height: 35,
            borderRadius: 9,
            background: "rgba(255,255,255,0.90)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            boxShadow: "0 4px 10px rgba(0,0,0,0.14)",
          }}
        >
          {c.flag}
        </div>
      </div>


      {/* CONTENT */}
      <div
        style={{
          padding: "12px 13px 14px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: INK,
            lineHeight: 1.25,
          }}
        >
          {c.name}
        </div>

        <div
          style={{
            fontSize: 10.5,
            color: "#7a8699",
            marginTop: 3,
          }}
        >
          {c.label}
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: TEAL,
            fontSize: 11.5,
            fontWeight: 800,
          }}
        >
          View Details

          <ArrowRight
            size={13}
            style={{
              transform: hover
                ? "translateX(3px)"
                : "translateX(0)",
              transition: "transform .2s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function VisitorVisaPage({ go }) {
  const destinations = Object.entries(VISITOR_COUNTRIES);

  return (
    <PageShell theme="visitor">

      {/* ================= HERO ================= */}
      <Section style={{ paddingTop: 38, paddingBottom: 30 }}>
        <div
          className="nc-visitor-hero"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 26,
            minHeight: 350,
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(90deg, rgba(237,250,250,0.98) 0%, rgba(237,250,250,0.94) 42%, rgba(237,250,250,0.25) 72%), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90') center/cover",
            boxShadow: "0 18px 45px rgba(16,22,48,0.10)",
          }}
        >
          <div
            style={{
              width: "55%",
              padding: "42px 44px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Eyebrow>Visitor Visa & Tourist Visa Services</Eyebrow>

            <h1
              style={{
                fontSize: 32,
                lineHeight: 1.15,
                color: INK,
                margin: "0 0 12px",
                maxWidth: 520,
              }}
            >
              Explore the world with
              <br />
              NC Migration
            </h1>

            <h2
              style={{
                fontSize: 16,
                lineHeight: 1.5,
                color: "#4d5a70",
                margin: "0 0 12px",
                fontWeight: 700,
              }}
            >
              Visitor visa assistance for holidays, family visits & international travel.
            </h2>

            <p
              style={{
                color: "#536178",
                fontSize: 13.5,
                lineHeight: 1.7,
                margin: "0 0 20px",
                maxWidth: 570,
              }}
            >
              Guidance on visitor and tourist visa requirements,
              documentation and application preparation for popular
              destinations across Asia, Europe and beyond.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Btn
                variant="teal"
                onClick={() => scrollToId("vv-destinations")}
              >
                Explore Destinations ↓
              </Btn>

              <Btn
                variant="navy"
                onClick={() => go("contact")}
              >
                Get Free Consultation
              </Btn>
            </div>

            {/* TRUST POINTS */}
            <div
              style={{
                display: "flex",
                gap: 25,
                flexWrap: "wrap",
                marginTop: 25,
              }}
            >
              {[
                ["🛡️", "Trusted Guidance", "Authentic & Genuine Support"],
                ["🌐", "Multiple Destinations", "Asia, Europe & Beyond"],
                ["👥", "End-to-End Assistance", "Application to Decision"],
              ].map(([icon, title, sub], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      fontSize: 21,
                      lineHeight: 1,
                    }}
                  >
                    {icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        color: INK,
                      }}
                    >
                      {title}
                    </div>

                    <div
                      style={{
                        fontSize: 9.5,
                        color: "#7a8699",
                        marginTop: 2,
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative travel circle */}
          <div
            style={{
              position: "absolute",
              right: "-4%",
              bottom: "-28%",
              width: 470,
              height: 470,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45), rgba(255,255,255,0))",
            }}
          />
        </div>
      </Section>


      {/* ================= DESTINATIONS ================= */}
      <Section style={{ paddingTop: 12 }}>
        <Anchor id="vv-destinations" />

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 22,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Eyebrow>Destinations</Eyebrow>

            <h2
              style={{
                fontSize: 27,
                color: INK,
                margin: "0 0 5px",
              }}
            >
              Popular visitor visa destinations
            </h2>

            <p
              style={{
                color: "#647086",
                fontSize: 13.5,
                margin: 0,
              }}
            >
              Select a destination for visa overview, documentation
              categories and application guidance.
            </p>
          </div>

          <Btn
            variant="navy"
            onClick={() => scrollToId("vv-destinations")}
            style={{
              fontSize: 12.5,
            }}
          >
            View All Destinations <ArrowRight size={14} />
          </Btn>
        </div>


        <div
          className="nc-visitor-destination-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {destinations.map(([key, c]) => (
            <VisitorCountryCard
              key={key}
              c={c}
              onClick={() => go("visitor-country", key)}
            />
          ))}
        </div>
      </Section>


      {/* ================= SCHENGEN ================= */}
      <Section style={{ paddingTop: 30 }}>
        <div
          className="nc-schengen-banner"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(115deg, #21123f 0%, #651442 45%, #e0203a 100%)",
            padding: "32px 34px",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -60,
              width: 220,
              height: 220,
              border: "2px solid rgba(255,255,255,0.13)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr",
              gap: 30,
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
            className="nc-2col"
          >
            <div>
              <Eyebrow light>Europe</Eyebrow>

              <h2
                style={{
                  color: "#fff",
                  fontSize: 25,
                  margin: "0 0 10px",
                }}
              >
                Schengen visitor visa
              </h2>

              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  maxWidth: 540,
                  margin: "0 0 18px",
                }}
              >
                Explore Europe with a Schengen visitor visa, subject
                to destination-specific requirements and applicant
                eligibility.
              </p>

              <Btn
                variant="gold"
                onClick={() => go("visitor-country", "schengen")}
              >
                Explore Schengen Visa <ArrowRight size={15} />
              </Btn>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 9,
              }}
            >
              {SCHENGEN_MEMBERS.map(([f, n], i) => (
                <span
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 25,
                    padding: "8px 13px",
                    fontSize: 12,
                    color: "#fff",
                    fontWeight: 650,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 15 }}>{f}</span>
                  {n}
                </span>
              ))}

              <span
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 25,
                  padding: "8px 13px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 600,
                }}
              >
                and other Schengen destinations
              </span>
            </div>
          </div>
        </div>
      </Section>


      {/* ================= PACKAGES ================= */}
      <Section style={{ paddingTop: 32 }}>
        <SectionHead
          eyebrow="Application Support"
          h2="Visitor visa application packages"
          h3="Support tailored to who is travelling. Each package covers visa assistance, documentation guidance, application support and profile assessment."
        />

        <div
          className="nc-3col"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          {[
            [
              "👨‍👩‍👧",
              "Family Package",
              "For families applying together for holidays or family visit visas.",
              CORAL,
            ],
            [
              "👫",
              "Couple Package",
              "For couples travelling together on a shared itinerary.",
              TEAL,
            ],
            [
              "🧳",
              "Single Traveller",
              "For individual applicants planning an international trip.",
              SUN,
            ],
          ].map(([icon, title, desc, col], i) => (
            <Glass
              key={i}
              style={{
                borderTop: `4px solid ${col}`,
                padding: "23px 24px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 23,
                  }}
                >
                  {icon}
                </div>

                <h3
                  style={{
                    fontSize: 17,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: "#5a6577",
                  lineHeight: 1.6,
                  margin: "0 0 13px",
                }}
              >
                {desc}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: 7,
                }}
              >
                {[
                  "Visa assistance",
                  "Documentation guidance",
                  "Application support",
                  "Profile assessment",
                ].map((item, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#3c485c",
                      fontSize: 12.5,
                    }}
                  >
                    <CheckCircle2
                      size={15}
                      color={col}
                    />
                    {item}
                  </div>
                ))}
              </div>

              <Btn
                variant="navy"
                onClick={() => go("contact")}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 17,
                  fontSize: 12.5,
                }}
              >
                Get Consultation <ArrowRight size={14} />
              </Btn>
            </Glass>
          ))}
        </div>
      </Section>


      {/* ================= FINAL CTA ================= */}
      <Section style={{ paddingTop: 28, paddingBottom: 45 }}>
        <div
          className="nc-visitor-final-cta"
          style={{
            borderRadius: 22,
            overflow: "hidden",
            minHeight: 210,
            display: "flex",
            alignItems: "center",
            position: "relative",
            background:
              "linear-gradient(90deg, rgba(224,241,249,0.98) 0%, rgba(224,241,249,0.88) 48%, rgba(224,241,249,0.18) 100%), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85') center/cover",
          }}
        >
          <div
            style={{
              padding: "30px 38px",
              position: "relative",
              zIndex: 2,
            }}
          >
            <h2
              style={{
                fontSize: 24,
                color: INK,
                margin: "0 0 7px",
              }}
            >
              Ready to plan your next trip?
            </h2>

            <p
              style={{
                color: "#5d697d",
                fontSize: 13.5,
                margin: "0 0 15px",
              }}
            >
              Get expert guidance for your visitor visa and travel with confidence.
            </p>

            <Btn
              variant="teal"
              onClick={() => go("contact")}
            >
              Get Free Consultation <ArrowRight size={14} />
            </Btn>

            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              {[
                "✈️ Hassle-Free Process",
                "📄 Complete Documentation Support",
                "🎧 Expert Counsellors",
              ].map((x, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10.5,
                    color: "#4e5a70",
                    fontWeight: 600,
                  }}
                >
                  {x}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "20%",
              fontSize: 25,
              fontStyle: "italic",
              fontWeight: 700,
              color: "rgba(22,18,51,0.7)",
              transform: "rotate(-5deg)",
            }}
          >
            More Destinations
            <br />
            More Memories
          </div>
        </div>
      </Section>

    </PageShell>
  );
}

function VisitorCountryPage({ countryKey, go }) {
  const c = VISITOR_COUNTRIES[countryKey];
  if (!c) return null;
  const isSchengen = countryKey === "schengen" || countryKey === "switzerland";
  return (
    <PageShell theme="visitor">
      <DetailHero
        theme="visitor" flag={c.flag} title={`${c.name} ${c.label.toLowerCase()}`}
        sub={c.overview} back={() => go("visitor-visa")} backLabel="Back to Visitor Visa"
      />

      <Section style={{ paddingTop: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 34 }} className="nc-2col">
          <div>
            <InfoBlock h="Purpose of visit">
              <p style={{ color: "#3c485c", fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>{c.purpose}</p>
            </InfoBlock>

            {isSchengen && (
              <InfoBlock h="Schengen destinations">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SCHENGEN_MEMBERS.map(([f, n], i) => (
                    <span key={i} style={{ background: "#fff", border: "1px solid #e7eaf2", borderRadius: 24, padding: "7px 14px", fontSize: 12.5, color: INK, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span role="img" aria-label={`${n} flag`} style={{ fontSize: 15 }}>{f}</span>{n}
                    </span>
                  ))}
                </div>
              </InfoBlock>
            )}

            <InfoBlock h="General documentation categories">
              <ul style={{ paddingLeft: 18, color: "#3c485c", fontSize: 14, lineHeight: 1.95, margin: 0 }}>
                <li>Valid passport and previous travel history</li>
                <li>Proof of purpose of travel and itinerary</li>
                <li>Evidence of funds for the trip</li>
                <li>Accommodation details</li>
                <li>Employment, business or study status documents</li>
                <li>Ties to your home country</li>
                <li>Any additional documents specified by the relevant authority</li>
              </ul>
              <p style={{ fontSize: 12.5, color: "#7a8699", marginTop: 12, marginBottom: 0, lineHeight: 1.6 }}>
                Requirements and procedures vary depending on the country and applicant profile.
              </p>
            </InfoBlock>

            <InfoBlock h="Eligibility considerations">
              <ul style={{ paddingLeft: 18, color: "#3c485c", fontSize: 14, lineHeight: 1.95, margin: 0 }}>
                <li>Purpose and duration of your intended visit</li>
                <li>Financial position and supporting evidence</li>
                <li>Travel and immigration history</li>
                <li>Ties to your home country</li>
                <li>Completeness and consistency of your documentation</li>
              </ul>
            </InfoBlock>

            <InfoBlock h="Application guidance">
              {VISIT_STEPS.map((st, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: i === VISIT_STEPS.length - 1 ? 0 : 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: TEAL, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: INK, fontSize: 14.5 }}>{st.title}</div>
                    <div style={{ color: "#5a6577", fontSize: 13, marginTop: 3, lineHeight: 1.6 }}>{st.desc}</div>
                  </div>
                </div>
              ))}
            </InfoBlock>
          </div>

          <div>
            <Glass style={{ position: "sticky", top: 96 }}>
              <h2 style={{ fontSize: 17, color: INK, margin: "0 0 14px" }}>How NC Migration helps</h2>
              {["Profile assessment", "Documentation guidance", "Application preparation", "Application support"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: i < 3 ? "1px solid #eceef4" : "none" }}>
                  <CheckCircle2 size={16} color={TEAL} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: "#3c485c" }}>{t}</span>
                </div>
              ))}
              <Btn variant="teal" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                Get Consultation <ArrowRight size={15} />
              </Btn>
            </Glass>
            <div style={{ marginTop: 18 }}>
              <Disclaimer>
                Requirements, processing and outcomes vary by country and applicant profile. Visa decisions are made by the relevant embassy or immigration authority.
              </Disclaimer>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/*  VISIT TO WORK                                                       */
/* ------------------------------------------------------------------ */

function VisitToWorkPage({ go }) {
  const destinations = [
    {
      key: "uk",
      name: "United Kingdom",
      flag: "🇬🇧",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    },
    {
      key: "spain",
      name: "Spain",
      flag: "🇪🇸",
      image:
        "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",
    },
    {
      key: "germany",
      name: "Germany",
      flag: "🇩🇪",
      image:
        "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=85",
    },
    {
      key: "greece",
      name: "Greece",
      flag: "🇬🇷",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
    },
    {
      key: "italy",
      name: "Italy",
      flag: "🇮🇹",
      image:
        "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=85",
    },
    {
      key: "lithuania",
      name: "Lithuania",
      flag: "🇱🇹",
      image:
        "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  return (
    <PageShell theme="pathway">

      <style>{`
        .nc-v2w-hero {
          min-height: 400px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(
              90deg,
              rgba(255,255,255,0.98) 0%,
              rgba(255,255,255,0.94) 40%,
              rgba(255,255,255,0.50) 67%,
              rgba(255,255,255,0.05) 100%
            ),
            url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2200&q=90")
            center/cover;
          box-shadow: 0 10px 30px rgba(16,22,48,0.08);
        }

        .nc-v2w-hero-content {
          width: 58%;
          padding: 58px 48px;
          position: relative;
          z-index: 2;
        }

        .nc-v2w-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 28px;
          max-width: 720px;
        }

        .nc-v2w-feature {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .nc-v2w-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #eef4ff;
          color: #1762d1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 19px;
        }

        .nc-v2w-destination-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .nc-v2w-card {
          background: #fff;
          border: 1px solid #e2e7ef;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(16,22,48,0.07);
          transition: transform .22s ease, box-shadow .22s ease;
        }

        .nc-v2w-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 36px rgba(16,22,48,0.15);
        }

        .nc-v2w-card-image {
          height: 185px;
          position: relative;
          overflow: hidden;
        }

        .nc-v2w-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .4s ease;
        }

        .nc-v2w-card:hover .nc-v2w-card-image img {
          transform: scale(1.06);
        }

        .nc-v2w-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.02),
            rgba(0,0,0,0.30)
          );
        }

        .nc-v2w-flag {
          position: absolute;
          top: 13px;
          left: 14px;
          width: 43px;
          height: 43px;
          border-radius: 11px;
          background: rgba(255,255,255,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.14);
        }

        .nc-v2w-card-body {
          padding: 17px 20px 20px;
        }

        .nc-v2w-card-title {
          font-size: 17px;
          font-weight: 800;
          color: #182033;
        }

        .nc-v2w-card-subtitle {
          font-size: 12.5px;
          color: #7a8699;
          margin-top: 4px;
          font-weight: 600;
        }

        .nc-v2w-card-link {
          margin-top: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #c9700e;
          font-weight: 800;
          font-size: 13px;
        }

        .nc-v2w-eligibility {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .nc-v2w-cta {
          margin-top: 30px;
          border-radius: 19px;
          padding: 26px 28px;
          background: linear-gradient(100deg, #e8f3ff, #dceeff);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        @media (max-width: 1000px) {
          .nc-v2w-hero-content {
            width: 72%;
          }

          .nc-v2w-destination-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nc-v2w-eligibility {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .nc-v2w-hero {
            min-height: 500px;
            background:
              linear-gradient(
                90deg,
                rgba(255,255,255,0.97),
                rgba(255,255,255,0.78)
              ),
              url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=85")
              center/cover;
          }

          .nc-v2w-hero-content {
            width: 100%;
            padding: 38px 25px;
          }

          .nc-v2w-hero h1 {
            font-size: 32px !important;
          }

          .nc-v2w-features {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .nc-v2w-destination-grid {
            grid-template-columns: 1fr;
          }

          .nc-v2w-eligibility {
            grid-template-columns: 1fr;
          }

          .nc-v2w-cta {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* HERO */}
      <Section style={{ paddingTop: 24, paddingBottom: 18 }}>
        <div className="nc-v2w-hero">
          <div className="nc-v2w-hero-content">

            <div
              style={{
                color: CORAL,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Visit to Work
            </div>

            <h1
              style={{
                fontSize: 42,
                lineHeight: 1.08,
                color: INK,
                margin: "12px 0 10px",
                fontWeight: 850,
              }}
            >
              Explore Legal Pathways
              <br />
              <span style={{ color: "#1762d1" }}>
                from Visit to Work
              </span>
            </h1>

            <p
              style={{
                color: "#4d5a70",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 650,
                margin: 0,
              }}
            >
              Discover countries where different immigration pathways may
              be available based on your profile and eligibility. Each
              destination has its own rules and requirements.
            </p>

            <div className="nc-v2w-features">

              <div className="nc-v2w-feature">
                <div className="nc-v2w-icon">🌐</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                    Country-Specific
                  </div>
                  <div style={{ fontSize: 13, color: "#59677c" }}>
                    Guidance
                  </div>
                </div>
              </div>

              <div className="nc-v2w-feature">
                <div className="nc-v2w-icon">📄</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                    Latest Immigration
                  </div>
                  <div style={{ fontSize: 13, color: "#59677c" }}>
                    Rules
                  </div>
                </div>
              </div>

              <div className="nc-v2w-feature">
                <div className="nc-v2w-icon">🛡️</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: INK }}>
                    Personalised
                  </div>
                  <div style={{ fontSize: 13, color: "#59677c" }}>
                    Assessment
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </Section>

      {/* DISCLAIMER */}
      <Section style={{ paddingTop: 6 }}>
        <Disclaimer>
          A visitor visa does not itself permit work. Work requires the
          appropriate visa, work authorisation or residence permit required
          by the destination country. We do not advise or assist with
          working without the correct authorisation.
        </Disclaimer>
      </Section>

      {/* DESTINATIONS */}
      <Section style={{ paddingTop: 22 }}>
        <SectionHead
          eyebrow="Destinations"
          h2="Explore Visit to Work destinations"
          h3="Select a destination to understand the pathway position and what is assessed. Subject to immigration rules and individual eligibility."
        />

        <div className="nc-v2w-destination-grid">

          {destinations.map((d) => (
            <div
              key={d.key}
              className="nc-v2w-card"
              onClick={() => go("visit-to-work-country", d.key)}
            >
              <div className="nc-v2w-card-image">

                <img
                  src={d.image}
                  alt={`${d.name} destination`}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="nc-v2w-card-overlay" />

                <div className="nc-v2w-flag">
                  {d.flag}
                </div>

              </div>

              <div className="nc-v2w-card-body">

                <div className="nc-v2w-card-title">
                  {d.name}
                </div>

                <div className="nc-v2w-card-subtitle">
                  Work Visa
                </div>

                <div className="nc-v2w-card-link">
                  View Details
                  <ArrowRight size={14} />
                </div>

              </div>
            </div>
          ))}

        </div>

        <p
          style={{
            fontSize: 13,
            color: "#6b7689",
            marginTop: 18,
          }}
        >
          Other eligible destinations may also be available depending
          on your profile. Speak with our team for an individual assessment.
        </p>
      </Section>

      {/* ELIGIBILITY */}
      <Section style={{ paddingTop: 24 }}>

        <SectionHead
          eyebrow="Eligibility"
          h2="Who should get a profile assessment?"
          h3="We review your circumstances before suggesting whether any lawful pathway may apply."
        />

        <div className="nc-v2w-eligibility">

          {[
            "Existing visitor status",
            "Travel history",
            "Education",
            "Work experience",
            "Professional background",
            "Immigration history",
            "Intended destination",
            "Potential employment pathway",
          ].map((text, index) => (
            <Glass
              key={index}
              pad={18}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <CheckCircle2
                size={17}
                color="#1762d1"
                style={{ flexShrink: 0 }}
              />

              <span
                style={{
                  fontSize: 13.5,
                  color: INK,
                  fontWeight: 600,
                }}
              >
                {text}
              </span>
            </Glass>
          ))}

        </div>

      </Section>

      {/* CTA */}
      <Section style={{ paddingTop: 18, paddingBottom: 45 }}>

        <div className="nc-v2w-cta">

          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: INK,
              }}
            >
              Not sure if you're eligible?
            </div>

            <div
              style={{
                fontSize: 13.5,
                color: "#59677c",
                marginTop: 5,
              }}
            >
              Speak with our experts for a personalised assessment
              based on your profile and goals.
            </div>
          </div>

          <Btn
            variant="navy"
            onClick={() => go("contact")}
          >
            Get Free Consultation
            <ArrowRight size={15} />
          </Btn>

        </div>

      </Section>

    </PageShell>
  );
}

function VisitToWorkCountryPage({ countryKey, go }) {
  const c = VISIT_TO_WORK_OPTIONS[countryKey];
  if (!c) return null;
  return (
    <PageShell theme="pathway">
      <DetailHero
        theme="pathway" flag={c.flag} title={`${c.name} \u2014 work pathway guidance`}
        back={() => go("visit-to-work")} backLabel="Back to Visit to Work"
      />

      <Section style={{ paddingTop: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 34 }} className="nc-2col">
          <div>
            <InfoBlock h="Possible pathway position">
              <p style={{ color: "#3c485c", fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>{c.pathway}</p>
            </InfoBlock>

            <InfoBlock h="What is assessed">
              <ul style={{ paddingLeft: 18, color: "#3c485c", fontSize: 14, lineHeight: 1.95, margin: 0 }}>
                {c.considerations.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </InfoBlock>

            <InfoBlock h="Important to understand">
              <p style={{ color: "#3c485c", fontSize: 14.5, lineHeight: 1.8, margin: 0 }}>
                Visitor status does not permit work. Where a work route exists, it must be applied for correctly — in some cases only from outside the country. We assess your profile against the rules in force and explain what is genuinely available to you, including when no route currently applies.
              </p>
            </InfoBlock>
          </div>

          <div>
            <Glass style={{ position: "sticky", top: 96 }}>
              <h2 style={{ fontSize: 17, color: INK, margin: "0 0 14px" }}>Next step</h2>
              <p style={{ fontSize: 13.5, color: "#5a6577", lineHeight: 1.7, margin: "0 0 16px" }}>
                A profile assessment is the only way to know whether a lawful pathway may apply to your circumstances.
              </p>
              <Btn variant="gold" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center" }}>
                Check Eligibility <ArrowRight size={15} />
              </Btn>
              <Btn variant="navy" onClick={() => go("contact")} style={{ width: "100%", justifyContent: "center", marginTop: 10 }}>
                Get Free Consultation
              </Btn>
            </Glass>
            <div style={{ marginTop: 18 }}>
              <Disclaimer>
                Subject to immigration rules and individual eligibility. A visitor visa does not automatically provide permission to work, and no pathway or outcome is guaranteed.
              </Disclaimer>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function UKVisaExtensionPage({ go }) {
  const rtwResults = [
    {
      image: "/rtw-approval-1.jpeg",
      title: "RTW approval ⚡",
    },
    {
      image: "/rtw-approval-2.jpeg",
      title: "Full time RTW ⚡",
    },
    {
      image: "/rtw-approval-3.jpeg",
      title: "Full time RTW ⚡",
    },
  ];

  const clientTypes = [
    {
      title: "Active Visa Holder",
      badge: "Guidance Available",
      description:
        "You currently hold valid UK immigration permission and want to extend, switch or check your right to work.",
      items: [
        "Students",
        "Dependants",
        "Work visa holders",
        "Graduate / PSW holders",
        "Existing right to work holders",
        "Share Code holders",
      ],
      button: "Assess My Options",
      color: "#1762d1",
      soft: "#eaf3ff",
      icon: "💼",
    },
    {
      title: "Overstayer",
      badge: "Support Available",
      description:
        "You have stayed in the UK beyond the permitted period and need to understand your status and possible next steps.",
      items: [
        "Overstayed on student visa",
        "Overstayed on work visa",
        "Overstayed on visitor visa",
        "Previous refusal or curtailment",
        "Need advice on next steps",
        "Explore possible legal options",
      ],
      button: "Get Overstayer Assessment",
      color: "#ff3f3f",
      soft: "#fff0f0",
      icon: "👤",
    },
    {
      title: "Visitor Visa Holder",
      badge: "Guidance Available",
      description:
        "You are currently in the UK on a visitor visa and want to understand your options.",
      items: [
        "Current visitor visa holder",
        "Looking to switch to a work visa",
        "Eligible routes and requirements",
        "Switching options from within the UK",
        "Supporting documents guidance",
        "Personalised assessment",
      ],
      button: "Discuss My Options",
      color: "#08a99c",
      soft: "#e9faf7",
      icon: "💼",
    },
  ];

  const supportItems = [
    "UK visa extension options",
    "Right to Work assessment",
    "Share Code guidance",
    "eVisa / immigration status guidance",
    "Skilled Worker visa eligibility",
    "Certificate of Sponsorship guidance",
    "Immigration route assessment",
    "Documentation support",
  ];

  const processSteps = [
    {
      number: "01",
      title: "Profile assessment",
      desc: "We review your background and circumstances.",
    },
    {
      number: "02",
      title: "Immigration status review",
      desc: "We establish your current and previous status.",
    },
    {
      number: "03",
      title: "Eligibility & route guidance",
      desc: "We explain which routes may realistically apply.",
    },
    {
      number: "04",
      title: "Documentation & application support",
      desc: "We support you through preparation and submission.",
    },
  ];

  return (
    <PageShell theme="uk">

      <style>{`
        .nc-uk-page {
          background:
            radial-gradient(circle at 10% 10%, rgba(85,120,255,0.08), transparent 28%),
            radial-gradient(circle at 90% 25%, rgba(0,190,180,0.06), transparent 25%),
            #f7f9ff;
        }

        .nc-uk-hero {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          display: flex;
          align-items: center;
          background:
            linear-gradient(
              90deg,
              rgba(247,249,255,0.98) 0%,
              rgba(247,249,255,0.95) 34%,
              rgba(247,249,255,0.70) 55%,
              rgba(247,249,255,0.12) 100%
            ),
            url("https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=2200&q=90")
            center/cover;
        }

        .nc-uk-hero-inner {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 65px 0 58px;
          position: relative;
          z-index: 2;
        }

        .nc-uk-hero-copy {
          max-width: 610px;
        }

        .nc-uk-feature-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 32px;
          max-width: 730px;
        }

        .nc-uk-feature {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .nc-uk-feature-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #eaf2ff;
          color: #1762d1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          flex-shrink: 0;
        }

        .nc-uk-section {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .nc-uk-client-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .nc-uk-client-card {
          background: #fff;
          border-radius: 17px;
          padding: 25px;
          border: 1px solid #e2e7f0;
          box-shadow: 0 7px 22px rgba(20,32,65,0.07);
          display: flex;
          flex-direction: column;
          min-height: 410px;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .nc-uk-client-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(20,32,65,0.13);
        }

        .nc-uk-client-top {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 15px;
        }

        .nc-uk-client-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .nc-uk-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 20px;
          padding: 5px 10px;
          font-size: 10px;
          font-weight: 800;
          margin-top: 5px;
        }

        .nc-uk-list {
          margin: 14px 0 20px;
          padding: 0;
          list-style: none;
        }

        .nc-uk-list li {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 8px 0;
          font-size: 13px;
          color: #46536a;
        }

        .nc-uk-check {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .nc-uk-client-btn {
          width: 100%;
          border: 0;
          border-radius: 28px;
          color: #fff;
          padding: 13px 18px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          margin-top: auto;
          transition: transform .18s ease, filter .18s ease;
        }

        .nc-uk-client-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
        }

        .nc-uk-results {
          margin-top: 28px;
          border-radius: 20px;
          padding: 24px;
          background: linear-gradient(135deg,#edf6ff,#f8fbff);
          border: 1px solid #d9e7fb;
        }

        .nc-uk-results-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .nc-uk-trust {
          background: #fff;
          border: 1px solid #dce8e8;
          border-radius: 24px;
          padding: 9px 13px;
          color: #078b76;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .nc-uk-results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .nc-uk-result-card {
          background: #fff;
          border: 1px solid #9bc5ef;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 14px rgba(20,45,80,0.05);
        }

        .nc-uk-result-header {
          background: #1175c9;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          padding: 8px 12px;
        }

        .nc-uk-result-image-wrap {
          background: #fff;
          height: 275px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .nc-uk-result-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .nc-uk-result-body {
          padding: 13px 14px 15px;
        }

        .nc-uk-result-title {
          display: inline-block;
          background: #050505;
          color: #fff;
          border-radius: 20px;
          padding: 7px 12px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .nc-uk-result-body p {
          margin: 0 0 10px;
          color: #26334a;
          font-size: 11.5px;
          line-height: 1.55;
        }

        .nc-uk-result-conditions {
          font-weight: 800;
          font-size: 11.5px;
          margin: 8px 0 5px;
          color: #182033;
        }

        .nc-uk-result-link {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          color: #1671be;
          text-decoration: underline;
          font-size: 11.5px;
          font-weight: 600;
        }

        .nc-uk-support-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .nc-uk-support-card {
          background: #fff;
          border-radius: 13px;
          padding: 17px;
          border: 1px solid #e6e9f1;
          display: flex;
          gap: 9px;
          align-items: center;
          box-shadow: 0 4px 13px rgba(20,32,65,0.04);
          font-size: 12.5px;
          font-weight: 700;
          color: #1c2540;
        }

        .nc-uk-support-check {
          width: 18px;
          height: 18px;
          border: 2px solid #6573ff;
          border-radius: 50%;
          color: #6573ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }

        .nc-uk-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .nc-uk-process-card {
          background: #fff;
          border-radius: 15px;
          padding: 20px;
          border: 1px solid #e2e7ef;
          min-height: 145px;
        }

        .nc-uk-process-number {
          color: #ff4d3d;
          font-size: 24px;
          font-weight: 900;
        }

        .nc-uk-process-title {
          color: #182033;
          font-size: 13.5px;
          font-weight: 800;
          margin-top: 8px;
        }

        .nc-uk-process-desc {
          color: #68758b;
          font-size: 12px;
          line-height: 1.55;
          margin-top: 7px;
        }

        @media (max-width: 950px) {
          .nc-uk-client-grid {
            grid-template-columns: 1fr;
          }

          .nc-uk-results-grid {
            grid-template-columns: 1fr;
          }

          .nc-uk-support-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nc-uk-process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nc-uk-hero-copy {
            max-width: 650px;
          }
        }

        @media (max-width: 650px) {
          .nc-uk-hero {
            min-height: 590px;
            background:
              linear-gradient(
                90deg,
                rgba(247,249,255,0.97),
                rgba(247,249,255,0.84)
              ),
              url("https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1600&q=85")
              center/cover;
          }

          .nc-uk-hero-inner {
            width: calc(100% - 30px);
            padding: 45px 0;
          }

          .nc-uk-feature-row {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .nc-uk-support-grid,
          .nc-uk-process-grid {
            grid-template-columns: 1fr;
          }

          .nc-uk-section {
            width: calc(100% - 30px);
          }

          .nc-uk-results {
            padding: 16px;
          }

          .nc-uk-results-head {
            flex-direction: column;
          }

          .nc-uk-trust {
            white-space: normal;
          }

          .nc-uk-result-image-wrap {
            height: 350px;
          }
        }
      `}</style>

      <div className="nc-uk-page">

        {/* HERO */}
        <div className="nc-uk-hero">
          <div className="nc-uk-hero-inner">

            <div className="nc-uk-hero-copy">

              <div
                style={{
                  color: "#ff4b3f",
                  fontSize: 13,
                  fontWeight: 850,
                  letterSpacing: 0.7,
                  textTransform: "uppercase",
                }}
              >
                UK Visa Extension & Right to Work
              </div>

              <h1
                style={{
                  fontSize: 43,
                  lineHeight: 1.05,
                  margin: "10px 0 8px",
                  color: INK,
                  fontWeight: 900,
                }}
              >
                UK visa extension &
                <br />
                <span style={{ color: "#1762d1" }}>
                  right to work guidance
                </span>
              </h1>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 750,
                  color: "#516078",
                  marginBottom: 10,
                }}
              >
                Understand your UK immigration options
              </div>

              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "#536078",
                  maxWidth: 570,
                  margin: 0,
                }}
              >
                We assist eligible clients in understanding UK visa
                extension options, right-to-work status, Share Code /
                eVisa guidance and possible immigration pathways based
                on their individual circumstances.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                <Btn
                  variant="gold"
                  onClick={() => scrollToId("uk-clients")}
                >
                  Check My UK Options <ArrowRight size={15} />
                </Btn>

                <Btn
                  variant="navy"
                  onClick={() => go("contact")}
                >
                  Get Free Consultation <ArrowRight size={15} />
                </Btn>
              </div>

              <div className="nc-uk-feature-row">

                <div className="nc-uk-feature">
                  <div className="nc-uk-feature-icon">♙</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: INK }}>
                      Expert Guidance
                    </div>
                    <div style={{ fontSize: 11.5, color: "#68758b" }}>
                      Up-to-date information
                    </div>
                  </div>
                </div>

                <div className="nc-uk-feature">
                  <div className="nc-uk-feature-icon">♧</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: INK }}>
                      Personalised Support
                    </div>
                    <div style={{ fontSize: 11.5, color: "#68758b" }}>
                      Based on your profile
                    </div>
                  </div>
                </div>

                <div className="nc-uk-feature">
                  <div className="nc-uk-feature-icon">▢</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: INK }}>
                      Trusted & Genuine
                    </div>
                    <div style={{ fontSize: 11.5, color: "#68758b" }}>
                      Genuine client support
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* CLIENT TYPES */}
        <div
          className="nc-uk-section"
          id="uk-clients"
          style={{ paddingTop: 30 }}
        >

          <div
            style={{
              color: "#ff4b3f",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.7,
              textTransform: "uppercase",
            }}
          >
            Client Types
          </div>

          <h2
            style={{
              fontSize: 28,
              color: INK,
              margin: "5px 0 5px",
              fontWeight: 900,
            }}
          >
            Which situation describes you?
          </h2>

          <p
            style={{
              color: "#637088",
              fontSize: 13.5,
              margin: "0 0 20px",
            }}
          >
            We work with three broad groups. Your route depends on your
            current status and immigration history.
          </p>

          <div className="nc-uk-client-grid">

            {clientTypes.map((client, index) => (
              <div
                key={index}
                className="nc-uk-client-card"
                style={{
                  borderTop: `4px solid ${client.color}`,
                }}
              >

                <div className="nc-uk-client-top">

                  <div
                    className="nc-uk-client-icon"
                    style={{
                      background: client.soft,
                    }}
                  >
                    {client.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 850,
                        color: INK,
                      }}
                    >
                      {client.title}
                    </div>

                    <div
                      className="nc-uk-badge"
                      style={{
                        background: client.soft,
                        color: client.color,
                      }}
                    >
                      {client.badge}
                    </div>
                  </div>

                </div>

                <p
                  style={{
                    color: "#59677d",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {client.description}
                </p>

                <ul className="nc-uk-list">

                  {client.items.map((item, itemIndex) => (
                    <li key={itemIndex}>

                      <span
                        className="nc-uk-check"
                        style={{
                          color: client.color,
                          border: `1.5px solid ${client.color}`,
                        }}
                      >
                        ✓
                      </span>

                      {item}

                    </li>
                  ))}

                </ul>

                <button
                  className="nc-uk-client-btn"
                  style={{
                    background: client.color,
                  }}
                  onClick={() => go("contact")}
                >
                  {client.button}
                  <span style={{ marginLeft: 7 }}>→</span>
                </button>

              </div>
            ))}

          </div>
        </div>

        {/* REAL RTW RESULTS */}
        <div
          className="nc-uk-section"
          style={{ paddingTop: 28 }}
        >

          <div className="nc-uk-results">

            <div className="nc-uk-results-head">

              <div>

                <div
                  style={{
                    color: "#1762d1",
                    fontSize: 12,
                    fontWeight: 850,
                    letterSpacing: 0.7,
                  }}
                >
                  REAL RIGHT TO WORK RESULTS
                </div>

                <h2
                  style={{
                    color: INK,
                    fontSize: 25,
                    margin: "4px 0 5px",
                    fontWeight: 900,
                  }}
                >
                  Recent UKVI{" "}
                  <span style={{ color: "#1762d1" }}>
                    Right to Work Approvals
                  </span>
                </h2>

                <p
                  style={{
                    color: "#617087",
                    fontSize: 12.5,
                    margin: 0,
                  }}
                >
                  Our clients are receiving Right to Work (RTW)
                  approvals across different categories.
                </p>

              </div>

              <div className="nc-uk-trust">
                ● Genuine Results • Real People • Real Approvals
              </div>

            </div>

            <div className="nc-uk-results-grid">

              {rtwResults.map((result, index) => (
                <div
                  className="nc-uk-result-card"
                  key={index}
                >

                  <div className="nc-uk-result-header">
                    Right to work
                  </div>

                  <div className="nc-uk-result-image-wrap">
                    <img
                      src={result.image}
                      alt={`Right to Work result ${index + 1}`}
                      className="nc-uk-result-image"
                    />
                  </div>

                  <div className="nc-uk-result-body">

                    <div className="nc-uk-result-title">
                      {result.title}
                    </div>

                    <p>
                      You can work in the UK until you receive a
                      decision on your application or the outcome of
                      any appeal on your application to the EU
                      Settlement Scheme.
                    </p>

                    <div className="nc-uk-result-conditions">
                      Conditions
                    </div>

                    <p>
                      You can work in any job.
                    </p>

                    <p>
                      You will need to prove your right to work again
                      in 6 months, or if you change jobs.
                    </p>

                    <div className="nc-uk-result-link">
                      ▶ Legal basis of Certificate of Application
                    </div>

                  </div>

                </div>
              ))}

            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 9,
                  borderRadius: 10,
                  background: "#1762d1",
                }}
              />
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#cdd7e8",
                }}
              />
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#cdd7e8",
                }}
              />
            </div>

          </div>
        </div>

        {/* SUPPORT */}
        <div
          className="nc-uk-section"
          style={{ paddingTop: 28 }}
        >

          <div
            style={{
              color: "#ff4b3f",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.7,
              textTransform: "uppercase",
            }}
          >
            Support
          </div>

          <h2
            style={{
              color: INK,
              fontSize: 25,
              margin: "4px 0 16px",
              fontWeight: 900,
            }}
          >
            What we can help you understand
          </h2>

          <div className="nc-uk-support-grid">

            {supportItems.map((item, index) => (
              <div
                className="nc-uk-support-card"
                key={index}
              >
                <span className="nc-uk-support-check">
                  ✓
                </span>

                {item}
              </div>
            ))}

          </div>

        </div>

        {/* PROCESS */}
        <div
          className="nc-uk-section"
          style={{
            paddingTop: 28,
            paddingBottom: 38,
          }}
        >

          <div
            style={{
              color: "#ff4b3f",
              fontSize: 12,
              fontWeight: 850,
              letterSpacing: 0.7,
              textTransform: "uppercase",
            }}
          >
            Process
          </div>

          <h2
            style={{
              color: INK,
              fontSize: 25,
              margin: "4px 0 16px",
              fontWeight: 900,
            }}
          >
            A simple four-step process
          </h2>

          <div className="nc-uk-process-grid">

            {processSteps.map((step, index) => (
              <div
                className="nc-uk-process-card"
                key={index}
              >

                <div className="nc-uk-process-number">
                  {step.number}
                </div>

                <div className="nc-uk-process-title">
                  {step.title}
                </div>

                <div className="nc-uk-process-desc">
                  {step.desc}
                </div>

              </div>
            ))}

          </div>

          <div style={{ marginTop: 18 }}>
            <Disclaimer>
              Eligibility depends on your immigration history, current
              status and applicable UK immigration rules. We assess your
              profile before recommending an available route.
              Immigration decisions are made by the Home Office, not by
              NC Migration.
            </Disclaimer>
          </div>

          <Btn
            variant="gold"
            onClick={() => go("contact")}
            style={{ marginTop: 20 }}
          >
            Check My UK Visa Options
            <ArrowRight size={15} />
          </Btn>

        </div>

      </div>

    </PageShell>
  );
}

function AboutPage({ go }) {
  const services = [
    {
      title: "UK VISA EXTENSION & 1 YEAR WORK VISA",
      subtitle: "EXTEND YOUR UK VISA",
      description:
        "Extend your UK visa and understand your Right to Work options. Guidance for eligible active RTW holders, overstayers and visitor visa holders based on their individual circumstances.",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
      color: "#1762d1",
      route: "uk-extension",
      flags: ["🇬🇧", "🇺🇸", "🇩🇪", "🇦🇺", "🇳🇿"],
    },
    {
      title: "WORK VISA",
      subtitle: "GLOBAL CAREER OPPORTUNITIES",
      description:
        "Explore international career opportunities through work visa routes, employer sponsorship and eligible employment pathways.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
      color: "#08a99c",
      route: "work-visa",
      flags: ["🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇦🇪"],
    },
    {
      title: "VISITOR / TOURIST VISA",
      subtitle: "TRAVEL WITH CONFIDENCE",
      description:
        "Plan holidays, family visits or international trips with visitor and tourist visa assistance for multiple destinations.",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85",
      color: "#f5b400",
      route: "visitor-visa",
      flags: ["🇬🇧", "🇪🇺", "🇸🇬", "🇲🇾", "🇦🇺"],
    },
    {
      title: "VISIT TO WORK",
      subtitle: "LEGAL IMMIGRATION PATHWAYS",
      description:
        "Explore lawful immigration pathways where available. We help you understand whether a route may apply to your circumstances and destination.",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
      color: "#7254d8",
      route: "visit-to-work",
      flags: ["🇬🇧", "🇩🇪", "🇪🇸", "🇮🇹", "🇱🇹"],
    },
    {
      title: "FAMILY & DEPENDANTS",
      subtitle: "BRING YOUR FAMILY TOGETHER",
      description:
        "Guidance for eligible family members and dependant visa pathways, including spouse, partner and child applications.",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85",
      color: "#ef476f",
      route: "contact",
      flags: ["🇬🇧", "🇨🇦", "🇦🇺", "🇩🇪", "🇦🇪"],
    },
    {
      title: "SKILLED WORKER VISA",
      subtitle: "BUILD YOUR CAREER ABROAD",
      description:
        "Explore skilled employment routes, sponsorship requirements and documentation based on your occupation and profile.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
      color: "#00a98f",
      route: "work-visa",
      flags: ["🇬🇧", "🇩🇪", "🇦🇺", "🇨🇦", "🇦🇪"],
    },
    {
      title: "BUSINESS & INVESTOR VISA",
      subtitle: "GROW YOUR GLOBAL BUSINESS",
      description:
        "Explore business, entrepreneur and investor immigration pathways across selected international destinations.",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
      color: "#f59e0b",
      route: "contact",
      flags: ["🇬🇧", "🇺🇸", "🇨🇦", "🇦🇪", "🇸🇬"],
    },
    {
      title: "STUDY & INTERNATIONAL EDUCATION",
      subtitle: "STUDY ABROAD",
      description:
        "Explore international education options, university applications, documentation and student visa guidance.",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
      color: "#3b82f6",
      route: "contact",
      flags: ["🇨🇦", "🇬🇧", "🇦🇺", "🇳🇿", "🇺🇸"],
    },
  ];

  const countries = [
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      image:
        "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      image:
        "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "New Zealand",
      flag: "🇳🇿",
      image:
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      image:
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Italy",
      flag: "🇮🇹",
      image:
        "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Spain",
      flag: "🇪🇸",
      image:
        "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Greece",
      flag: "🇬🇷",
      image:
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Lithuania",
      flag: "🇱🇹",
      image:
        "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Slovakia",
      flag: "🇸🇰",
      image:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Bulgaria",
      flag: "🇧🇬",
      image:
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Serbia",
      flag: "🇷🇸",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Switzerland",
      flag: "🇨🇭",
      image:
        "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "UAE",
      flag: "🇦🇪",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Singapore",
      flag: "🇸🇬",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Malaysia",
      flag: "🇲🇾",
      image:
        "https://images.unsplash.com/photo-1508039136-8e6f8b8a3a8b?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Thailand",
      flag: "🇹🇭",
      image:
        "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Vietnam",
      flag: "🇻🇳",
      image:
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "United States",
      flag: "🇺🇸",
      image:
        "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const stats = [
    ["5000+", "Successful Clients"],
    ["98%", "Client Satisfaction"],
    ["10+", "Countries Covered"],
    ["24/7", "Client Support"],
  ];

  const process = [
    {
      n: "01",
      title: "Initial Consultation",
      text: "Understand your goals, background and immigration requirements.",
      icon: "🔎",
      color: "#1762d1",
    },
    {
      n: "02",
      title: "Profile Assessment",
      text: "Review your eligibility, documents and available pathways.",
      icon: "📋",
      color: "#ef476f",
    },
    {
      n: "03",
      title: "Application Support",
      text: "Prepare documentation and support you through the application.",
      icon: "✅",
      color: "#08a99c",
    },
    {
      n: "04",
      title: "Ongoing Guidance",
      text: "Stay supported while your application moves forward.",
      icon: "👤",
      color: "#f5b400",
    },
  ];

  return (
    <PageShell theme="about">

      <style>{`
        .nc-about {
          background:
            radial-gradient(circle at 8% 8%, rgba(30,105,220,.08), transparent 25%),
            radial-gradient(circle at 92% 35%, rgba(0,170,160,.07), transparent 25%),
            #f7fbff;
          color: ${INK};
        }

        .nc-about-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .nc-about-hero {
          min-height: 430px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          background:
            linear-gradient(
              90deg,
              rgba(247,251,255,.98) 0%,
              rgba(247,251,255,.94) 35%,
              rgba(247,251,255,.60) 58%,
              rgba(247,251,255,.05) 100%
            ),
            url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2200&q=90")
            center/cover;
        }

        .nc-about-hero-inner {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 62px 0;
        }

        .nc-about-hero-copy {
          max-width: 620px;
        }

        .nc-about-eyebrow {
          color: #ff493d;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .nc-about-hero h1 {
          font-size: 44px;
          line-height: 1.05;
          margin: 9px 0 8px;
          font-weight: 950;
          letter-spacing: -1.2px;
        }

        .nc-about-blue {
          color: #1762d1;
        }

        .nc-about-tagline {
          font-size: 17px;
          font-weight: 850;
          margin-bottom: 8px;
        }

        .nc-about-hero p {
          color: #536078;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .nc-about-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 19px;
        }

        .nc-about-stats {
          width: min(1050px, calc(100% - 40px));
          margin: -45px auto 0;
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: rgba(255,255,255,.96);
          border: 1px solid #dfe8f4;
          border-radius: 15px;
          box-shadow: 0 12px 30px rgba(25,50,90,.12);
          overflow: hidden;
        }

        .nc-about-stat {
          padding: 17px 18px;
          display: flex;
          align-items: center;
          gap: 11px;
          border-right: 1px solid #e7edf5;
        }

        .nc-about-stat:last-child {
          border-right: 0;
        }

        .nc-about-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: #eaf3ff;
          color: #1762d1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .nc-about-section {
          padding: 40px 0;
        }

        .nc-about-section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 18px;
        }

        .nc-about-section-label {
          color: #ff493d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .nc-about-section h2 {
          font-size: 27px;
          line-height: 1.15;
          margin: 4px 0 3px;
          font-weight: 950;
          letter-spacing: -.5px;
        }

        .nc-about-section-sub {
          color: #617087;
          font-size: 13px;
          margin: 0;
          line-height: 1.6;
        }

        .nc-about-services {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .nc-about-service {
          background: white;
          border: 1px solid #dfe6f0;
          border-radius: 15px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 395px;
          box-shadow: 0 5px 16px rgba(20,40,70,.06);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .nc-about-service:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(20,40,70,.13);
        }

        .nc-about-service-image {
          height: 145px;
          position: relative;
          overflow: hidden;
          background: #eaf0f7;
        }

        .nc-about-service-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .4s ease;
        }

        .nc-about-service:hover .nc-about-service-image img {
          transform: scale(1.06);
        }

        .nc-about-service-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,.02),
            rgba(7,18,45,.72)
          );
        }

        .nc-about-flags {
          position: absolute;
          bottom: 9px;
          left: 10px;
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }

        .nc-about-flag {
          background: rgba(255,255,255,.86);
          border-radius: 5px;
          padding: 3px 5px;
          font-size: 15px;
          box-shadow: 0 2px 7px rgba(0,0,0,.1);
        }

        .nc-about-service-body {
          padding: 17px;
          display: flex;
          flex-direction: column;
          flex: 1;
          border-top: 3px solid var(--service-color);
        }

        .nc-about-service h3 {
          margin: 0 0 5px;
          font-size: 15px;
          line-height: 1.25;
          font-weight: 950;
        }

        .nc-about-service-sub {
          color: var(--service-color);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .45px;
          margin-bottom: 7px;
        }

        .nc-about-service p {
          color: #5b6880;
          font-size: 11.5px;
          line-height: 1.55;
          margin: 0;
        }

        .nc-about-service-button {
          margin-top: auto;
          padding-top: 14px;
        }

        .nc-about-learn {
          width: 100%;
          border: 0;
          border-radius: 22px;
          padding: 10px 13px;
          background: #10104d;
          color: white;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
        }

        .nc-about-learn:hover {
          filter: brightness(1.12);
        }

        .nc-about-why {
          display: grid;
          grid-template-columns: 1.05fr 1fr .72fr;
          gap: 20px;
          align-items: stretch;
        }

        .nc-about-why-copy {
          padding: 8px 0;
        }

        .nc-about-check {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 9px 0;
          color: #4e5d74;
          font-size: 12px;
        }

        .nc-about-check span {
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #08a982;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .nc-about-map {
          min-height: 290px;
          border-radius: 18px;
          overflow: hidden;
          background:
            linear-gradient(rgba(237,247,255,.35),rgba(237,247,255,.35)),
            url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80")
            center/cover;
          position: relative;
          border: 1px solid #dce9f7;
        }

        .nc-about-map-badge {
          position: absolute;
          background: white;
          border-radius: 10px;
          padding: 7px 9px;
          box-shadow: 0 4px 12px rgba(20,40,70,.14);
          font-size: 10px;
          font-weight: 800;
        }

        .nc-about-mission {
          background: linear-gradient(145deg,#10104b,#282178);
          color: white;
          border-radius: 14px;
          padding: 20px;
        }

        .nc-about-mission-item {
          margin-bottom: 16px;
        }

        .nc-about-mission-label {
          color: #ffca24;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .nc-about-mission p {
          color: #d8dcf1;
          font-size: 10.5px;
          line-height: 1.5;
          margin: 0;
        }

        .nc-about-country-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }

        .nc-about-country {
          background: white;
          border: 1px solid #e0e7f0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(20,40,70,.05);
        }

        .nc-about-country-image {
          height: 80px;
          overflow: hidden;
        }

        .nc-about-country-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .nc-about-country-name {
          padding: 9px 8px;
          font-size: 11px;
          font-weight: 800;
          color: #17193e;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nc-about-process {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .nc-about-process-card {
          background: white;
          border: 1px solid #e1e8f1;
          border-radius: 13px;
          padding: 18px;
          min-height: 145px;
          box-shadow: 0 4px 13px rgba(20,40,70,.05);
        }

        .nc-about-process-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nc-about-process-number {
          font-size: 25px;
          font-weight: 950;
          color: var(--process-color);
        }

        .nc-about-process-icon {
          font-size: 21px;
        }

        .nc-about-process-title {
          margin-top: 7px;
          font-size: 13px;
          font-weight: 900;
        }

        .nc-about-process-text {
          margin-top: 5px;
          font-size: 11.5px;
          color: #647188;
          line-height: 1.5;
        }

        .nc-about-cta {
          margin-top: 25px;
          padding: 42px 30px;
          border-radius: 20px;
          color: white;
          text-align: center;
          background:
            linear-gradient(
              90deg,
              rgba(10,20,70,.82),
              rgba(10,20,70,.35)
            ),
            url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1800&q=85")
            center/cover;
        }

        .nc-about-cta h2 {
          margin: 0 0 8px;
          font-size: 27px;
          font-weight: 950;
        }

        .nc-about-cta p {
          max-width: 700px;
          margin: 0 auto 19px;
          font-size: 13px;
          line-height: 1.6;
          color: #edf1ff;
        }

        @media (max-width: 1000px) {
          .nc-about-services {
            grid-template-columns: repeat(2, 1fr);
          }

          .nc-about-country-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .nc-about-why {
            grid-template-columns: 1fr 1fr;
          }

          .nc-about-mission {
            grid-column: span 2;
          }
        }

        @media (max-width: 700px) {
          .nc-about-hero {
            min-height: 650px;
            background:
              linear-gradient(
                rgba(247,251,255,.94),
                rgba(247,251,255,.82)
              ),
              url("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=85")
              center/cover;
          }

          .nc-about-hero-inner {
            width: calc(100% - 30px);
          }

          .nc-about-hero h1 {
            font-size: 34px;
          }

          .nc-about-stats {
            width: calc(100% - 30px);
            grid-template-columns: repeat(2, 1fr);
            margin-top: -35px;
          }

          .nc-about-stat {
            border-bottom: 1px solid #e7edf5;
          }

          .nc-about-stat:nth-child(2) {
            border-right: 0;
          }

          .nc-about-container {
            width: calc(100% - 30px);
          }

          .nc-about-services {
            grid-template-columns: 1fr;
          }

          .nc-about-country-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nc-about-why {
            grid-template-columns: 1fr;
          }

          .nc-about-mission {
            grid-column: auto;
          }

          .nc-about-process {
            grid-template-columns: 1fr;
          }

          .nc-about-section {
            padding: 30px 0;
          }
        }
      `}</style>

      <div className="nc-about">

        {/* ================= HERO ================= */}
        <section className="nc-about-hero">
          <div className="nc-about-hero-inner">

            <div className="nc-about-hero-copy">

              <div className="nc-about-eyebrow">
                About NC Migration
              </div>

              <h1>
                Your Global Partner for
                <br />
                <span className="nc-about-blue">
                  Visa & Immigration Success
                </span>
              </h1>

              <div className="nc-about-tagline">
                Guiding People. Building Futures. Worldwide.
              </div>

              <p>
                NC Migration is an immigration and visa consultancy helping
                individuals, families and professionals understand their
                global visa, work, visit and immigration options across
                multiple countries.
              </p>

              <div className="nc-about-buttons">
                <Btn
                  variant="gold"
                  onClick={() => go("contact")}
                >
                  Get Free Consultation <ArrowRight size={15} />
                </Btn>

                <Btn
                  variant="navy"
                  onClick={() => scrollToId("nc-services")}
                >
                  Explore Our Services <ArrowRight size={15} />
                </Btn>
              </div>

            </div>

          </div>
        </section>

        {/* ================= STATS ================= */}
        <div className="nc-about-stats">

          {stats.map((s, i) => (
            <div className="nc-about-stat" key={i}>

              <div className="nc-about-stat-icon">
                {["👥", "⭐", "🌎", "🎧"][i]}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 950,
                    color: "#172052",
                  }}
                >
                  {s[0]}
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "#65728a",
                  }}
                >
                  {s[1]}
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* ================= SERVICES ================= */}
        <section
          className="nc-about-container nc-about-section"
          id="nc-services"
        >

          <div className="nc-about-section-head">

            <div>
              <div className="nc-about-section-label">
                Our Services
              </div>

              <h2>
                Complete Visa & Immigration Solutions
              </h2>

              <p className="nc-about-section-sub">
                Choose your goal, explore your options and let us guide you
                through the next steps.
              </p>
            </div>

            <Btn
              variant="navy"
              onClick={() => go("contact")}
            >
              Explore All Services <ArrowRight size={14} />
            </Btn>

          </div>

          <div className="nc-about-services">

            {services.map((s, i) => (
              <div
                className="nc-about-service"
                key={i}
                style={{
                  "--service-color": s.color,
                }}
              >

                <div className="nc-about-service-image">

                  <img
                    src={s.image}
                    alt={s.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://picsum.photos/seed/nc-service-" +
                        i +
                        "/1200/700";
                    }}
                  />

                  <div className="nc-about-service-overlay" />

                  <div className="nc-about-flags">
                    {s.flags.map((flag, fi) => (
                      <span
                        className="nc-about-flag"
                        key={fi}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>

                </div>

                <div className="nc-about-service-body">

                  <h3>
                    {s.title}
                  </h3>

                  <div className="nc-about-service-sub">
                    {s.subtitle}
                  </div>

                  <p>
                    {s.description}
                  </p>

                  <div className="nc-about-service-button">

                    <button
                      className="nc-about-learn"
                      onClick={() => go(s.route)}
                    >
                      Learn More
                      <span style={{ marginLeft: 7 }}>
                        →
                      </span>
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section
          className="nc-about-container nc-about-section"
        >

          <div className="nc-about-section-label">
            Why Choose Us
          </div>

          <h2>
            More Than Just Visa Assistance
          </h2>

          <div
            className="nc-about-why"
            style={{ marginTop: 17 }}
          >

            <div className="nc-about-why-copy">

              <p
                style={{
                  color: "#617087",
                  fontSize: 13,
                  lineHeight: 1.65,
                  marginTop: 0,
                }}
              >
                We are committed to making your global journey simple,
                transparent and profile-focused.
              </p>

              {[
                "End-to-end guidance from documentation to decision",
                "Personalised support based on your profile",
                "Expert team with up-to-date knowledge",
                "Clear communication and realistic expectations",
                "Support even after visa approval",
              ].map((item, i) => (
                <div
                  className="nc-about-check"
                  key={i}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}

              <div style={{ marginTop: 17 }}>
                <Btn
                  variant="gold"
                  onClick={() => go("contact")}
                >
                  Talk to Our Experts <ArrowRight size={14} />
                </Btn>
              </div>

            </div>

            <div className="nc-about-map">

              <div
                className="nc-about-map-badge"
                style={{ top: 30, left: 45 }}
              >
                🇨🇦 Canada
              </div>

              <div
                className="nc-about-map-badge"
                style={{ top: 70, left: "48%" }}
              >
                🇬🇧 UK
              </div>

              <div
                className="nc-about-map-badge"
                style={{ top: 45, right: 35 }}
              >
                🇩🇪 Germany
              </div>

              <div
                className="nc-about-map-badge"
                style={{ bottom: 35, left: 65 }}
              >
                🇦🇺 Australia
              </div>

              <div
                className="nc-about-map-badge"
                style={{ bottom: 25, right: 55 }}
              >
                🇳🇿 New Zealand
              </div>

              <div
                style={{
                  position: "absolute",
                  left: "28%",
                  top: "48%",
                  width: "45%",
                  borderTop: "2px dashed #1762d1",
                  transform: "rotate(-10deg)",
                }}
              />

            </div>

            <div className="nc-about-mission">

              <div className="nc-about-mission-item">

                <div className="nc-about-mission-label">
                  Our Mission
                </div>

                <p>
                  To create global opportunities through honest guidance
                  and transparent processes.
                </p>

              </div>

              <div className="nc-about-mission-item">

                <div className="nc-about-mission-label">
                  Our Vision
                </div>

                <p>
                  To be a trusted immigration consultancy known for
                  personalised visa guidance and client support.
                </p>

              </div>

              <div className="nc-about-mission-item">

                <div className="nc-about-mission-label">
                  Our Values
                </div>

                <p>
                  ✓ Integrity
                  <br />
                  ✓ Transparency
                  <br />
                  ✓ Client First
                  <br />
                  ✓ Excellence
                  <br />
                  ✓ Long-Term Relationships
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= COUNTRIES ================= */}
        <section
          className="nc-about-container nc-about-section"
        >

          <div className="nc-about-section-label">
            Global Coverage
          </div>

          <h2>
            Countries We Cover
          </h2>

          <p className="nc-about-section-sub">
            Visa and immigration assistance across Europe, the UK,
            North America, Australia, New Zealand, Asia and the UAE.
          </p>

          <div
            className="nc-about-country-grid"
            style={{ marginTop: 18 }}
          >

            {countries.map((country, i) => (
              <div
                className="nc-about-country"
                key={i}
              >

                <div className="nc-about-country-image">

                  <img
                    src={country.image}
                    alt={country.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://picsum.photos/seed/nc-country-" +
                        i +
                        "/900/600";
                    }}
                  />

                </div>

                <div className="nc-about-country-name">
                  <span>{country.flag}</span>
                  {country.name}
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= PROCESS ================= */}
        <section
          className="nc-about-container nc-about-section"
        >

          <div className="nc-about-section-label">
            Our Process
          </div>

          <h2>
            A Simple & Transparent Process
          </h2>

          <p className="nc-about-section-sub">
            From your first consultation to ongoing guidance, our process
            is designed around your individual profile.
          </p>

          <div
            className="nc-about-process"
            style={{ marginTop: 18 }}
          >

            {process.map((step, i) => (
              <div
                className="nc-about-process-card"
                key={i}
                style={{
                  "--process-color": step.color,
                }}
              >

                <div className="nc-about-process-top">

                  <div className="nc-about-process-number">
                    {step.n}
                  </div>

                  <div className="nc-about-process-icon">
                    {step.icon}
                  </div>

                </div>

                <div className="nc-about-process-title">
                  {step.title}
                </div>

                <div className="nc-about-process-text">
                  {step.text}
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= INFORMATION / SEO ================= */}
        <section
          className="nc-about-container"
          style={{ paddingBottom: 38 }}
        >

          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f1",
              borderRadius: 15,
              padding: 22,
              boxShadow: "0 4px 13px rgba(20,40,70,.04)",
            }}
          >

            <div className="nc-about-section-label">
              About Our Immigration Services
            </div>

            <h2 style={{ fontSize: 22 }}>
              Visa & Immigration Guidance for Your Global Journey
            </h2>

            <p
              style={{
                color: "#5f6d84",
                fontSize: 12.5,
                lineHeight: 1.75,
                marginBottom: 8,
              }}
            >
              NC Migration provides visa and immigration consultancy
              services for individuals planning to work, visit, study,
              relocate or explore international opportunities. Our services
              include UK visa extension and Right to Work guidance, work
              visa assistance, visitor and tourist visas, visit-to-work
              pathways, skilled worker routes, family and dependant
              applications and business and investor visa guidance.
            </p>

            <p
              style={{
                color: "#5f6d84",
                fontSize: 12.5,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              We cover destinations including the United Kingdom, Canada,
              Australia, New Zealand, Germany, Italy, Spain, Greece,
              Lithuania, Slovakia, Bulgaria, Serbia, Switzerland, UAE,
              Singapore, Malaysia, Thailand, Vietnam and the United States.
              Eligibility, visa availability and immigration requirements
              vary by country, route and individual circumstances.
            </p>

          </div>

        </section>

        {/* ================= CTA ================= */}
        <section
          className="nc-about-container"
          style={{ paddingBottom: 45 }}
        >

          <div className="nc-about-cta">

            <h2>
              Ready to Start Your Global Journey?
            </h2>

            <p>
              Talk to our team today and get personalised guidance for
              your visa, work or immigration goals.
            </p>

            <Btn
              variant="gold"
              onClick={() => go("contact")}
            >
              Get Free Consultation <ArrowRight size={15} />
            </Btn>

          </div>

        </section>

      </div>

    </PageShell>
  );
}

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "General Consultation",
    destination: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const update = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: "100%",
    padding: "14px 15px",
    borderRadius: 10,
    border: "1px solid #dce2ea",
    fontSize: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "#fff",
    color: INK,
    outline: "none",
  };

  const labelStyle = {
    fontSize: 12.5,
    fontWeight: 700,
    color: "#4f5b70",
    marginBottom: 7,
    display: "block",
  };

  const CONTACT_CARDS = [
    {
      icon: Phone,
      title: "Call Us",
      value: PHONE_DISPLAY,
      action: "Call Now",
      href: PHONE_TEL,
      color: CORAL,
      bg: "#fff1ee",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: PHONE_DISPLAY,
      action: "Chat on WhatsApp",
      href: WHATSAPP_LINK,
      color: "#18bd70",
      bg: "#ebfaf3",
      external: true,
    },
    {
      icon: Mail,
      title: "Email",
      value: "info@ncmigration.com",
      action: "Send an Email",
      href: "mailto:info@ncmigration.com",
      color: "#e63946",
      bg: "#fff0f1",
    },
    {
      icon: MapPin,
      title: "Visit Our Office",
      value: "Sector 17, Chandigarh, India",
      action: "Get Directions",
      href: "https://www.google.com/maps/search/?api=1&query=SCO+125-126%2C+Sector+17-C%2C+Chandigarh",
      color: "#7256d8",
      bg: "#f1efff",
      external: true,
    },
  ];

  const reasons = [
    "Work Visa",
    "Visitor Visa",
    "Visit to Work",
    "UK Visa Extension",
    "Right to Work",
    "General Consultation",
  ];

  return (
    <PageShell theme="contact">

      {/* =========================================================
          PREMIUM CONTACT HERO
      ========================================================= */}

      <section
        style={{
          background:
            `radial-gradient(circle at 80% 25%, rgba(197,150,48,.20), transparent 28%),
             linear-gradient(115deg, #07131d 0%, #0c1b28 48%, #101827 100%)`,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          padding: "72px 0 58px",
        }}
      >

        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-120px",
            width: 430,
            height: 430,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(214,166,55,.18), transparent 68%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "-160px",
            bottom: "-180px",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,75,63,.10), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.25fr .75fr",
              gap: 50,
              alignItems: "center",
            }}
            className="nc-2col"
          >

            <div style={{ position: "relative", zIndex: 2 }}>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#e7b94f",
                  marginBottom: 17,
                }}
              >
                Contact NC Migration
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(38px, 5vw, 62px)",
                  lineHeight: 1.05,
                  letterSpacing: "-1.8px",
                  maxWidth: 760,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                Let's discuss your
                <br />
                <span style={{ color: "#e8bb57" }}>
                  visa & immigration goals
                </span>
              </h1>

              <p
                style={{
                  margin: "22px 0 0",
                  maxWidth: 650,
                  fontSize: 16,
                  lineHeight: 1.75,
                  color: "#d7dee8",
                }}
              >
                Tell us about your travel, work or immigration plans and our
                team can help you understand the available options and next
                steps.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                  marginTop: 28,
                }}
              >
                <Btn
                  variant="gold"
                  onClick={() => scrollToId("contact-form")}
                >
                  Request Free Consultation <ArrowRight size={15} />
                </Btn>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Btn variant="teal">
                    WhatsApp Us <MessageCircle size={15} />
                  </Btn>
                </a>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 28,
                  flexWrap: "wrap",
                  marginTop: 35,
                  paddingTop: 25,
                  borderTop: "1px solid rgba(255,255,255,.13)",
                }}
              >
                {[
                  ["✓", "Expert Guidance"],
                  ["✓", "Personalised Support"],
                  ["✓", "Transparent Process"],
                  ["✓", "End-to-End Support"],
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12.5,
                      color: "#e8edf4",
                    }}
                  >
                    <span
                      style={{
                        width: 21,
                        height: 21,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#e8bb57",
                        border: "1px solid rgba(232,187,87,.5)",
                        fontWeight: 800,
                      }}
                    >
                      {item[0]}
                    </span>
                    {item[1]}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                minHeight: 330,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >

              <div
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  border: "1px solid rgba(231,185,79,.24)",
                  position: "absolute",
                }}
              />

              <div
                style={{
                  width: 235,
                  height: 235,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,.10)",
                  position: "absolute",
                }}
              />

              <div
                style={{
                  width: 190,
                  height: 190,
                  borderRadius: 30,
                  background:
                    "linear-gradient(145deg, rgba(232,187,87,.18), rgba(255,255,255,.04))",
                  border: "1px solid rgba(232,187,87,.30)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                  boxShadow: "0 25px 70px rgba(0,0,0,.28)",
                }}
              >
                <MapPin size={44} color="#e8bb57" />
                <div
                  style={{
                    marginTop: 15,
                    fontFamily: "Georgia, serif",
                    fontSize: 21,
                    color: "#fff",
                  }}
                >
                  Chandigarh
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#cbd4df",
                    marginTop: 5,
                  }}
                >
                  NC Migration Office
                </div>
              </div>

            </div>
          </div>
        </Section>
      </section>


      {/* =========================================================
          CONTACT CARDS
      ========================================================= */}

      <Section style={{ paddingTop: 28, paddingBottom: 32 }}>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
          className="nc-4col"
        >

          {CONTACT_CARDS.map((c, i) => {
            const Icon = c.icon;

            return (
              <Glass
                key={i}
                pad={23}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 170,
                  borderTop: `3px solid ${c.color}`,
                  transition: "transform .2s ease, box-shadow .2s ease",
                }}
              >

                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 13,
                    background: c.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} color={c.color} />
                </div>

                <div
                  style={{
                    marginTop: 14,
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: "#7b8799",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {c.title}
                </div>

                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 750,
                    color: INK,
                    marginTop: 6,
                    lineHeight: 1.45,
                  }}
                >
                  {c.value}
                </div>

                {c.href && (
                  <a
                    href={c.href}
                    {...(c.external
                      ? {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    style={{
                      marginTop: "auto",
                      paddingTop: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      color: c.color,
                      fontWeight: 750,
                      fontSize: 12.5,
                      textDecoration: "none",
                    }}
                  >
                    {c.action}
                    <ArrowRight size={14} />
                  </a>
                )}

              </Glass>
            );
          })}

        </div>
      </Section>


      {/* =========================================================
          FORM + OFFICE
      ========================================================= */}

      <Section style={{ paddingTop: 8, paddingBottom: 50 }}>

        <Anchor id="contact-form" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr .85fr",
            gap: 28,
            alignItems: "start",
          }}
          className="nc-2col"
        >

          {/* FORM */}

          <Glass pad={34}>

            {submitted ? (

              <div
                style={{
                  textAlign: "center",
                  padding: "75px 15px",
                }}
              >
                <CheckCircle2
                  size={52}
                  color={TEAL}
                  style={{ marginBottom: 18 }}
                />

                <div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: 27,
                    color: INK,
                  }}
                >
                  Thank you!
                </div>

                <div
                  style={{
                    color: "#647084",
                    fontSize: 14,
                    marginTop: 10,
                    lineHeight: 1.7,
                  }}
                >
                  Your enquiry has been received.
                  <br />
                  Our NC Migration team will contact you soon.
                </div>

              </div>

            ) : (

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >

                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    color: "#c39325",
                    textTransform: "uppercase",
                    marginBottom: 9,
                  }}
                >
                  Get In Touch
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                    color: INK,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Request a free consultation
                </h2>

                <p
                  style={{
                    color: "#647084",
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    margin: "9px 0 26px",
                  }}
                >
                  A few details are all we need to get started. Our team will
                  review your enquiry and get back to you.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 15,
                  }}
                  className="nc-2col-tight"
                >

                  <div>
                    <label style={labelStyle}>
                      Full Name *
                    </label>

                    <input
                      style={inputStyle}
                      placeholder="Your full name"
                      required
                      value={form.name}
                      onChange={update("name")}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Phone Number *
                    </label>

                    <input
                      style={inputStyle}
                      placeholder="+91 00000 00000"
                      required
                      value={form.phone}
                      onChange={update("phone")}
                    />
                  </div>

                </div>


                <label style={labelStyle}>
                  Email Address *
                </label>

                <input
                  style={{ ...inputStyle, marginBottom: 15 }}
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={update("email")}
                />


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 15,
                  }}
                  className="nc-2col-tight"
                >

                  <div>
                    <label style={labelStyle}>
                      Service Interested In *
                    </label>

                    <select
                      style={inputStyle}
                      value={form.service}
                      onChange={update("service")}
                    >
                      {reasons.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Destination Country *
                    </label>

                    <input
                      style={inputStyle}
                      placeholder="e.g. United Kingdom"
                      value={form.destination}
                      onChange={update("destination")}
                    />
                  </div>

                </div>


                <label style={labelStyle}>
                  Your Message *
                </label>

                <textarea
                  style={{
                    ...inputStyle,
                    minHeight: 125,
                    resize: "vertical",
                  }}
                  placeholder="Tell us about your requirements, timeline or questions..."
                  value={form.message}
                  onChange={update("message")}
                />


                <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 5,
  }}
>
  <a
    href={`https://wa.me/917658882546?text=${encodeURIComponent(
      `Hello NC Migration,

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Service: ${form.service}
Destination: ${form.destination}

Message:
${form.message}`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "none",
    }}
  >
    <Btn
      variant="gold"
      style={{
        width: "100%",
        justifyContent: "center",
      }}
    >
      <MessageCircle size={16} />
      Send Enquiry on WhatsApp
      <ArrowRight size={15} />
    </Btn>
  </a>

  <a
    href={`mailto:info@ncmigration.com?subject=${encodeURIComponent(
      "New Consultation Enquiry - NC Migration"
    )}&body=${encodeURIComponent(
      `Hello NC Migration,

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Service: ${form.service}
Destination: ${form.destination}

Message:
${form.message}`
    )}`}
    style={{
      textDecoration: "none",
    }}
  >
    <Btn
      variant="outline"
      style={{
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Mail size={16} />
      Send Enquiry on Email
      <ArrowRight size={15} />
    </Btn>
  </a>
</div>

                <div
                  style={{
                    textAlign: "center",
                    fontSize: 11.5,
                    color: "#8993a3",
                    marginTop: 13,
                  }}
                >
                  🔒 Your information is kept private and used only for
                  consultation purposes.
                </div>

              </form>

            )}

          </Glass>


          {/* OFFICE */}

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <Glass
              pad={0}
              style={{
                overflow: "hidden",
                background: "#081520",
                color: "#fff",
              }}
            >

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  minHeight: 270,
                }}
                className="nc-2col-tight"
              >

                <div
                  style={{
                    padding: 27,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      color: "#e8bb57",
                      fontSize: 13,
                      fontWeight: 800,
                      marginBottom: 22,
                    }}
                  >
                    <MapPin size={19} />
                    Our Office
                  </div>

                  <div
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.65,
                      color: "#e1e7ef",
                      marginBottom: 19,
                    }}
                  >
                    Sector 17-C,
                    <br />
                    Chandigarh, India
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,.12)",
                      marginBottom: 18,
                    }}
                  />

                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#d6dde7",
                      lineHeight: 1.7,
                    }}
                  >
                    <strong style={{ color: "#fff" }}>
                      Monday – Saturday
                    </strong>
                    <br />
                    10:00 AM – 7:00 PM
                  </div>

                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#d6dde7",
                      lineHeight: 1.7,
                      marginTop: 12,
                    }}
                  >
                    <strong style={{ color: "#fff" }}>
                      Sunday
                    </strong>
                    <br />
                    By Appointment Only
                  </div>

                </div>


                <div
                  style={{
                    minHeight: 270,
                    background:
                      "linear-gradient(145deg, #1b2d3b, #07131d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      position: "absolute",
                      width: 230,
                      height: 230,
                      borderRadius: "50%",
                      border: "1px solid rgba(232,187,87,.18)",
                    }}
                  />

                  <div
                    style={{
                      position: "relative",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: 34,
                        color: "#e8bb57",
                        fontWeight: 700,
                      }}
                    >
                      NC
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        letterSpacing: 3,
                        color: "#fff",
                        marginTop: 2,
                      }}
                    >
                      MIGRATION
                    </div>

                    <div
                      style={{
                        fontSize: 10,
                        color: "#aeb8c5",
                        marginTop: 10,
                      }}
                    >
                      Your Global Partner
                    </div>
                  </div>

                </div>

              </div>

            </Glass>


            {/* MAP CARD */}

            <Glass pad={0} style={{ overflow: "hidden" }}>

              <div
                style={{
                  padding: "17px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 800,
                  color: INK,
                  fontSize: 15,
                }}
              >
                <MapPin size={17} color="#d29c2d" />
                Find Us on Map
              </div>

              <iframe
                title="NC Migration Office Location"
                src="https://www.google.com/maps?q=Sector+17,+Chandigarh,+India&output=embed"
                style={{
                  width: "100%",
                  height: 280,
                  border: 0,
                  display: "block",
                }}
                loading="lazy"
              />

            </Glass>

          </div>

        </div>
      </Section>


      {/* =========================================================
          TRUST STRIP
      ========================================================= */}

      <section
        style={{
          background: "#f5f7fa",
          borderTop: "1px solid #e8ecf2",
          borderBottom: "1px solid #e8ecf2",
          padding: "30px 0",
        }}
      >

        <Section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 25,
            }}
            className="nc-4col"
          >

            {[
              ["◇", "Trusted & Genuine", "Your goals, our priority"],
              ["♧", "Expert Counsellors", "Personalised guidance"],
              ["↗", "End-to-End Support", "From application to approval"],
              ["◎", "Global Opportunities", "Explore a better future"],
            ].map((item, i) => (

              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >

                <div
                  style={{
                    width: 43,
                    height: 43,
                    borderRadius: "50%",
                    border: "1px solid #d7ad49",
                    color: "#c18d20",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {item[0]}
                </div>

                <div>

                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 800,
                      color: INK,
                    }}
                  >
                    {item[1]}
                  </div>

                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#7a8698",
                      marginTop: 3,
                    }}
                  >
                    {item[2]}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </Section>

      </section>


      {/* =========================================================
          FAQ / QUICK ANSWERS
      ========================================================= */}

      <Section style={{ paddingTop: 55, paddingBottom: 65 }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 20,
            marginBottom: 25,
          }}
        >

          <div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "#c39325",
                textTransform: "uppercase",
                marginBottom: 7,
              }}
            >
              FAQ
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 29,
                fontFamily: "Georgia, serif",
                color: INK,
              }}
            >
              Quick Answers
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "#68748a",
                fontSize: 13.5,
              }}
            >
              Find answers to some common questions or get in touch with our
              team.
            </p>

          </div>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 13,
          }}
          className="nc-4col"
        >

          {[
            "How can I start my application?",
            "Do you provide visa assistance?",
            "What are your consultation charges?",
            "Can I visit your office?",
          ].map((q, i) => (

            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #e5e9f0",
                borderRadius: 12,
                padding: "17px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                boxShadow: "0 6px 20px rgba(20,30,50,.04)",
              }}
            >

              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: INK,
                  lineHeight: 1.4,
                }}
              >
                {q}
              </span>

              <span
                style={{
                  fontSize: 20,
                  color: "#b58628",
                  flexShrink: 0,
                }}
              >
                +
              </span>

            </div>

          ))}

        </div>

      </Section>

    </PageShell>
  );
}
/* ------------------------------------------------------------------ */
/*  PER-PAGE SEO METADATA                                             */
/* ------------------------------------------------------------------ */

const SEO = {
  home: {
    title: "NC Migration | Work Visa, Visitor Visa & UK Immigration Services",
    desc: "Explore work visa opportunities, visitor visas, UK visa extension support and international immigration services with NC Migration. Profile-based visa guidance for the UK, Europe, New Zealand and UAE.",
  },

  "work-visa": {
    title: "Work Visa Opportunities | Europe, UK, New Zealand & UAE | NC Migration",
    desc: "Explore work visa routes across Spain, Italy, Germany, the UK, New Zealand, UAE, Slovakia, Bulgaria and Serbia. Work visa consultant guidance based on your occupation and eligibility.",
  },

  "visitor-visa": {
    title: "Visitor & Tourist Visa Services | Schengen, UK, UAE | NC Migration",
    desc: "Visitor visa and tourist visa assistance for the UAE, Singapore, Thailand, Malaysia, Vietnam, the UK, Australia, New Zealand, Switzerland and Schengen Europe.",
  },

  "visit-to-work": {
    title: "Visit to Work | Explore Legal Work Pathways in Europe & UK | NC Migration",
    desc: "Understand lawful immigration pathways from visitor status toward work-authorised routes in the UK, Spain, Germany, Greece, Italy and Lithuania. Subject to eligibility and immigration rules.",
  },

  "uk-extension": {
    title: "UK Visa Extension & Right to Work Guidance | NC Migration",
    desc: "UK visa extension consultant guidance covering right to work, Share Code, eVisa status, Skilled Worker visa eligibility and Certificate of Sponsorship-related support.",
  },

  about: {
    title: "About NC Migration | Visa & Immigration Consultant",
    desc: "NC Migration is an immigration and visa consultancy providing work visa, visitor visa, visit-to-work and UK immigration guidance based on your individual profile.",
  },

  contact: {
    title: "Contact NC Migration | Free Visa Consultation, Chandigarh",
    desc: "Speak with NC Migration about work visas, visitor visas, visit-to-work pathways or UK visa extension options. Request a free consultation from our Chandigarh office.",
  },
};

function useSeo(page, param) {
  useEffect(() => {
    const base = SEO[page] || SEO.home;
    let title = base.title;
    let desc = base.desc;

    if (page === "work-country" && WORK_COUNTRIES[param]) {
      const c = WORK_COUNTRIES[param];
      title = `${c.name} Work Visa | Routes, Eligibility & Documentation | NC Migration`;
      desc = `Explore ${c.name} work visa routes, who may be eligible, common work areas and documentation requirements. Subject to eligibility and applicable immigration rules.`;
    } else if (page === "visitor-country" && VISITOR_COUNTRIES[param]) {
      const c = VISITOR_COUNTRIES[param];
      title = `${c.name} ${c.label} | Requirements & Application Guidance | NC Migration`;
      desc = `${c.name} ${c.label.toLowerCase()} guidance covering purpose of visit, documentation categories, eligibility considerations and application support.`;
    } else if (page === "visit-to-work-country" && VISIT_TO_WORK_OPTIONS[param]) {
      const c = VISIT_TO_WORK_OPTIONS[param];
      title = `${c.name} Visit to Work Pathways | NC Migration`;
      desc = `Understand possible work pathways for ${c.name} and what is assessed. Subject to immigration rules and individual eligibility.`;
    }

    document.title = title;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);
  }, [page, param]);
}

export default function App() {
  const [page, setPage] = useState("home");
  const [param, setParam] = useState(null);

  const go = (p, arg) => { setPage(p); setParam(arg || null); window.scrollTo(0, 0); };

  useSeo(page, param);

  const content = useMemo(() => {
    switch (page) {
      case "home": return <HomePage go={go} />;
      case "work-visa": return <WorkVisaPage go={go} />;
      case "work-country": return <CountryDetailPage countryKey={param} go={go} />;
      case "visitor-visa": return <VisitorVisaPage go={go} />;
      case "visitor-country": return <VisitorCountryPage countryKey={param} go={go} />;
      case "visit-to-work": return <VisitToWorkPage go={go} />;
      case "visit-to-work-country": return <VisitToWorkCountryPage countryKey={param} go={go} />;
      case "uk-extension": return <UKVisaExtensionPage go={go} />;
      case "about": return <AboutPage go={go} />;
      case "contact": return <ContactPage />;
      default: return <HomePage go={go} />;
    }
  }, [page, param]);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100%; }
        input:focus, select:focus, textarea:focus { outline: 2px solid ${ROYAL}; outline-offset: 1px; }

        /* --- currency ticker --- */
        @keyframes nc-ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .nc-ticker-track { animation: nc-ticker-scroll 55s linear infinite; will-change: transform; }
        .nc-ticker-track:hover { animation-play-state: paused; }

        /* --- section fade-up --- */
        @keyframes nc-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .nc-section { animation: nc-fade-up .5s ease both; }

        /* --- tablet --- */
        @media (max-width: 1100px) {
          .nc-services-grid { grid-template-columns: 1fr 1fr !important; }
          .nc-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .nc-4col { grid-template-columns: repeat(2, 1fr) !important; }
          .nc-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .nc-flow-arrow { display: none !important; }
        }

        /* --- mobile --- */
        @media (max-width: 900px) {
          .nc-desktop-nav, .nc-desktop-cta { display: none !important; }
          .nc-2col { grid-template-columns: 1fr !important; }
          .nc-2col-tight { grid-template-columns: 1fr !important; }
          .nc-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nc-ticker-label { display: none !important; }
        }
        @media (min-width: 901px) {
          .nc-mobile-toggle { display: none !important; }
          .nc-desktop-cta { display: block !important; }
        }
        @media (max-width: 680px) {
          .nc-5col, .nc-4col, .nc-3col, .nc-services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 460px) {
          .nc-5col, .nc-4col, .nc-3col, .nc-services-grid { grid-template-columns: 1fr !important; }
          .nc-footer-grid { grid-template-columns: 1fr !important; }
        }

        /* --- larger tap targets on touch devices --- */
        @media (hover: none) {
          button, a { min-height: 44px; }
        }
      `}</style>
      <Navbar go={go} current={page} />
      {content}
      <Footer go={go} />
      <FloatingCTAs />
    </div>
  );
}
