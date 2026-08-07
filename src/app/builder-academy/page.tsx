import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../program-shared.module.css';
import { getWhatsAppLink } from '@/config/contact';
import {
  FaSchool,
  FaRocket,
  FaCode,
  FaRobot,
  FaPalette,
  FaTrophy,
  FaCheckCircle,
  FaCertificate,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaWhatsapp,
  FaArrowLeft,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Builder Academy | Codiva Builders',
  description:
    'Our flagship 12-week school-term program where children aged 6–17 learn coding, AI, digital creativity, and problem-solving through hands-on projects. Saturdays in Kwara.',
};

const curriculum = [
  { week: 'Weeks 1–2', title: 'Foundations', desc: 'Introduction to tech thinking, digital tools, and setting up your builder workspace.' },
  { week: 'Weeks 3–5', title: 'Scratch & Game Design', desc: 'Build interactive games and animations using block-based coding.' },
  { week: 'Weeks 6–8', title: 'Web Development', desc: 'Create personal websites with HTML, CSS, and basic JavaScript.' },
  { week: 'Weeks 9–10', title: 'Python & AI Basics', desc: 'Introduction to Python programming and exploring AI tools creatively.' },
  { week: 'Week 11', title: 'Project Sprint', desc: 'Each child builds and polishes their final project with mentor guidance.' },
  { week: 'Week 12', title: 'Demo Day & Certificates', desc: 'Present your project, receive your certificate, and celebrate your achievements!' },
];

const faqs = [
  { q: 'What age group is Builder Academy for?', a: 'Builder Academy is designed for children aged 6–17. We have age-appropriate tracks within the program.' },
  { q: 'When are classes held?', a: 'Classes run on Saturdays during school term. Each session is 2.5–3 hours.' },
  { q: 'Is there a certificate at the end?', a: 'Yes! Every child who completes the program receives an official Codiva Builders certificate and participates in Demo Day.' },
  { q: 'Do children need prior experience?', a: 'No prior experience is required. Builder Academy is beginner-friendly and starts from the very basics.' },
  { q: 'What is included in the fee?', a: 'The fee covers all learning materials, project resources, mentorship, and the end-of-term certificate.' },
];

export default function BuilderAcademyPage() {
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
        <div className={styles.heroBg} style={{ background: 'linear-gradient(135deg, #0A66C2 0%, #0550a0 60%, #1e40af 100%)' }} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge} style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
            🏫 Our Flagship Program
          </span>
          <h1 className={styles.heroTitle}>Builder Academy</h1>
          <p className={styles.heroSubtitle}>
            Our 12-week school-term program where children learn coding, AI, digital creativity, and problem-solving through exciting, hands-on projects.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaTag}><FaUsers /> Ages 6–17</span>
            <span className={styles.heroMetaTag}><FaCalendarAlt /> 12-Week Term</span>
            <span className={styles.heroMetaTag}><FaClock /> Saturdays</span>
            <span className={styles.heroMetaTag}><FaCertificate /> Certificate Included</span>
            <span className={styles.heroMetaTag}><FaTrophy /> Demo Day</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={getWhatsAppLink("Hello! I'm interested in enrolling in Builder Academy.")}
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
            Builder Academy gives children the skills, confidence, and portfolio to thrive in a technology-driven world — through structured learning, real projects, and expert mentorship.
          </p>
          <div className={styles.grid}>
            {[
              { icon: <FaCode />, color: '#0A66C2', bg: '#eff6ff', title: 'Coding Fundamentals', desc: 'Scratch, HTML, CSS, JavaScript, and Python — at the right level for every age.' },
              { icon: <FaRobot />, color: '#8b5cf6', bg: '#f5f3ff', title: 'AI & Future Skills', desc: 'Hands-on exploration of artificial intelligence tools and creative applications.' },
              { icon: <FaPalette />, color: '#ec4899', bg: '#fdf2f8', title: 'Digital Creativity', desc: 'Graphic design, digital storytelling, and building visually impressive projects.' },
              { icon: <FaTrophy />, color: '#f59e0b', bg: '#fffbeb', title: 'Demo Day', desc: 'Every term ends with a showcase where children present their projects to family.' },
              { icon: <FaUsers />, color: '#10b981', bg: '#ecfdf5', title: 'Small Class Sizes', desc: 'Personalized attention with small groups so every child gets the support they need.' },
              { icon: <FaCertificate />, color: '#FF6B00', bg: '#fff7ed', title: 'Certificate', desc: 'Official Codiva Builders completion certificate to recognize each child\'s achievement.' },
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
          <p className={styles.sectionSubtitle}>A structured, progressive learning journey from foundations to final project.</p>
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

      {/* SCHEDULE */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Schedule</h2>
          <p className={styles.sectionSubtitle}>Designed to fit around your child's school week.</p>
          <div className={styles.grid} style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
            {[
              { label: 'Day', value: 'Saturday', icon: '📅' },
              { label: 'Time', value: '9:00 AM – 12:00 PM', icon: '🕘' },
              { label: 'Duration', value: '12 Weeks per Term', icon: '📆' },
              { label: 'Location', value: 'Kwara (Physical + Online)', icon: '📍' },
            ].map((s, i) => (
              <div key={i} className={styles.card} style={{ alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--foreground)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} style={{ background: 'var(--orange-soft)' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <p className={styles.sectionSubtitle}>Simple, transparent pricing with everything included.</p>
          <div style={{ maxWidth: '420px', margin: '0 auto' }}>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <h3 style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--foreground)' }}>Builder Academy</h3>
              <div className={styles.priceAmount}>₦40,000</div>
              <div className={styles.pricePeriod}>per school term</div>
              <ul className={styles.priceFeatures}>
                {['12 Saturday sessions', 'All learning materials', 'Hands-on projects', 'AI & coding curriculum', 'Expert mentors', 'Demo Day participation', 'Completion certificate'].map((f, i) => (
                  <li key={i}><FaCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>
              <a
                href={getWhatsAppLink("Hello! I'd like to enroll in Builder Academy.")}
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
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Everything parents want to know about Builder Academy.</p>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <div className={styles.faqQuestion} style={{ cursor: 'default' }}>
                  <span>{faq.q}</span>
                </div>
                <div className={styles.faqAnswer}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaStrip}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to Enroll in Builder Academy?</h2>
          <p className={styles.ctaSubtitle}>Secure your child&apos;s spot before the next term begins. Limited spaces available.</p>
          <a
            href={getWhatsAppLink("Hello! I'd like to register my child for Builder Academy.")}
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
          <p>📍 Kwara, Nigeria &nbsp;|&nbsp; 📧 codivabuilders@gmail.com &nbsp;|&nbsp; 📱 @CodivaBuilders</p>
        </div>
        <div className={styles.footer}>© 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.</div>
      </footer>
    </div>
  );
}
