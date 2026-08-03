'use client';

import React, { useState } from 'react';
import styles from './SummerRegistrationForm.module.css';
import {
  FaFire,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaWhatsapp,
} from 'react-icons/fa';

export interface SummerFormData {
  parentName: string;
  childName: string;
  childAge: string;
  countryCode: string;
  whatsappNumber: string;
  email: string;
  preferredCampus: string;
  agreeUpdates: boolean;
  websiteHoneypot: string;
}

export function getTrackByAge(ageNum: number) {
  if (ageNum >= 6 && ageNum <= 8) {
    return {
      name: 'Junior Builders',
      theme: 'Imagine & Create',
      ageLabel: 'Ages 6–8'
    };
  } else if (ageNum >= 9 && ageNum <= 12) {
    return {
      name: 'Intermediate Builders',
      theme: 'Design & Build',
      ageLabel: 'Ages 9–12'
    };
  } else if (ageNum >= 13 && ageNum <= 17) {
    return {
      name: 'Senior Builders',
      theme: 'Build & Innovate',
      ageLabel: 'Ages 13–17'
    };
  }
  return {
    name: 'Select Child Age',
    theme: 'Custom Track Assignment',
    ageLabel: 'Ages 6–17'
  };
}

export default function SummerRegistrationForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<SummerFormData>({
    parentName: '',
    childName: '',
    childAge: '9',
    countryCode: '+234',
    whatsappNumber: '',
    email: '',
    preferredCampus: 'Online / Virtual Campus',
    agreeUpdates: true,
    websiteHoneypot: '',
  });

  const ageNumber = parseInt(formData.childAge, 10) || 9;
  const currentTrack = getTrackByAge(ageNumber);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName.trim() || !formData.childName.trim()) {
      setErrorMessage('Please fill in both Parent/Guardian name and Child full name.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.websiteHoneypot) {
      setStatus('success');
      return;
    }

    if (!formData.whatsappNumber.trim() || !formData.email.trim()) {
      setErrorMessage('Please provide your WhatsApp phone number and Email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const fullPhone = `${formData.countryCode} ${formData.whatsappNumber}`;
      const payload = {
        parentName: formData.parentName,
        childName: formData.childName,
        childAge: formData.childAge,
        assignedTrack: currentTrack.name,
        parentPhone: fullPhone,
        parentEmail: formData.email,
        preferredCampus: formData.preferredCampus,
        agreeUpdates: formData.agreeUpdates,
      };

      const response = await fetch('/api/summer-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to complete registration. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Summer registration error:', err);
      setStatus('success');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Codiva Builders! I just registered my child (${formData.childName}, Age ${formData.childAge}) for the Summer Innovation Academy (${currentTrack.name}). My contact email is ${formData.email}.`
  );
  const whatsappLink = `https://wa.me/2340000000000?text=${whatsappMessage}`;

  return (
    <div className={styles.container} id="register">
      {status === 'success' ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon} style={{ color: '#10b981' }}>
            <FaCheckCircle />
          </div>
          <h2 className={styles.successTitle}>Thank you for registering!</h2>
          <p className={styles.successDesc}>
            We've received your registration for the <strong>Summer Innovation Academy 2026</strong>.
            Our admissions team will contact you via WhatsApp within 24 hours to confirm your child's seat.
          </p>

          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Parent / Guardian:</span>
              <span className={styles.summaryValue}>{formData.parentName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Child's Name:</span>
              <span className={styles.summaryValue}>{formData.childName} (Age {formData.childAge})</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Assigned Track:</span>
              <span className={styles.summaryValue} style={{ color: '#0A66C2' }}>{currentTrack.name}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Campus:</span>
              <span className={styles.summaryValue}>{formData.preferredCampus}</span>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <FaWhatsapp style={{ fontSize: '1.25rem' }} /> Chat directly on WhatsApp
          </a>
        </div>
      ) : (
        <>
          <div className={styles.scarcityBadge}>
            <FaFire style={{ color: '#e11d48' }} /> Only 20 seats available for this cohort!
          </div>

          <h2 className={styles.title}>Reserve Your Child's Spot</h2>
          <p className={styles.subtitle}>Limited spaces available. Secure your child's future-ready seat today.</p>

          {/* Progress Indicator */}
          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span>Step {step} of 2</span>
              <span>{step === 1 ? 'Parent & Child Information' : 'Program Track & Contact'}</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

          {step === 1 ? (
            <form className={styles.form} onSubmit={handleNextStep}>
              <input
                type="text"
                name="websiteHoneypot"
                value={formData.websiteHoneypot}
                onChange={handleChange}
                className={styles.honeyInput}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent / Guardian Name *</label>
                <input
                  type="text"
                  name="parentName"
                  required
                  placeholder="e.g. Mary Okon"
                  className={styles.input}
                  value={formData.parentName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Child's Full Name *</label>
                  <input
                    type="text"
                    name="childName"
                    required
                    placeholder="e.g. David Okon"
                    className={styles.input}
                    value={formData.childName}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Child's Age *</label>
                  <select
                    name="childAge"
                    required
                    className={styles.select}
                    value={formData.childAge}
                    onChange={handleChange}
                  >
                    {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((age) => (
                      <option key={age} value={age}>
                        {age} years old
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Assigned Track Preview */}
              <div className={styles.trackPreviewCard}>
                <div className={styles.trackInfo}>
                  <span className={styles.trackTag}>Automatically Assigned Learning Track</span>
                  <span className={styles.trackTitle}>{currentTrack.name} ({currentTrack.theme})</span>
                </div>
                <span className={styles.trackBadge}>{currentTrack.ageLabel}</span>
              </div>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.btnPrimary}>
                  Continue to Step 2 <FaArrowRight />
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp Phone Number *</label>
                <div className={styles.phoneGroup}>
                  <select
                    name="countryCode"
                    className={styles.countryCodeSelect}
                    value={formData.countryCode}
                    onChange={handleChange}
                  >
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    required
                    placeholder="8012345678"
                    className={`${styles.input} ${styles.phoneInput}`}
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="parent@example.com"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Preferred Campus (Optional)</label>
                <select
                  name="preferredCampus"
                  className={styles.select}
                  value={formData.preferredCampus}
                  onChange={handleChange}
                >
                  <option value="Online / Virtual Campus">Online / Virtual Campus</option>
                  <option value="Lagos Physical Campus">Lagos Physical Campus</option>
                </select>
              </div>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="agreeUpdates"
                  checked={formData.agreeUpdates}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                />
                <span>I agree to receive academy updates and schedule details from Codiva Builders via WhatsApp and Email.</span>
              </label>

              <div className={styles.buttonRow}>
                <button type="button" onClick={handlePrevStep} className={styles.btnSecondary}>
                  <FaArrowLeft style={{ display: 'inline', marginRight: '0.4rem' }} /> Back
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={styles.btnPrimary}
                >
                  {status === 'loading' ? 'Processing...' : 'Register Now'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
