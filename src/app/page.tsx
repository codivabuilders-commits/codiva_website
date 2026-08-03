'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import EnrollmentForm from '../components/EnrollmentForm';
import {
  FaSmile,
  FaTools,
  FaUsers,
  FaGlobe,
  FaChalkboardTeacher,
  FaRocket,
  FaGamepad,
  FaCode,
  FaPython,
  FaPalette,
  FaRobot,
  FaStar,
  FaWhatsapp,
} from 'react-icons/fa';

export default function Home() {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const openEnrollModal = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
  };

  return (
    <main>
      {/* HEADER / NAVIGATION */}
      <header style={{ padding: "1.5rem 2rem", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          <span style={{ color: "var(--secondary-orange)" }}>Codiva</span>
          <span style={{ color: "var(--primary-blue)" }}>Builders</span>
        </div>
        <div className="flex gap-6 items-center" style={{ fontWeight: "600", fontSize: "0.95rem" }}>
          <a href="/summer" style={{ color: "var(--secondary-orange)", fontWeight: "700" }}>Summer 2026 🔥</a>
          <a href="#courses" style={{ color: "var(--foreground)" }}>Programs</a>
          <a href="#about" style={{ color: "var(--foreground)" }}>About</a>
          <button 
            onClick={() => openEnrollModal()} 
            style={{ color: "var(--secondary-orange)", background: "none", border: "none", fontWeight: "600", fontSize: "0.95rem", cursor: "pointer" }}
          >
            Enroll
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className="flex justify-center" style={{ marginBottom: "1rem" }}>
             <a href="/summer" style={{ backgroundColor: "var(--orange-soft)", color: "var(--secondary-orange)", padding: "0.4rem 1.25rem", borderRadius: "9999px", fontWeight: "700", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
               <FaRocket /> Summer Innovation Academy 2026 Registration Open!
             </a>
          </div>
          <h1 className={styles.heroTitle}>Building Young Tech Minds for the Future</h1>
          <p className={styles.heroSubtitle}>
            Teach your child coding, design, web development, Python, and AI in a fun and practical way.
          </p>
          <div className={styles.heroButtons}>
            <button onClick={() => openEnrollModal()} className="btn btn-orange">Enroll Now</button>
            <a href="/summer" className="btn btn-secondary" style={{ borderColor: 'var(--secondary-orange)', color: 'var(--secondary-orange)' }}>Summer Camp 2026</a>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className={`section ${styles.about}`} id="about">
        <div className="container">
          <h2 className="section-title">Who We Are</h2>
          <p className={styles.aboutContent}>
            Codiva Builders is the kids and teens subsidiary of <strong>Veleon Academy</strong>, helping children learn future-ready digital skills through fun, engaging, and project-based learning. <br/><br/>
            We believe every child can become a creator, builder, and innovator.
          </p>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className={`section ${styles.whyUs}`}>
        <div className="container">
          <h2 className="section-title">Why Parents Love Codiva Builders</h2>
          <div className={styles.grid}>
            {[
              { icon: <FaSmile />, title: 'Beginner-friendly', desc: 'Lessons designed for absolute beginners.', color: 'var(--secondary-orange)' },
              { icon: <FaTools />, title: 'Fun Practical Projects', desc: 'Learning by building real-world projects.', color: 'var(--fun-purple)' },
              { icon: <FaUsers />, title: 'Small Class Sizes', desc: 'Personalized attention for every child.', color: 'var(--primary-blue)' },
              { icon: <FaGlobe />, title: 'Online & Physical', desc: 'Flexible learning options available.', color: 'var(--fun-green)' },
              { icon: <FaChalkboardTeacher />, title: 'Skilled Instructors', desc: 'Experienced teachers who love kids.', color: 'var(--fun-pink)' },
              { icon: <FaRocket />, title: 'Confidence Building', desc: 'Empowering children to create.', color: 'var(--fun-yellow)' },
            ].map((feature, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon} style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>{feature.icon}</div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COURSES SECTION */}
      <section className={`section ${styles.courses}`} id="courses">
        <div className="container">
          <h2 className="section-title">Our Programs</h2>
          <p className="section-subtitle">Discover the perfect course for your child's age and interests.</p>
          <div className={styles.grid}>
            {[
              { icon: <FaGamepad />, title: 'Scratch Coding', desc: 'Kids learn logic by creating games and animations.', color: 'var(--secondary-orange)' },
              { icon: <FaCode />, title: 'Web Development', desc: 'Learn to build websites with HTML, CSS & JavaScript.', color: 'var(--primary-blue)' },
              { icon: <FaPython />, title: 'Python Programming', desc: 'Fun coding projects and beginner programming skills.', color: 'var(--fun-green)' },
              { icon: <FaPalette />, title: 'Graphic Design', desc: 'Learn Canva, branding, posters, and creativity.', color: 'var(--fun-pink)' },
              { icon: <FaRobot />, title: 'AI for Kids', desc: 'Learn artificial intelligence tools safely and creatively.', color: 'var(--fun-purple)' },
            ].map((course, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardIcon} style={{ backgroundColor: `${course.color}15`, color: course.color }}>{course.icon}</div>
                <h3 className={styles.cardTitle}>{course.title}</h3>
                <p className={styles.cardDesc}>{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AGE GROUPS */}
      <section className={`section ${styles.ageGroups}`}>
        <div className="container">
          <h2 className="section-title">Programs by Age</h2>
          <div className={styles.grid}>
             <div className={styles.card}>
                <h3 className={styles.cardTitle} style={{ color: "var(--secondary-orange)", fontSize: "1.5rem" }}>Ages 5–8</h3>
                <p className={styles.cardDesc} style={{ marginTop: "1rem", fontWeight: "500", color: "var(--foreground)"}}>Scratch + Creativity + Basics</p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle} style={{ color: "var(--primary-blue)", fontSize: "1.5rem" }}>Ages 9–12</h3>
                <p className={styles.cardDesc} style={{ marginTop: "1rem", fontWeight: "500", color: "var(--foreground)"}}>Coding + Web + Design</p>
              </div>
              <div className={styles.card}>
                <h3 className={styles.cardTitle} style={{ color: "#10b981", fontSize: "1.5rem" }}>Ages 13–17</h3>
                <p className={styles.cardDesc} style={{ marginTop: "1rem", fontWeight: "500", color: "var(--foreground)"}}>Python + AI + Projects + Career Skills</p>
              </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className={`section ${styles.steps}`}>
        <div className="container">
          <h2 className="section-title">Simple 3 Steps</h2>
          <div className={styles.grid}>
             <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3 className={styles.cardTitle}>Choose a Program</h3>
             </div>
             <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3 className={styles.cardTitle}>Register Your Child</h3>
             </div>
             <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3 className={styles.cardTitle}>Start Learning & Building</h3>
             </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className={`section ${styles.testimonials}`}>
        <div className="container">
          <h2 className="section-title">What Parents Say</h2>
          <div className={styles.grid}>
             <div className={styles.testimonialCard}>
                <div className={styles.stars} style={{ color: '#fbbf24', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p>“My son built his first game in 2 weeks!”</p>
             </div>
             <div className={styles.testimonialCard}>
                <div className={styles.stars} style={{ color: '#fbbf24', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p>“Best investment for my daughter.”</p>
             </div>
             <div className={styles.testimonialCard}>
                <div className={styles.stars} style={{ color: '#fbbf24', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p>“Now my child loves learning tech.”</p>
             </div>
          </div>
        </div>
      </section>

      {/* 8. GALLERY / PROJECTS */}
      <section className={`section ${styles.gallery}`}>
        <div className="container">
          <h2 className="section-title">Student Projects & Gallery</h2>
          <p className="section-subtitle">A glimpse into what our kids are creating and experiencing.</p>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryImage}>Scratch Game Screenshot</div>
            <div className={styles.galleryImage}>Website Student Built</div>
            <div className={styles.galleryImage}>Design Poster</div>
            <div className={styles.galleryImage}>Class Photo</div>
            <div className={styles.galleryImage}>Certificate</div>
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className={styles.cta} id="register">
        <div className="container">
          <span className={styles.ctaHighlight}>Limited Slots Available</span>
          <h2 className={styles.ctaTitle}>Ready to Give Your Child a Head Start?</h2>
          <p className={styles.ctaSubtitle}>Enroll now before the next class begins. Join Codiva Builders today.</p>
          <div className="flex justify-center gap-4">
             <button onClick={() => openEnrollModal()} className="btn" style={{ backgroundColor: "var(--white)", color: "var(--secondary-orange)" }}>Enroll Now</button>
             <a href="https://wa.me/2340000000000" className="btn" style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid white" }}>WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* 10. CONTACT SECTION & 11. FOOTER */}
      <footer id="contact">
        <div className={styles.contact}>
           <div className="container flex flex-col items-center text-center gap-4">
              <h2 className="section-title" style={{ color: "white" }}>Contact Us</h2>
              <p>📍 Lagos, Nigeria</p>
              <p>📞 +234 xxx xxx xxxx</p>
              <p>📧 hello@codivabuilders.com</p>
              <p style={{ marginTop: "1rem", fontWeight: "bold" }}>📱 Instagram: <span style={{ color: "var(--secondary-orange)" }}>@CodivaBuilders</span></p>
           </div>
        </div>
        <div className={styles.footer}>
          © 2026 Codiva Builders (Subsidiary of Veleon Academy). All rights reserved.
        </div>
      </footer>

      {/* Enrollment Modal */}
      <EnrollmentForm isOpen={isEnrollModalOpen} onClose={closeEnrollModal} />

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/2340000000000" className="whatsapp-float" aria-label="Chat with us on WhatsApp" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp />
      </a>
    </main>
  );
}
