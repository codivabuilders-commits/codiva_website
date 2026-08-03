import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../program-shared.module.css';
import {
  FaRocket,
  FaCode,
  FaRobot,
  FaPalette,
  FaGamepad,
  FaCheckCircle,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaWhatsapp,
  FaArrowLeft,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Holiday Innovation Camp | Codiva Builders',
  description:
    'A 2-week holiday coding and technology camp for children during Christmas, Easter, and other school breaks. Fun, hands-on learning in Lagos.',
};

const curriculum = [
  { week: 'Day 1–2', title: 'Welcome & Foundations', desc: 'Get set up, meet your team, and start thinking like a builder.' },
  { week: 'Day 3–5', title: 'Scratch Games', desc: 'Build interactive animations and games using Scratch.' },
  { week: 'Day 6–7', title: 'Web Creativity', desc: 'Design and build a simple personal website.' },
  { week: 'Day 8–9', title: 'AI Exploration', desc: 'Explore fun AI tools and see what they can create.' },
  { week: 'Day 10', title: 'Project Showcase', desc: 'Present your holiday project and celebrate your work!' },
];

const faqs = [
  { q: 'When does Holiday Innovation Camp run?', a: 'The camp runs during school holiday periods — Christmas, Easter, and mid-term breaks.' },
  { q: 'What age group is it for?', a: 'The Holiday Camp welcomes children of all ages, with age-appropriate activities and groupings.' },
  { q: 'What will my child build?', a: 'Children will create games, simple websites, and explore AI tools during the camp.' },
  { q: 'Is there a certificate?', a: 'All children receive a participation certificate on the final day of camp.' },
  { q: 'Do I need to bring anything?', a: 'Just bring your child ready to learn! All materials are provided. A laptop is helpful but not required.' },
];

export default function HolidayCampPage() {
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
        <div className={styles.heroBg} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)' }} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge} style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
            🚀 Holiday Program
          </span>
          <h1 className={styles.heroTitle}>Holiday Innovation Camp</h1>
          <p className={styles.heroSubtitle}>
            A short, fun, and action-packed holiday program during Christmas, Easter, and other school breaks — introducing children to coding, AI, and digital creativity.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaTag}><FaCalendarAlt /> 2 Weeks</span>
            <span className={styles.heroMetaTag}><FaClock /> Mon–Fri Daily</span>
            <span className={styles.heroMetaTag}><FaUsers /> All Ages</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/2348000000000?text=Hello!%20I'm%20interested%20in%20the%20Holiday%20Innovation%20Camp."
              className="btn btn-orange"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaWhatsapp /> Register via WhatsApp
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
            The Holiday Innovation Camp is designed to make school holidays productive, fun, and unforgettable. Children build real projects while making friends and discovering their love for technology.
          </p>
          <div className={styles.grid}>
            {[
              { icon: <FaGamepad />, color: '#FF6B00', bg: '#fff7ed', title: 'Game Design', desc: 'Build fun interactive games using Scratch and other creative tools.' },
              { icon: <FaCode />, color: '#0A66C2', bg: '#eff6ff', title: 'Web Creativity', desc: 'Design and build simple websites and digital portfolios.' },
              { icon: <FaRobot />, color: '#8b5cf6', bg: '#f5f3ff', title: 'AI Exploration', desc: 'Discover artificial intelligence in a safe, creative, hands-on way.' },
              { icon: <FaPalette />, color: '#ec4899', bg: '#fdf2f8', title: 'Digital Art', desc: 'Create posters, animations, and digital designs using free tools.' },
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
          <h2 className={styles.sectionTitle}>Camp Schedule</h2>
          <p className={styles.sectionSubtitle}>10 days packed with learning, building, and fun.</p>
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
          <p className={styles.sectionSubtitle}>Affordable holiday learning with everything included.</p>
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--foreground)' }}>Holiday Innovation Camp</h3>
              <div className={styles.priceAmount}>₦30,000</div>
              <div className={styles.pricePeriod}>from, per camp session</div>
              <ul className={styles.priceFeatures}>
                {['10 days of fun learning', 'All materials provided', 'Coding & AI projects', 'Small group setting', 'Friendly expert instructors', 'Participation certificate'].map((f, i) => (
                  <li key={i}><FaCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>
              <a
                href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20register%20for%20the%20Holiday%20Innovation%20Camp."
                className="btn btn-orange"
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FaWhatsapp /> Register Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Common questions about the Holiday Innovation Camp.</p>
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
          <h2 className={styles.ctaTitle}>Make This Holiday Count!</h2>
          <p className={styles.ctaSubtitle}>Give your child a head start with skills that matter. Register for the next Holiday Innovation Camp today.</p>
          <a
            href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20register%20for%20the%20Holiday%20Innovation%20Camp."
            className="btn"
            style={{ background: 'white', color: 'var(--secondary-orange)', fontWeight: '700', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <FaWhatsapp /> Register on WhatsApp
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
