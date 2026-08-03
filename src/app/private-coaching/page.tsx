import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../program-shared.module.css';
import {
  FaUserGraduate,
  FaCode,
  FaRobot,
  FaBullseye,
  FaHeart,
  FaCheckCircle,
  FaClock,
  FaWhatsapp,
  FaArrowLeft,
  FaCalendarCheck,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Private Coaching | Codiva Builders',
  description:
    'Personalized one-on-one coding and technology coaching for children at their own pace. Tailored curriculum, flexible schedule, and expert mentorship at Codiva Builders.',
};

const faqs = [
  { q: 'How does Private Coaching work?', a: 'Private Coaching is a one-on-one session between your child and a dedicated Codiva Builders instructor. The curriculum is fully customized to your child\'s goals and pace.' },
  { q: 'How long is each session?', a: 'Each session is typically 1 to 1.5 hours. The frequency and duration can be adjusted to suit your family\'s schedule.' },
  { q: 'Can I choose what my child learns?', a: 'Yes! We start with an assessment session to understand your child\'s interests and goals, then build a learning plan around them.' },
  { q: 'Is Private Coaching online or physical?', a: 'We offer both online and physical (Lagos) sessions, depending on your preference and availability.' },
  { q: 'How do I book a session?', a: 'Simply message us on WhatsApp or fill out the inquiry form and we\'ll schedule your first session within 48 hours.' },
];

export default function PrivateCoachingPage() {
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
        <div className={styles.heroBg} style={{ background: 'linear-gradient(135deg, #db2777 0%, #be185d 60%, #9d174d 100%)' }} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge} style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>
            👨‍🏫 1-on-1 Coaching
          </span>
          <h1 className={styles.heroTitle}>Private Coaching</h1>
          <p className={styles.heroSubtitle}>
            Personalized one-on-one coaching tailored entirely to your child&apos;s learning goals, pace, and interests. The most effective way to learn technology.
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroMetaTag}><FaClock /> Flexible Schedule</span>
            <span className={styles.heroMetaTag}><FaBullseye /> Personalized Curriculum</span>
            <span className={styles.heroMetaTag}><FaHeart /> Individual Mentorship</span>
            <span className={styles.heroMetaTag}><FaCalendarCheck /> Online & Physical</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20book%20a%20Private%20Coaching%20session%20for%20my%20child."
              className="btn btn-orange"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <FaWhatsapp /> Book a Session
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
          <h2 className={styles.sectionTitle}>Why Private Coaching?</h2>
          <p className={styles.sectionSubtitle}>
            Every child learns differently. Private Coaching gives your child the gift of full attention, a customized learning path, and a mentor who truly gets to know them.
          </p>
          <div className={styles.grid}>
            {[
              { icon: <FaBullseye />, color: '#FF6B00', bg: '#fff7ed', title: 'Fully Personalized', desc: 'Curriculum built around your child\'s specific interests, goals, and current skill level.' },
              { icon: <FaClock />, color: '#0A66C2', bg: '#eff6ff', title: 'Flexible Scheduling', desc: 'Book sessions at times that work for your family — weekdays, weekends, mornings or evenings.' },
              { icon: <FaUserGraduate />, color: '#ec4899', bg: '#fdf2f8', title: 'Expert Mentors', desc: 'Learn from experienced Codiva Builders instructors who specialize in teaching children.' },
              { icon: <FaCode />, color: '#10b981', bg: '#ecfdf5', title: 'Any Topic', desc: 'From Scratch to Python to Web Development to AI — your child chooses what excites them.' },
              { icon: <FaRobot />, color: '#8b5cf6', bg: '#f5f3ff', title: 'Real Projects', desc: 'Every session involves building something real — not just watching videos.' },
              { icon: <FaHeart />, color: '#f59e0b', bg: '#fffbeb', title: 'Progress Tracking', desc: 'Regular parent updates so you always know what your child is learning and achieving.' },
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

      {/* HOW IT WORKS */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>Getting started with Private Coaching is simple.</p>
          <div className={styles.grid} style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
            {[
              { step: '1', title: 'Book a Free Consultation', desc: 'Message us on WhatsApp to schedule a free 20-minute consultation call.' },
              { step: '2', title: 'Assessment & Plan', desc: 'We assess your child\'s current skills and interests and create a custom learning plan.' },
              { step: '3', title: 'Book Your Sessions', desc: 'Choose your preferred days and times. Sessions can be weekly, bi-weekly, or custom.' },
              { step: '4', title: 'Start Learning!', desc: 'Your child starts their personalized learning journey with a dedicated mentor.' },
            ].map((s, i) => (
              <div key={i} className={styles.card} style={{ alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--orange-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.3rem' }}>{s.step}</div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} style={{ background: 'white' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Pricing</h2>
          <p className={styles.sectionSubtitle}>Pay per session, or save with a monthly bundle.</p>
          <div className={styles.grid} style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div className={styles.pricingCard}>
              <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--foreground)' }}>Single Session</h3>
              <div className={styles.priceAmount}>₦15,000</div>
              <div className={styles.pricePeriod}>per 1-hour session</div>
              <ul className={styles.priceFeatures}>
                {['1-on-1 with expert instructor', 'Personalized lesson plan', 'Flexible timing', 'Session notes & resources'].map((f, i) => (
                  <li key={i}><FaCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>
              <a href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20book%20a%20Private%20Coaching%20session." className="btn btn-orange" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <FaWhatsapp /> Book Now
              </a>
            </div>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--foreground)' }}>Monthly Bundle</h3>
              <div className={styles.priceAmount}>₦50,000</div>
              <div className={styles.pricePeriod}>4 sessions per month (save ₦10,000)</div>
              <ul className={styles.priceFeatures}>
                {['4 dedicated sessions', 'Custom learning roadmap', 'Parent progress reports', 'Priority scheduling', 'Email/WhatsApp support'].map((f, i) => (
                  <li key={i}><FaCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}</li>
                ))}
              </ul>
              <a href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20book%20a%20monthly%20bundle%20for%20Private%20Coaching." className="btn btn-orange" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <FaWhatsapp /> Get Bundle
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>Common questions about Private Coaching.</p>
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
          <h2 className={styles.ctaTitle}>Book Your First Session Today</h2>
          <p className={styles.ctaSubtitle}>Your child deserves personalized attention. Start their coding journey at their own pace, with their own goals.</p>
          <a
            href="https://wa.me/2348000000000?text=Hello!%20I'd%20like%20to%20book%20a%20Private%20Coaching%20session%20for%20my%20child."
            className="btn"
            style={{ background: 'white', color: 'var(--secondary-orange)', fontWeight: '700', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <FaWhatsapp /> Book via WhatsApp
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
