import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../program-shared.module.css';
import {
  FaBolt,
  FaCode,
  FaRobot,
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaWhatsapp,
  FaArrowLeft,
  FaBriefcase,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Builder Plus | Codiva Builders',
  description:
    'An accelerated 12-week learning pathway for children who want deeper coding, AI projects, competitions, and mentorship at Codiva Builders.',
};

const curriculum = [
  { week: 'Weeks 1–2', title: 'Advanced Foundations', desc: 'Deep-dive into programming logic, data structures, and problem-solving frameworks.' },
  { week: 'Weeks 3–4', title: 'Web Development Mastery', desc: 'Build fully functional websites with JavaScript interactivity and responsive design.' },
  { week: 'Weeks 5–6', title: 'Python & Data Science', desc: 'Explore Python beyond basics — lists, functions, APIs, and real-world data.' },
  { week: 'Weeks 7–8', title: 'AI & Machine Learning', desc: 'Build and train simple AI models, explore ML tools, and create AI-powered projects.' },
  { week: 'Weeks 9–10', title: 'Competitions Prep', desc: 'Prepare for coding competitions and hackathons with guided practice sessions.' },
  { week: 'Weeks 11–12', title: 'Portfolio & Showcase', desc: 'Build and refine your personal portfolio. Showcase your projects to mentors and peers.' },
];

const faqs = [
  { q: 'Who is Builder Plus designed for?', a: 'Builder Plus is for children who have completed Builder Academy or have prior coding experience and want to go further and deeper.' },
  { q: 'How is it different from Builder Academy?', a: 'Builder Plus is faster-paced, covers more advanced content, includes competitions and portfolio development, and meets twice a week.' },
  { q: 'What competitions will children participate in?', a: 'We prepare students for coding competitions, hackathons, and tech showcases. We guide them in selecting appropriate competitions.' },
  { q: 'What does the portfolio include?', a: 'By the end, each student has a live personal portfolio website featuring at least 3 real projects they\'ve built during the program.' },
  { q: 'Is there an age restriction?', a: 'Builder Plus is best suited for ages 10–17. Younger applicants may be assessed individually.' },
];

export default function BuilderPlusPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* HEADER */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <span style={{ color: 'var(--secondary-orange)' }}>Codiva</span>
          <span style={{ color: 'var(--primary-blue)' }}>Builders</span>
        </Link>
        <nav className={styles.desktopNav}>
          <Link href="/#programs" style={{ color: 'var(--text-muted)' }}>Programs</Link>
          <Link href="/#about" style={{ color: 'var(--text-muted)' }}>About</Link>
          <Link href="/#contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #5b21b6 100%)' }} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge} style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
            ⭐ Advanced Program
          </span>
          <h1 className={styles.heroTitle}>Builder Plus</h1>
          <p className={styles.heroSubtitle}>
            An accelerated learning pathway for students who are ready for deeper learning, advanced projects, competitions, and professional mentorship.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaTag}><FaCalendarAlt /> 12 Weeks</span>
            <span className={styles.heroMetaTag}><FaClock /> 2× per week</span>
            <span className={styles.heroMetaTag}><FaTrophy /> Competitions</span>
            <span className={styles.heroMetaTag}><FaBriefcase /> Portfolio Dev</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/2348000000000?text=Hello!%20I'm%20interested%20in%20Builder%20Plus."
              className="btn btn-orange"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaWhatsapp /> Enroll via WhatsApp
            </a>
            <Link href="/" className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Program Overview</h2>
          <p className={styles.sectionSubtitle}>
            Builder Plus is for the students who aren&apos;t satisfied with the basics. It&apos;s an intensive, focused program that challenges children to build, compete, and create at a higher level.
          </p>
          <div className={styles.grid}>
            {[
              { icon: <FaCode />, color: '#0A66C2', bg: '#eff6ff', title: 'Advanced Coding', desc: 'Python, JavaScript, APIs, and more — going deeper than the fundamentals.' },
              { icon: <FaRobot />, color: '#8b5cf6', bg: '#f5f3ff', title: 'AI & Machine Learning', desc: 'Build and train simple AI models and integrate them into real projects.' },
              { icon: <FaTrophy />, color: '#f59e0b', bg: '#fffbeb', title: 'Competitions', desc: 'Guided preparation for coding competitions and hackathons.' },
              { icon: <FaChartLine />, color: '#10b981', bg: '#ecfdf5', title: 'Portfolio Development', desc: 'Build a professional portfolio with 3+ real projects that showcases your skills.' },
              { icon: <FaUsers />, color: '#ec4899', bg: '#fdf2f8', title: '1-on-1 Mentorship', desc: 'Regular check-ins with expert mentors to guide your progress.' },
              { icon: <FaBolt />, color: '#FF6B00', bg: '#fff7ed', title: 'Accelerated Learning', desc: 'A faster-paced curriculum designed for students who want to move quickly.' },
            ].map((item, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon} style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>12-Week Curriculum</h2>
          <p className={styles.sectionSubtitle}>From advanced coding fundamentals to portfolio-ready projects.</p>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {curriculum.map((item, i) => (
              <div key={i} className={styles.curriculumItem}>
                <div className={styles.curriculumWeek}>{item.week}</div>
                <div>
                  <div className={styles.curriculumTitle}>{item.title}</div>
                  <div className={styles.curriculumDesc}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <p className={styles.sectionSubtitle}>An investment in your child&apos;s advanced technology future.</p>
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--foreground)' }}>Builder Plus</h3>
              <div className={styles.priceAmount}>₦75,000</div>
              <div className={styles.pricePeriod}>per school term</div>
              <ul className={styles.priceFeatures}>
                {['2 sessions per week', 'Advanced curriculum', 'Competition preparation', 'Portfolio development', 'Expert mentorship', 'Real project builds', 'Completion certificate'].map((f, i) => (
                  <li key={i}><FaCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>
              <a
                href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20enroll%20in%20Builder%20Plus."
                className="btn btn-orange"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FaWhatsapp /> Enroll Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Everything you need to know about Builder Plus.</p>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <div className={styles.faqQuestion} style={{ cursor: 'default' }}><span>{faq.q}</span></div>
                <div className={styles.faqAnswer}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaStrip}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Take Your Child to the Next Level</h2>
          <p className={styles.ctaSubtitle}>Builder Plus is for students who are ready to go further. Enroll today and unlock their full potential.</p>
          <a
            href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20enroll%20my%20child%20in%20Builder%20Plus."
            className="btn"
            style={{ background: 'white', color: 'var(--secondary-orange)', fontWeight: '700', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <FaWhatsapp /> Enroll on WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className={styles.contact}>
          <p>📍 Lagos, Nigeria &nbsp;|&nbsp; 📧 hello@codivabuilders.com &nbsp;|&nbsp; 📱 @CodivaBuilders</p>
        </div>
        <div className={styles.footer}>© 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.</div>
      </footer>
    </div>
  );
}
