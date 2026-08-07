'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import EnrollmentForm from '../components/EnrollmentForm';
import { getWhatsAppLink } from '@/config/contact';
import {
  FaSmile, FaTools, FaUsers, FaGlobe, FaChalkboardTeacher, FaRocket,
  FaGamepad, FaCode, FaPython, FaPalette, FaRobot, FaStar, FaWhatsapp,
  FaSchool, FaUserGraduate, FaBolt, FaArrowRight, FaBuilding, FaQuoteLeft,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

/* ── helpers ── */
function useSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return;
    const w = ref.current.offsetWidth * 0.85;
    ref.current.scrollBy({ left: dir === 'right' ? w : -w, behavior: 'smooth' });
  };
  return { ref, scrollLeft: () => scroll('left'), scrollRight: () => scroll('right') };
}

/* ── data ── */
const programs = [
  { emoji: '🏫', icon: <FaSchool />, name: 'Builder Academy', desc: 'Flagship 12-week school-term program covering coding, AI, and digital creativity.', meta: ['Ages 6–17', '12 Weeks', 'Saturdays', 'Certificate'], price: '₦40,000', priceSuffix: '/term', btn: 'Learn More', href: '/builder-academy', badge: 'Flagship', color: '#0A66C2', bg: '#eff6ff' },
  { emoji: '☀️', icon: <FaRocket />, name: 'Summer Innovation Academy', desc: 'Immersive 4-week holiday experience — games, websites, and AI projects.', meta: ['Ages 6–17', '4 Weeks', 'Mon–Fri', '9 AM–12 PM'], price: '₦50,000', priceSuffix: 'flat', btn: 'Register Now', href: '/summer', badge: 'Open Now 🔥', color: '#FF6B00', bg: '#fff7ed' },
  { emoji: '🚀', icon: <FaRocket />, name: 'Holiday Innovation Camp', desc: 'Short holiday bursts at Christmas, Easter & mid-term — coding, AI & design.', meta: ['2 Weeks', 'Mon–Fri'], price: '₦30,000', priceSuffix: 'from', btn: 'Learn More', href: '/holiday-camp', badge: null, color: '#10b981', bg: '#ecfdf5' },
  { emoji: '⭐', icon: <FaBolt />, name: 'Builder Plus', desc: 'Accelerated pathway with advanced projects, competitions, and mentorship.', meta: ['12 Weeks', '2× /week', 'Portfolio', 'Competitions'], price: '₦75,000', priceSuffix: '/term', btn: 'Learn More', href: '/builder-plus', badge: 'Advanced', color: '#8b5cf6', bg: '#f5f3ff' },
  { emoji: '👨‍🏫', icon: <FaUserGraduate />, name: 'Private Coaching', desc: 'One-on-one sessions fully tailored to your child\'s goals and pace.', meta: ['Flexible', 'Personal plan', '1-on-1'], price: '₦15,000', priceSuffix: '/session', btn: 'Book a Session', href: '/private-coaching', badge: null, color: '#ec4899', bg: '#fdf2f8' },
  { emoji: '🏢', icon: <FaBuilding />, name: 'School Partnerships', desc: 'Bring coding and AI programs directly into your school with expert delivery.', meta: ['Custom', 'In-school', 'Any age'], price: 'Custom', priceSuffix: 'pricing', btn: 'Partner With Us', href: '/school-partnerships', badge: null, color: '#0A66C2', bg: '#eff6ff' },
];

const whyUs = [
  { icon: <FaSmile />, title: 'Beginner-friendly', desc: 'Designed for absolute beginners with zero experience.', color: 'var(--secondary-orange)' },
  { icon: <FaTools />, title: 'Real Projects', desc: 'Children build actual games, websites, and apps.', color: 'var(--fun-purple)' },
  { icon: <FaUsers />, title: 'Small Classes', desc: 'Personalized attention in small focused groups.', color: 'var(--primary-blue)' },
  { icon: <FaGlobe />, title: 'Online & Physical', desc: 'Flexible learning — attend in Kwara or online.', color: 'var(--fun-green)' },
  { icon: <FaChalkboardTeacher />, title: 'Expert Instructors', desc: 'Experienced teachers who truly love kids.', color: 'var(--fun-pink)' },
  { icon: <FaRocket />, title: 'Confidence First', desc: 'Every child leaves feeling capable and proud.', color: 'var(--fun-yellow)' },
];

