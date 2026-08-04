'use client';

import React, { useState } from 'react';
import styles from './SummerRegistrationForm.module.css';
import { API_BASE_URL } from '@/config/api';
import { getWhatsAppLink, DISPLAY_PHONE } from '@/config/contact';
import { initializePaystackPayment } from '@/utils/paystack';
import {
  FaFire,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaWhatsapp,
  FaPlus,
  FaTrash,
  FaCreditCard,
  FaBookmark,
  FaPrint,
  FaFileInvoiceDollar,
} from 'react-icons/fa';

export interface SummerChildEntry {
  name: string;
  age: string;
  campus: string;
}

const tracksData = [
  { minAge: 6, maxAge: 8, name: 'Junior Builders (Explore & Play)', ageLabel: 'Ages 6–8', tools: 'Scratch Jr, Block Coding, Canva' },
  { minAge: 9, maxAge: 12, name: 'Intermediate Builders (Design & Build)', ageLabel: 'Ages 9–12', tools: 'Scratch 3.0, HTML/CSS, AI Tools' },
  { minAge: 13, maxAge: 17, name: 'Senior Builders (Build & Innovate)', ageLabel: 'Ages 13–17', tools: 'Python, Web Apps, Generative AI' },
];

function getTrackByAge(ageNum: number) {
  if (ageNum <= 8) return tracksData[0];
  if (ageNum <= 12) return tracksData[1];
  return tracksData[2];
}

