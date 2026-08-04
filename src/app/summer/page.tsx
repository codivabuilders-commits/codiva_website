import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './summer.module.css';
import SummerRegistrationForm from '@/components/SummerRegistrationForm';
import { getWhatsAppLink } from '@/config/contact';
import {
  FaStar,
  FaRocket,
  FaCalendarAlt,
  FaCalendarWeek,
  FaClock,
  FaLaptopCode,
  FaChild,
  FaGraduationCap,
  FaMoneyBillWave,
  FaTools,
  FaRobot,
  FaCode,
  FaUsers,
  FaChalkboardTeacher,
  FaFolderOpen,
  FaChartLine,
  FaTrophy,
  FaCheckCircle,
  FaPalette,
  FaAward,
  FaMicrophone,
  FaCertificate,
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Codiva Builders | Summer Innovation Academy 2026',
  description:
    'A 4-week hands-on summer technology program for kids & teens aged 6–17. Explore AI, coding, web development, Python, digital creativity, and presentation skills at Codiva Builders, the kids & teens subsidiary of Veleon Academy.',
  openGraph: {
    title: 'Codiva Builders | Summer Innovation Academy 2026',
    description:
      '4-Week Hands-On Summer Tech Program for Ages 6–17. Learn AI, Coding, Python, Web Dev & Design.',
    images: ['/summer_hero.png'],
  },
};