const courses = [
  { icon: <FaGamepad />, title: 'Scratch Coding', desc: 'Logic through games & animations.', color: 'var(--secondary-orange)' },
  { icon: <FaCode />, title: 'Web Development', desc: 'HTML, CSS & JavaScript websites.', color: 'var(--primary-blue)' },
  { icon: <FaPython />, title: 'Python', desc: 'Beginner programming projects.', color: 'var(--fun-green)' },
  { icon: <FaPalette />, title: 'Graphic Design', desc: 'Canva, branding & creativity.', color: 'var(--fun-pink)' },
  { icon: <FaRobot />, title: 'AI for Kids', desc: 'Safe & creative AI exploration.', color: 'var(--fun-purple)' },
];

const testimonials = [
  { quote: '"My son built his first game in just 2 weeks! He was so proud to show the whole family."', author: 'Aisha M.', role: 'Parent of 9-year-old' },
  { quote: '"Best investment I\'ve made for my daughter. She now designs websites on her own!"', author: 'Emeka O.', role: 'Parent of 12-year-old' },
  { quote: '"My child used to be afraid of computers. Now she teaches me new things every week!"', author: 'Fatima B.', role: 'Parent of 8-year-old' },
  { quote: '"The instructors are amazing with kids. My son asks to go back every Saturday!"', author: 'Tunde A.', role: 'Parent of 11-year-old' },
];