export default function SummerRegistrationForm() {
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [parentName, setParentName] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCampus, setPreferredCampus] = useState('Online / Virtual Campus');
  const [agreeUpdates, setAgreeUpdates] = useState(true);

  // Multi-children state
  const [children, setChildren] = useState<SummerChildEntry[]>([
    { name: '', age: '9', campus: 'Online / Virtual Campus' },
  ]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedRegistration, setSavedRegistration] = useState<any>(null);

  // Dynamic Pricing Engine (₦50,000 flat per child base)
  const basePricePerChild = 50000;
  const childCount = children.length;
  const rawSubtotal = childCount * basePricePerChild;
  const discountPercentage = childCount >= 2 ? 0.2 : 0;
  const discountAmount = rawSubtotal * discountPercentage;
  const finalTotal = rawSubtotal - discountAmount;
  const hasDiscount = childCount >= 2;

  const handleAddChild = () => {
    setChildren([...children, { name: '', age: '9', campus: 'Online / Virtual Campus' }]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const handleChildChange = (index: number, field: keyof SummerChildEntry, value: string) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) {
      setErrorMessage('Please enter parent full name.');
      return;
    }
    const invalidChild = children.find((c) => !c.name.trim());
    if (invalidChild) {
      setErrorMessage('Please enter full name for all children.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    setStep(1);
  };

  const executeRegistration = async (paymentMethod: 'Paystack' | 'Pay Later', paymentRef?: string) => {
    setStatus('loading');
    setErrorMessage('');

    const fullPhone = `${countryCode} ${whatsappNumber}`.trim();

    const processedChildren = children.map((c) => {
      const ageNum = parseInt(c.age, 10) || 9;
      const track = getTrackByAge(ageNum);
      return {
        name: c.name,
        age: c.age,
        course: track.name,
        schedule: c.campus || preferredCampus,
      };
    });

    const payload = {
      parentName,
      parentPhone: fullPhone,
      parentEmail: email,
      children: processedChildren,
      preferredCampus,
      agreeUpdates,
      basePricePerChild,
      paymentMethod,
      paymentStatus: paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment',
      paymentReference: paymentRef || `CBD_SUMMER_${Date.now()}`,
    };

    try {
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/summer-register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        response = await fetch('/api/summer-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      const resData = await response.json();
      if (response.ok || resData.data) {
        setSavedRegistration({
          parentName,
          parentPhone: fullPhone,
          email,
          children: processedChildren,
          finalTotal,
          discountAmount,
          paymentMethod,
          paymentStatus: payload.paymentStatus,
          reference: payload.paymentReference,
        });
        setStatus('success');
      } else {
        setErrorMessage(resData.error || 'Failed to complete registration.');
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Network error occurred. Please check your connection.');
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    initializePaystackPayment({
      email,
      amountNaira: finalTotal,
      metadata: { parentName, parentPhone: `${countryCode} ${whatsappNumber}` },
      onSuccess: (ref) => executeRegistration('Paystack', ref),
      onError: (err) => setErrorMessage(err),
    });
  };

  const handlePayLater = (e: React.FormEvent) => {
    e.preventDefault();
    executeRegistration('Pay Later');
  };

  const isPaid = savedRegistration?.paymentStatus === 'Paid';

  const whatsappMessage = savedRegistration
    ? isPaid
      ? `Hello Codiva Builders! 🎉 I completed payment for Summer Innovation Academy 2026.\n` +
        `Parent: ${savedRegistration.parentName}\n` +
        `Children: ${savedRegistration.children.map((c: any) => `${c.name} (${c.course})`).join(', ')}\n` +
        `Total Paid: ₦${savedRegistration.finalTotal.toLocaleString()}\n` +
        `Ref: ${savedRegistration.reference}`
      : `Hello Codiva Builders! 🔒 I reserved a seat for Summer Innovation Academy 2026.\n` +
        `Parent: ${savedRegistration.parentName}\n` +
        `Children: ${savedRegistration.children.map((c: any) => `${c.name} (${c.course})`).join(', ')}\n` +
        `Total Due: ₦${savedRegistration.finalTotal.toLocaleString()}\n` +
        `Ref: ${savedRegistration.reference}`
    : 'Hello Codiva Builders! I have a question about summer registration.';

  return (
    <div className={styles.container} id="register">
      {status === 'success' && savedRegistration ? (
        <div className={styles.successContainer}>
          <div className={styles.successIcon} style={{ color: isPaid ? '#10b981' : '#f59e0b' }}>
            {isPaid ? <FaCheckCircle /> : <FaBookmark />}
          </div>
          
          <h2 className={styles.successTitle}>
            {isPaid ? '🎉 Congratulations! Registration Complete' : '🔒 Seat Secured Successfully!'}
          </h2>
          
          <p className={styles.successDesc}>
            {isPaid ? (
              <>
                Your child has been successfully enrolled in <strong>Codiva Builders Summer Program</strong>.
                <br />
                A confirmation receipt has been generated. We can't wait to meet your child!
              </>
            ) : (
              <>
                Your seat has been reserved for <strong>Summer Innovation Academy 2026</strong>!
                <br />
                Please review your proforma invoice below and complete payment to finalize registration.
              </>
            )}
          </p>

          <div className={styles.summaryCard} id="summer-receipt">
            {/* Header Branding (Visible on Print & Screen) */}
            <div className={styles.printHeader}>
              <div className={styles.brandTitle}>
                <span style={{ color: '#FF6B00' }}>Codiva</span>
                <span style={{ color: '#0A66C2' }}>Builders</span>
              </div>
              <div className={styles.brandSub}>Summer Innovation Academy 2026 • Codiva Builders</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>
                {isPaid ? 'OFFICIAL PAYMENT RECEIPT' : 'PROFORMA INVOICE / SEAT RESERVATION'}
              </span>
              <span style={{ fontWeight: 700, color: isPaid ? '#16a34a' : '#d97706' }}>
                {isPaid ? 'Paid ✓' : 'Seat Reserved (Pending Payment)'}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Parent / Guardian:</span>
              <span className={styles.summaryValue}>{savedRegistration.parentName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Phone / Email:</span>
              <span className={styles.summaryValue}>{savedRegistration.parentPhone} ({savedRegistration.email})</span>
            </div>

            <div style={{ margin: '0.75rem 0', background: '#eff6ff', padding: '0.75rem', borderRadius: '8px' }}>
              <strong style={{ fontSize: '0.85rem', color: '#0A66C2' }}>Enrolled Children:</strong>
              {savedRegistration.children.map((c: any, idx: number) => (
                <div key={idx} style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  • <strong>{c.name}</strong> (Age {c.age}) — {c.course} ({c.schedule})
                </div>
              ))}
            </div>

            {savedRegistration.discountAmount > 0 && (
              <div className={styles.summaryRow} style={{ color: '#16a34a', fontWeight: 700 }}>
                <span className={styles.summaryLabel}>Multi-child Savings (20% Off):</span>
                <span className={styles.summaryValue}>-₦{savedRegistration.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className={styles.summaryRow} style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '0.5rem' }}>
              <span className={styles.summaryLabel}>{isPaid ? 'Total Paid:' : 'Total Due:'}</span>
              <span className={styles.summaryValue}>₦{savedRegistration.finalTotal.toLocaleString()}</span>
            </div>

            <div className={styles.summaryRow} style={{ fontSize: '0.8rem', color: '#94a3a8', marginTop: '0.5rem' }}>
              <span>Ref Code: {savedRegistration.reference}</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            {/* Bank Transfer Instructions for Unpaid Reserved Seats */}
            {!isPaid && (
              <div className={styles.bankDetailsBox}>
                <div className={styles.bankHeader}>
                  <span className={styles.bankTitleIcon}>⚡</span>
                  <div>
                    <div className={styles.bankTitle}>Fast Manual Bank Transfer</div>
                    <div className={styles.bankSubText}>For quick seat confirmation, pay directly into this account:</div>
                  </div>
                </div>

                <div className={styles.bankGrid}>
                  <div className={styles.bankField}>
                    <span className={styles.bankLabel}>Bank Name</span>
                    <strong className={styles.bankValue}>GTBank (Guaranty Trust)</strong>
                  </div>
                  <div className={styles.bankField}>
                    <span className={styles.bankLabel}>Account Name</span>
                    <strong className={styles.bankValue}>Omidoyin Ayodeji</strong>
                  </div>
                  <div className={styles.bankFieldFull}>
                    <span className={styles.bankLabel}>Account Number</span>
                    <div className={styles.accountNumberBadge}>
                      <span className={styles.accountNumText}>0212516916</span>
                    </div>
                  </div>
                  <div className={styles.bankField}>
                    <span className={styles.bankLabel}>Payment Reference</span>
                    <strong className={styles.bankValue}>{savedRegistration.reference}</strong>
                  </div>
                </div>

                <div className={styles.bankNote}>
                  📲 <strong>Next Step:</strong> After completing transfer, send proof/receipt on WhatsApp to <strong>{DISPLAY_PHONE}</strong> for immediate seat confirmation.
                </div>
              </div>
            )}

            {/* Footer Branding (Visible on Print & Screen) */}
            <div className={styles.printFooter}>
              <div>📍 Lagos, Nigeria | 📧 codivabuilders@gmail.com | 📱 {DISPLAY_PHONE}</div>
              <div>Codiva Builders • Kids & Teens Subsidiary of Veleon Academy</div>
            </div>
          </div>

          <div className={styles.receiptActionButtons}>
            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <FaWhatsapp style={{ fontSize: '1.25rem' }} /> Confirm via WhatsApp
            </a>

            <button onClick={() => window.print()} className={styles.btnPrint}>
              {isPaid ? <FaPrint /> : <FaFileInvoiceDollar />}
              {isPaid ? 'Print Official Receipt' : 'Print Proforma Invoice'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.scarcityBadge}>
            <FaFire style={{ color: '#e11d48' }} /> Only 20 seats available for this cohort!
          </div>

          <h2 className={styles.title}>Reserve Your Child's Spot</h2>
          <p className={styles.subtitle}>
            Register one or multiple children. Enjoy <strong>20% discount on each child</strong> when enrolling 2 or more children!
          </p>

          {/* Progress Indicator */}
          <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
              <span>Step {step} of 2</span>
              <span>{step === 1 ? 'Parent & Children Information' : 'Contact & Payment Selection'}</span>
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



              <div className={styles.formGroup}>
                <label className={styles.label}>Parent / Guardian Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Okon"
                  className={styles.input}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              {/* Multi-Children Entries */}
              <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: '#0A66C2' }}>
                Children Details ({children.length} {children.length === 1 ? 'Child' : 'Children'})
              </div>

              {children.map((child, idx) => {
                const track = getTrackByAge(parseInt(child.age, 10) || 9);
                return (
                  <div key={idx} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Child #{idx + 1}</span>
                      {children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(idx)}
                          style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Child's Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. David Okon"
                          className={styles.input}
                          value={child.name}
                          onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Child's Age *</label>
                        <select
                          className={styles.select}
                          value={child.age}
                          onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                        >
                          {[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((age) => (
                            <option key={age} value={age}>
                              {age} years old
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Auto-Assigned Track */}
                    <div className={styles.trackPreviewCard} style={{ marginTop: '0.75rem' }}>
                      <div className={styles.trackInfo}>
                        <span className={styles.trackTag}>Assigned Track</span>
                        <span className={styles.trackTitle}>{track.name}</span>
                      </div>
                      <span className={styles.trackBadge}>{track.ageLabel}</span>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddChild}
                style={{ background: '#eff6ff', color: '#0A66C2', border: '1.5px dashed #93c5fd', width: '100%', padding: '0.75rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '1rem' }}
              >
                <FaPlus /> Add Another Child (20% Off Each)
              </button>

              <div className={styles.buttonRow}>
                <button type="submit" className={styles.btnPrimary}>
                  Continue to Step 2 <FaArrowRight />
                </button>
              </div>
            </form>
          ) : (
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>WhatsApp Phone Number *</label>
                <div className={styles.phoneGroup}>
                  <select
                    className={styles.countryCodeSelect}
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
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
                    required
                    placeholder="8012345678"
                    className={`${styles.input} ${styles.phoneInput}`}
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Fee & Discount Summary */}
              <div style={{ background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '12px', padding: '1rem', margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                  <span>Base Fee (₦50,000 × {childCount}):</span>
                  <span>₦{rawSubtotal.toLocaleString()}</span>
                </div>

                {hasDiscount && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#16a34a', fontWeight: 700, marginTop: '0.4rem' }}>
                    <span>Multi-child Discount (20% Off Each):</span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, borderTop: '1px dashed #fdba74', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>Total Amount:</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={agreeUpdates}
                  onChange={(e) => setAgreeUpdates(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <span>I agree to receive academy updates and schedule details via WhatsApp and Email.</span>
              </label>

              <div className={styles.buttonRow} style={{ marginTop: '1rem' }}>
                <button type="button" onClick={handlePrevStep} className={styles.btnSecondary}>
                  <FaArrowLeft style={{ display: 'inline', marginRight: '0.4rem' }} /> Back
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={status === 'loading'}
                  className={styles.btnPrimary}
                  style={{ background: '#10b981' }}
                >
                  <FaCreditCard /> {status === 'loading' ? 'Processing...' : 'Pay Now (Paystack)'}
                </button>

                <button
                  type="button"
                  onClick={handlePayLater}
                  disabled={status === 'loading'}
                  className={styles.btnSecondary}
                  style={{ borderColor: '#0A66C2', color: '#0A66C2' }}
                >
                  <FaBookmark /> Reserve & Pay Later
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
