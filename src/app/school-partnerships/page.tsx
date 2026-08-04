import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../program-shared.module.css';
import { getWhatsAppLink } from '@/config/contact';
import {
  FaBuilding,
  FaCode,
  FaRobot,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaCheckCircle,
  FaWhatsapp,
  FaArrowLeft,
  FaGraduationCap,
  FaEnvelope,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'School Partnership Program | Codiva Builders',
  description:
    'Partner with Codiva Builders to bring coding, AI, and future-skills programs directly into your school. Flexible, curriculum-aligned technology education for Nigerian schools.',
};

const faqs = [
  { q: 'What schools can partner with Codiva Builders?', a: 'We partner with primary and secondary schools across Lagos and beyond. Whether you\'re a public or private school, we have a program structure that can work for you.' },
  { q: 'How is the curriculum integrated?', a: 'We work with your school\'s schedule to create a program that fits — either as an after-school club, elective subject, or dedicated technology period.' },
  { q: 'Do you provide instructors?', a: 'Yes. Our trained and experienced Codiva Builders instructors come directly to your school to deliver the program.' },
  { q: 'What equipment do students need?', a: 'We can work with your existing computer lab. Where equipment is limited, we can discuss device arrangements.' },
  { q: 'How do we get started?', a: 'Contact us via WhatsApp or email and we will schedule a free consultation to discuss your school\'s needs and propose a tailored partnership plan.' },
];

export default function SchoolPartnershipsPage() {
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
        <div className={styles.heroBg} style={{ background: 'linear-gradient(135deg, #0A66C2 0%, #0550a0 60%, #1e3a8a 100%)' }} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge} style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
            🏢 For Schools
          </span>
          <h1 className={styles.heroTitle}>School Partnership Program</h1>
          <p className={styles.heroSubtitle}>
            Bring coding, AI, and future-skills programs directly into your school. Partner with Codiva Builders to transform how your students learn technology.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaTag}><FaBuilding /> Primary & Secondary</span>
            <span className={styles.heroMetaTag}><FaGraduationCap /> Curriculum-Aligned</span>
            <span className={styles.heroMetaTag}><FaUsers /> In-School Delivery</span>
            <span className={styles.heroMetaTag}><FaHandshake /> Custom Plans</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={getWhatsAppLink("Hello! I'm interested in partnering with Codiva Builders for our school.")}
              className="btn btn-orange"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaWhatsapp /> Partner With Us
            </a>
            <a
              href="mailto:codivabuilders@gmail.com?subject=School%20Partnership%20Inquiry"
              className="btn btn-secondary"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaEnvelope /> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Partner With Us?</h2>
          <p className={styles.sectionSubtitle}>
            Give your students a competitive advantage. Our school partnership programs are designed to complement your curriculum while making technology education fun, practical, and impactful.
          </p>
          <div className={styles.grid}>
            {[
              { icon: <FaCode />, color: '#0A66C2', bg: '#eff6ff', title: 'Expert Delivery', desc: 'Our trained instructors come to your school and deliver engaging, hands-on lessons.' },
              { icon: <FaRobot />, color: '#8b5cf6', bg: '#f5f3ff', title: 'AI & Future Skills', desc: 'Equip students with AI literacy, coding fundamentals, and digital creativity.' },
              { icon: <FaChartLine />, color: '#10b981', bg: '#ecfdf5', title: 'Measurable Progress', desc: 'Regular reports and progress tracking so you can see the impact.' },
              { icon: <FaHandshake />, color: '#FF6B00', bg: '#fff7ed', title: 'Flexible Structures', desc: 'After-school clubs, elective classes, holiday camps, or curriculum integration — your choice.' },
              { icon: <FaUsers />, color: '#ec4899', bg: '#fdf2f8', title: 'Student Certificates', desc: 'Every participating student receives an official Codiva Builders certificate.' },
              { icon: <FaGraduationCap />, color: '#f59e0b', bg: '#fffbeb', title: 'School Branding', desc: 'Co-branded graduation events and Demo Days to showcase your school\'s innovation culture.' },
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

      {/* PARTNERSHIP MODELS */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Partnership Models</h2>
          <p className={styles.sectionSubtitle}>We offer flexible partnership structures to fit your school&apos;s needs and calendar.</p>
          <div className={styles.grid}>
            {[
              { title: 'After-School Tech Club', desc: 'A weekly after-school coding club run by Codiva Builders instructors. Perfect for schools looking to offer extracurricular tech activities.', tag: 'Most Popular' },
              { title: 'School Term Integration', desc: 'A full-term technology program integrated into your school calendar — 12 weeks of structured, curriculum-aligned lessons.', tag: null },
              { title: 'Holiday Innovation Camp', desc: 'Run our Holiday Innovation Camp at your school premises during school breaks. Great for student retention and engagement.', tag: null },
              { title: 'Custom Enterprise Plan', desc: 'For schools that want a fully customized program — including curriculum design, teacher training, and ongoing support.', tag: 'Enterprise' },
            ].map((m, i) => (
              <div key={i} className={styles.card} style={{ position: 'relative', overflow: 'hidden' }}>
                {m.tag && (
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--secondary-orange)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                    {m.tag}
                  </span>
                )}
                <h3 className={styles.cardTitle}>{m.title}</h3>
                <p className={styles.cardDesc}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What&apos;s Included</h2>
          <p className={styles.sectionSubtitle}>Everything your school needs to run a successful technology program.</p>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {[
              'Trained, experienced instructors',
              'Lesson plans & teaching materials',
              'Student workbooks and resources',
              'Progress tracking and reports',
              'Student certificates on completion',
              'Co-branded Demo Day event',
              'Parent communication & updates',
              'Ongoing support from our team',
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <FaCheckCircle style={{ color: '#10b981', flexShrink: 0, fontSize: '1.1rem' }} />
                <span style={{ fontSize: '1rem', color: 'var(--foreground)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Common questions from school administrators and principals.</p>
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
          <h2 className={styles.ctaTitle}>Ready to Partner With Codiva Builders?</h2>
          <p className={styles.ctaSubtitle}>Let&apos;s bring world-class technology education into your school. Contact us today to get started.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={getWhatsAppLink("Hello! I'm interested in the School Partnership Program.")}
              className="btn"
              style={{ background: 'white', color: 'var(--secondary-orange)', fontWeight: '700', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
            <a
              href="mailto:codivabuilders@gmail.com?subject=School%20Partnership%20Inquiry"
              className="btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', fontWeight: '700', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <FaEnvelope /> Send an Email
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className={styles.contact}>
          <p>📍 Lagos, Nigeria &nbsp;|&nbsp; 📧 codivabuilders@gmail.com &nbsp;|&nbsp; 📱 @CodivaBuilders</p>
        </div>
        <div className={styles.footer}>© 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.</div>
      </footer>
    </div>
  );
}