/* ══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const openEnrollModal = (e?: React.MouseEvent) => { if (e) e.preventDefault(); setIsEnrollModalOpen(true); setMobileNavOpen(false); };
  const closeEnrollModal = () => setIsEnrollModalOpen(false);
  const toggleMobileNav = () => setMobileNavOpen(v => !v);
  const closeMobileNav = () => setMobileNavOpen(false);

  const whySlider = useSlider();
  const courseSlider = useSlider();
  const testSlider = useSlider();

  return (
    <main>
      {/* ─── HEADER ─────────────────────────────────────── */}
      <header className={styles.siteHeader}>
        <div className={styles.logo}>
          <span style={{ color: 'var(--secondary-orange)' }}>Codiva</span>
          <span style={{ color: 'var(--primary-blue)' }}>Builders</span>
        </div>
        <nav className={styles.desktopNav}>
          <a href="/summer" style={{ color: 'var(--secondary-orange)', fontWeight: 700 }}>Summer 2026 🔥</a>
          <a href="#programs">Programs</a>
          <a href="#about">About</a>
          <button onClick={() => openEnrollModal()} className={styles.navEnroll}>Enroll</button>
        </nav>
        <button className={`${styles.hamburger} ${mobileNavOpen ? styles.open : ''}`} onClick={toggleMobileNav} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile Overlay */}
      <div className={`${styles.mobileNav} ${mobileNavOpen ? styles.open : ''}`}>
        <a href="/summer" className={styles.mobileNavAccent} onClick={closeMobileNav}>Summer 2026 🔥</a>
        <a href="#programs" onClick={closeMobileNav}>Programs</a>
        <a href="#about" onClick={closeMobileNav}>About</a>
        <a href="#courses" onClick={closeMobileNav}>Courses</a>
        <a href="#contact" onClick={closeMobileNav}>Contact</a>
        <button onClick={() => openEnrollModal()}>Enroll Now</button>
      </div>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <a href="/summer" className={styles.heroPill}>
            <FaRocket style={{ flexShrink: 0 }} /> Summer Innovation Academy 2026 — Registration Open!
          </a>
          <h1 className={styles.heroTitle}>Building Young Tech Minds for the Future</h1>
          <p className={styles.heroSubtitle}>
            Teach your child coding, design, web development, Python, and AI — in a fun and practical way.
          </p>
          <div className={styles.heroButtons}>
            <button onClick={() => openEnrollModal()} className="btn btn-orange">Enroll Now</button>
            <a href="/summer" className="btn btn-secondary" style={{ borderColor: 'var(--secondary-orange)', color: 'var(--secondary-orange)' }}>Summer Camp 2026</a>
          </div>
        </div>
      </section>

      {/* ─── OUR PROGRAMS ───────────────────────────────── */}
      <section className={styles.programs} id="programs">
        <div className="container">
          <h2 className="section-title">Our Programs</h2>
          <p className="section-subtitle">
            Every program is designed to build confidence, creativity, and future-ready skills — at your child&apos;s pace.
          </p>
          <div className={styles.programsGrid}>
            {programs.map((p, i) => (
              <div key={i} className={styles.programCard}>
                {p.badge && <span className={styles.programBadge}>{p.badge}</span>}
                <div className={styles.programIconWrap} style={{ background: p.bg, color: p.color }}>{p.icon}</div>
                <h3 className={styles.programName}>{p.emoji} {p.name}</h3>
                <p className={styles.programDesc}>{p.desc}</p>
                <div className={styles.programMeta}>
                  {p.meta.map((tag, ti) => <span key={ti} className={styles.programMetaTag}>{tag}</span>)}
                </div>
                <div className={styles.programDivider} />
                <div className={styles.programBottom}>
                  <div className={styles.programPrice}>{p.price} <span>{p.priceSuffix}</span></div>
                  <Link href={p.href} className={styles.programBtn}>{p.btn} <FaArrowRight style={{ fontSize: '0.75em' }} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOT SURE — WHATSAPP ─────────────────────────── */}
      <section className={styles.whatsappCta}>
        <div className={styles.whatsappCtaInner}>
          <h2 className={styles.whatsappCtaTitle}>Not Sure Which Program Is Right?</h2>
          <p className={styles.whatsappCtaText}>
            Whether your child is just starting out or ready for advanced projects, our team will help you choose the best path.
          </p>
          <a href={getWhatsAppLink("Hello Codiva Builders, I'd like help choosing a program.")} className={styles.whatsappBtn} target="_blank" rel="noopener noreferrer">
            <FaWhatsapp style={{ fontSize: '1.2em' }} /> Talk to Our Team on WhatsApp
          </a>
        </div>
      </section>

      {/* ─── ABOUT + AGE GROUPS (merged, compact) ─────── */}
      <section className={styles.aboutSection} id="about">
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutTitle}>Who We Are</h2>
              <p className={styles.aboutDesc}>
                Codiva Builders is the kids &amp; teens subsidiary of <strong>Veleon Academy</strong> — helping children aged 5–17 discover coding, AI, and digital creativity through fun, project-based learning.
              </p>
              <p className={styles.aboutDesc} style={{ marginTop: '0.75rem' }}>
                We believe every child can become a creator, builder, and innovator.
              </p>
            </div>
            <div className={styles.ageCards}>
              {[
                { age: 'Ages 5–8', subjects: 'Scratch · Creativity · Basics', color: 'var(--secondary-orange)' },
                { age: 'Ages 9–12', subjects: 'Coding · Web · Design', color: 'var(--primary-blue)' },
                { age: 'Ages 13–17', subjects: 'Python · AI · Career Skills', color: '#10b981' },
              ].map((a, i) => (
                <div key={i} className={styles.ageCard}>
                  <div className={styles.ageLabel} style={{ color: a.color }}>{a.age}</div>
                  <div className={styles.ageSubjects}>{a.subjects}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US — SLIDER ────────────────────────────── */}
      <section className={styles.sliderSection} id="why">
        <div className="container">
          <div className={styles.sliderHeader}>
            <h2 className="section-title" style={{ margin: 0 }}>Why Parents Love Us</h2>
            <div className={styles.sliderArrows}>
              <button onClick={whySlider.scrollLeft} aria-label="Previous" className={styles.arrowBtn}><FaChevronLeft /></button>
              <button onClick={whySlider.scrollRight} aria-label="Next" className={styles.arrowBtn}><FaChevronRight /></button>
            </div>
          </div>
          <div className={styles.sliderTrack} ref={whySlider.ref}>
            {whyUs.map((f, i) => (
              <div key={i} className={`${styles.sliderCard} ${styles.whyCard}`}>
                <div className={styles.sliderIcon} style={{ background: `${f.color}15`, color: f.color }}>{f.icon}</div>
                <h3 className={styles.sliderCardTitle}>{f.title}</h3>
                <p className={styles.sliderCardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT WE TEACH — SLIDER ─────────────────────── */}
      <section className={styles.sliderSection} style={{ background: 'white' }} id="courses">
        <div className="container">
          <div className={styles.sliderHeader}>
            <h2 className="section-title" style={{ margin: 0 }}>What We Teach</h2>
            <div className={styles.sliderArrows}>
              <button onClick={courseSlider.scrollLeft} aria-label="Previous" className={styles.arrowBtn}><FaChevronLeft /></button>
              <button onClick={courseSlider.scrollRight} aria-label="Next" className={styles.arrowBtn}><FaChevronRight /></button>
            </div>
          </div>
          <div className={styles.sliderTrack} ref={courseSlider.ref}>
            {courses.map((c, i) => (
              <div key={i} className={`${styles.sliderCard} ${styles.courseCard}`}>
                <div className={styles.sliderIcon} style={{ background: `${c.color}15`, color: c.color }}>{c.icon}</div>
                <h3 className={styles.sliderCardTitle}>{c.title}</h3>
                <p className={styles.sliderCardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (compact inline) ─────────────── */}
      <section className={styles.stepsSection}>
        <div className="container">
          <h2 className="section-title">3 Simple Steps</h2>
          <div className={styles.stepsRow}>
            {[
              { n: '1', label: 'Choose a Program' },
              { n: '2', label: 'Register Your Child' },
              { n: '3', label: 'Start Learning & Building' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                <div className={styles.step}>
                  <div className={styles.stepNum}>{s.n}</div>
                  <div className={styles.stepLabel}>{s.label}</div>
                </div>
                {i < 2 && <div className={styles.stepLine} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS — SLIDER ──────────────────────── */}
      <section className={styles.sliderSection} style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className={styles.sliderHeader}>
            <h2 className="section-title" style={{ margin: 0 }}>What Parents Say</h2>
            <div className={styles.sliderArrows}>
              <button onClick={testSlider.scrollLeft} aria-label="Previous" className={styles.arrowBtn}><FaChevronLeft /></button>
              <button onClick={testSlider.scrollRight} aria-label="Next" className={styles.arrowBtn}><FaChevronRight /></button>
            </div>
          </div>
          <div className={styles.sliderTrack} ref={testSlider.ref}>
            {testimonials.map((t, i) => (
              <div key={i} className={`${styles.sliderCard} ${styles.testCard}`}>
                <div className={styles.testStars}><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <FaQuoteLeft className={styles.testQuoteIcon} />
                <p className={styles.testQuote}>{t.quote}</p>
                <div className={styles.testAuthor}>{t.author}</div>
                <div className={styles.testRole}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className={styles.cta} id="register">
        <div className="container">
          <span className={styles.ctaHighlight}>Limited Slots Available</span>
          <h2 className={styles.ctaTitle}>Ready to Give Your Child a Head Start?</h2>
          <p className={styles.ctaSubtitle}>Enroll now before the next class begins. Join Codiva Builders today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => openEnrollModal()} className="btn" style={{ background: 'white', color: 'var(--secondary-orange)', fontWeight: 700 }}>Enroll Now</button>
            <a href={getWhatsAppLink()} className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.5)', fontWeight: 700 }}>
              <FaWhatsapp style={{ marginRight: '0.4rem' }} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer id="contact">
        <div className={styles.contact}>
          <div className="container">
            <div className={styles.footerGrid}>
              <div>
                <div className={styles.footerLogo}>
                  <span style={{ color: 'var(--secondary-orange)' }}>Codiva</span>
                  <span style={{ color: 'white' }}>Builders</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>by Veleon Academy</p>
              </div>
              <div className={styles.footerLinks}>
                <Link href="/builder-academy">Builder Academy</Link>
                <Link href="/summer">Summer Camp</Link>
                <Link href="/holiday-camp">Holiday Camp</Link>
                <Link href="/builder-plus">Builder Plus</Link>
                <Link href="/private-coaching">Private Coaching</Link>
                <Link href="/school-partnerships">School Partnerships</Link>
              </div>
              <div className={styles.footerContact}>
                <p>📍 Kwara, Nigeria</p>
                <p>📧 codivabuilders@gmail.com</p>
                <p>📱 @CodivaBuilders</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerBar}>
          © 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.
        </div>
      </footer>

      <EnrollmentForm isOpen={isEnrollModalOpen} onClose={closeEnrollModal} />

      <a href={getWhatsAppLink()} className="whatsapp-float" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp />
      </a>
    </main>
  );
}