export default function SummerPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Veleon Academy Subsidiary Top Bar Banner */}
      {/* <div className={styles.veleonBanner}>
        <FaStar style={{ color: '#fbbf24', fontSize: '0.9rem' }} />
        <span>Codiva Builders</span> is the kids & teens subsidiary of <span>Veleon Academy</span>. Building young tech leaders of tomorrow!
      </div> */}

      {/* HEADER / NAVIGATION */}
      <header className={styles.header}>
        <a href="/summer" className={styles.logoArea}>
          <span className={styles.brandCodiva}>Codiva</span>
          <span className={styles.brandBuilders}>Builders</span>
          <span className={styles.subsidiaryBadge}>by Veleon Academy</span>
        </a>
        <nav className={styles.navLinks}>
          <a href="#why-us" className={styles.navLink}>Why Us</a>
          <a href="#tracks" className={styles.navLink}>Learning Tracks</a>
          <a href="#schedule" className={styles.navLink}>Schedule</a>
          <a href="#gains" className={styles.navLink}>Outcomes</a>
          <a href="#register" className={`${styles.navLink} ${styles.navCta}`}>
            Register Your Child
          </a>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroPill}>
              <FaRocket style={{ color: '#FF6B00' }} />
              Registration Open for Summer 2026
            </div>
            <h1 className={styles.heroTitle}>
              Summer Innovation <span className={styles.heroTitleGradient}>Academy 2026</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A 4-week hands-on technology program where children learn to create with technology, build real projects, explore AI, and develop future-ready skills.
            </p>
            <div className={styles.heroButtons}>
              <a href="#register" className="btn btn-orange" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 700 }}>
                Register Your Child Now
              </a>
              <a href="#tracks" className="btn btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem', fontWeight: 600 }}>
                Explore Age Tracks ↓
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <Image
              src="/summer_hero.png"
              alt="Happy children learning coding and AI in modern classroom"
              width={600}
              height={400}
              priority
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS SECTION */}
      <section className={styles.highlightsSection}>
        <div className={styles.highlightsGrid}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#0A66C2' }}><FaCalendarAlt /></div>
            <div className={styles.highlightLabel}>4 Weeks</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#8b5cf6' }}><FaCalendarWeek /></div>
            <div className={styles.highlightLabel}>Monday – Friday</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#f59e0b' }}><FaClock /></div>
            <div className={styles.highlightLabel}>9:00 AM – 12:00 PM</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#10b981' }}><FaLaptopCode /></div>
            <div className={styles.highlightLabel}>20 Live Sessions</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#ec4899' }}><FaChild /></div>
            <div className={styles.highlightLabel}>Ages 6–17</div>
          </div>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon} style={{ color: '#0284c7' }}><FaGraduationCap /></div>
            <div className={styles.highlightLabel}>Demo Day & Cert</div>
          </div>
          <div className={styles.highlightCard} style={{ borderColor: '#FF6B00', background: '#fff7ed' }}>
            <div className={styles.highlightIcon} style={{ color: '#FF6B00' }}><FaMoneyBillWave /></div>
            <div className={styles.highlightLabel} style={{ color: '#FF6B00', fontSize: '1.1rem' }}>₦50,000</div>
          </div>
        </div>
      </section>

      {/* ABOUT SUBSIDIARY CALLOUT SECTION */}
      <div style={{ padding: '0 1.5rem', marginTop: '4rem' }}>
        <section className={styles.aboutSection}>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutTitle}>Empowering the Next Generation of Builders</h2>
            <p className={styles.aboutText}>
              <span className={styles.aboutHighlight}>Codiva Builders</span> is the dedicated kids and teens subsidiary of <span className={styles.aboutHighlight}>Veleon Academy</span>. Backed by Veleon Academy’s world-class tech education framework, we combine high-caliber technical mentorship with fun, practical, project-based learning tailored specifically for young minds.
            </p>
          </div>
        </section>
      </div>

      {/* WHY CHOOSE CODIVA BUILDERS SECTION */}
      <section className={styles.section} id="why-us">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Parents Choose Codiva Builders</h2>
          <p className={styles.sectionSubtitle}>
            We provide a world-class academy environment where kids transition from passive screen consumers into creative digital innovators.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {[
            { icon: <FaTools />, title: 'Project-Based Learning', desc: 'Children learn by doing, creating real applications, animations, and websites.', color: '#0A66C2' },
            { icon: <FaRobot />, title: 'AI & Future Skills', desc: 'Introduction to age-appropriate AI tools, logic, and futuristic problem solving.', color: '#8b5cf6' },
            { icon: <FaCode />, title: 'Coding & Digital Creativity', desc: 'Hands-on practice with Scratch, HTML/CSS, Python, and digital design.', color: '#FF6B00' },
            { icon: <FaUsers />, title: 'Small Interactive Classes', desc: 'Low student-to-teacher ratio ensuring every child receives personalized guidance.', color: '#10b981' },
            { icon: <FaChalkboardTeacher />, title: 'Experienced Instructors', desc: 'Vetted Veleon Academy tech mentors who excel at teaching and inspiring kids.', color: '#ec4899' },
            { icon: <FaFolderOpen />, title: 'Student Portfolio', desc: 'Every graduate builds a verified portfolio of completed digital projects.', color: '#0284c7' },
            { icon: <FaChartLine />, title: 'Parent Progress Updates', desc: 'Regular feedback on your child’s weekly milestones and technical growth.', color: '#f59e0b' },
            { icon: <FaTrophy />, title: 'End-of-Camp Demo Day', desc: 'A celebrated presentation event where students present their projects to parents.', color: '#10b981' },
          ].map((item, index) => (
            <div key={index} className={styles.whyCard}>
              <div className={styles.cardIconBox} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEARNING TRACKS SECTION */}
      <section className={styles.section} id="tracks">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Learning Tracks</h2>
          <p className={styles.sectionSubtitle}>
            Curriculum tailored specifically for every age bracket to ensure optimal engagement, comprehension, and skill acquisition.
          </p>
        </div>

        <div className={styles.tracksGrid}>
          {/* Junior Builders */}
          <div className={styles.trackCard}>
            <div className={styles.trackHeader}>
              <span className={styles.trackAgeBadge}>Ages 6–8</span>
              <h3 className={styles.trackTitle}>Junior Builders</h3>
              <div className={styles.trackTheme}>Theme: Imagine & Create</div>
            </div>
            <div className={styles.trackListTitle}>Students Explore:</div>
            <ul className={styles.trackList}>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Scratch Visual Coding</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Digital Art & Graphic Design</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Interactive Storytelling</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Creative Game Creation</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Basic AI Exploration</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Presentation Skills</li>
            </ul>
            <a href="#register" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
              Register for Junior Track
            </a>
          </div>

          {/* Intermediate Builders */}
          <div className={styles.trackCard} style={{ borderColor: '#0A66C2', boxShadow: '0 12px 30px rgba(10,102,194,0.1)' }}>
            <div className={styles.trackHeader}>
              <span className={styles.trackAgeBadge} style={{ background: '#eff6ff', color: '#0A66C2' }}>Ages 9–12</span>
              <h3 className={styles.trackTitle}>Intermediate Builders</h3>
              <div className={styles.trackTheme}>Theme: Design & Build</div>
            </div>
            <div className={styles.trackListTitle}>Students Explore:</div>
            <ul className={styles.trackList}>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Advanced Scratch Programming</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Canva Graphics & Branding</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> HTML & CSS Web Basics</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Modern AI Tools</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Creative Project Building</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Presentation Skills</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Digital Entrepreneurship</li>
            </ul>
            <a href="#register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Register for Intermediate Track
            </a>
          </div>

          {/* Senior Builders */}
          <div className={styles.trackCard}>
            <div className={styles.trackHeader}>
              <span className={styles.trackAgeBadge} style={{ background: '#f0fdf4', color: '#10b981' }}>Ages 13–17</span>
              <h3 className={styles.trackTitle}>Senior Builders</h3>
              <div className={styles.trackTheme}>Theme: Build & Innovate</div>
            </div>
            <div className={styles.trackListTitle}>Students Explore:</div>
            <ul className={styles.trackList}>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> HTML & CSS Web Development</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Beginner Python Programming</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> AI Prompting & Productivity Tools</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> UI/UX Design Fundamentals</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Pitch & Presentation Skills</li>
              <li className={styles.trackItem}><span className={styles.trackItemIcon}><FaCheckCircle /></span> Tech Entrepreneurship</li>
            </ul>
            <a href="#register" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Register for Senior Track
            </a>
          </div>
        </div>
      </section>

      {/* PROGRAM SCHEDULE SECTION (TIMELINE) */}
      <section className={styles.section} id="schedule">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Program Schedule</h2>
          <p className={styles.sectionSubtitle}>
            A structured 4-week roadmap designed for maximum learning retention and project completion.
          </p>
        </div>

        <div className={styles.timelineWrapper}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineHeader}>Program Duration</div>
            <div className={styles.timelineTitle}>4 Weeks of Intensive Learning</div>
            <p style={{ color: '#64748b', marginTop: '0.4rem' }}>20 live hands-on instructor-led sessions packed with guided coding and creative exercises.</p>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineHeader}>Weekly Cadence</div>
            <div className={styles.timelineTitle}>Monday – Friday</div>
            <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Consistent daily immersion ensures fast progress and solid skill mastery.</p>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineHeader}>Daily Class Hours</div>
            <div className={styles.timelineTitle}>9:00 AM – 12:00 PM</div>
            <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Morning sessions optimal for children’s energy, concentration, and practical problem solving.</p>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineHeader}>Grand Graduation</div>
            <div className={styles.timelineTitle}>Demo Day & Certificate Presentation</div>
            <p style={{ color: '#64748b', marginTop: '0.4rem' }}>Final day celebration where students showcase their projects to parents and earn their verified academy certificate.</p>
          </div>
        </div>
      </section>

      {/* WHAT EVERY CHILD WILL GAIN SECTION */}
      <section className={styles.section} id="gains">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Every Child Will Gain</h2>
          <p className={styles.sectionSubtitle}>Beyond technical knowledge, our academy builds confidence and future readiness.</p>
        </div>

        <div className={styles.gainsCompactGrid}>
          {[
            { icon: <FaRocket style={{ color: '#FF6B00' }} />, text: 'Build real-world projects' },
            { icon: <FaPalette style={{ color: '#ec4899' }} />, text: 'Improve creative thinking' },
            { icon: <FaLaptopCode style={{ color: '#0A66C2' }} />, text: 'Learn coding fundamentals' },
            { icon: <FaRobot style={{ color: '#8b5cf6' }} />, text: 'Explore AI & future skills' },
            { icon: <FaAward style={{ color: '#f59e0b' }} />, text: 'Build self-confidence' },
            { icon: <FaMicrophone style={{ color: '#10b981' }} />, text: 'Master presentation skills' },
            { icon: <FaFolderOpen style={{ color: '#0284c7' }} />, text: 'Personal digital portfolio' },
            { icon: <FaCertificate style={{ color: '#10b981' }} />, text: 'Certificate of Completion' },
          ].map((gain, index) => (
            <div key={index} className={styles.gainPill}>
              <span className={styles.gainPillIcon}>{gain.icon}</span>
              <span className={styles.gainPillText}>{gain.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '2.5rem 1.5rem 4rem', background: '#f8fafc' }}>
        <SummerRegistrationForm />
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrandTitle}>Codiva Builders</div>
            <div className={styles.footerTagline}>Build. Create. Innovate.</div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '360px' }}>
              The kids & teens tech subsidiary of <strong>Veleon Academy</strong>. Empowering young innovators with coding, design, and AI skills.
            </p>
          </div>

          <div>
            <div className={styles.footerColTitle}>Quick Links</div>
            <ul className={styles.footerList}>
              <li><a href="#why-us">Why Choose Us</a></li>
              <li><a href="#tracks">Learning Tracks</a></li>
              <li><a href="#schedule">Program Schedule</a></li>
              <li><a href="#register">Register Child</a></li>
            </ul>
          </div>

          <div>
            <div className={styles.footerColTitle}>Contact Admissions</div>
            <ul className={styles.footerList}>
              <li><FaWhatsapp style={{ color: '#25D366', marginRight: '0.4rem' }} /> WhatsApp: +234 8105281572</li>
              <li><FaEnvelope style={{ color: '#0A66C2', marginRight: '0.4rem' }} /> Email: codivabuilders@gmail.com</li>
              <li><FaInstagram style={{ color: '#ec4899', marginRight: '0.4rem' }} /> Instagram: @codivabuilders</li>
              <li><FaFacebook style={{ color: '#1877F2', marginRight: '0.4rem' }} /> Facebook: Codiva Builders</li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          © 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.
        </div>
      </footer>

      {/* STICKY MOBILE CTA BAR */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.mobileStickyText}>
          Summer Academy 2026 • <span className={styles.mobileStickyPrice}>₦50,000</span>
        </div>
        <a href="#register" className="btn btn-orange" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: 700 }}>
          Register Now
        </a>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={getWhatsAppLink()}
        className="whatsapp-float"
        aria-label="Chat with Codiva Builders on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
