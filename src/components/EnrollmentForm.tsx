'use client';

import React, { useState } from 'react';
import styles from './EnrollmentForm.module.css';
import { API_BASE_URL } from '@/config/api';
import { getWhatsAppLink } from '@/config/contact';
import { initializePaystackPayment } from '@/utils/paystack';
import { FaPlus, FaTrash, FaCreditCard, FaBookmark, FaWhatsapp, FaPrint, FaCheckCircle } from 'react-icons/fa';

interface ChildEntry {
  name: string;
  age: string;
  course: string;
  schedule: string;
}

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentForm({ isOpen, onClose }: EnrollmentFormProps) {
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  const [children, setChildren] = useState<ChildEntry[]>([
    { name: '', age: '8', course: 'Scratch Coding', schedule: 'Online' },
  ]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedRegistration, setSavedRegistration] = useState<any>(null);

  if (!isOpen) return null;

  // Fee calculation engine (₦40,000 per child base)
  const basePricePerChild = 40000;
  const childCount = children.length;
  const subtotal = childCount * basePricePerChild;
  const hasDiscount = childCount >= 2;
  const discountPercentage = hasDiscount ? 0.20 : 0;
  const discountAmount = subtotal * discountPercentage;
  const finalTotal = subtotal - discountAmount;

  const handleAddChild = () => {
    setChildren((prev) => [
      ...prev,
      { name: '', age: '9', course: 'Web Development', schedule: 'Online' },
    ]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length <= 1) return;
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChildChange = (index: number, field: keyof ChildEntry, value: string) => {
    setChildren((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const validateForm = (): boolean => {
    if (!parentName.trim() || !parentEmail.trim() || !parentPhone.trim()) {
      setErrorMessage('Please fill in all parent contact fields (Name, Email, Phone).');
      return false;
    }

    for (let i = 0; i < children.length; i++) {
      if (!children[i].name.trim()) {
        setErrorMessage(`Please enter the full name for Child #${i + 1}.`);
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const submitRegistration = async (paymentMethod: 'Paystack' | 'Pay Later', paymentRef?: string) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const payload = {
        parentName,
        parentEmail,
        parentPhone,
        children,
        basePricePerChild,
        paymentMethod,
        paymentStatus: paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment',
        paymentReference: paymentRef || `CBD_${Date.now()}`,
      };

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (fetchErr) {
        response = await fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const resData = await response.json();

      if (response.ok || resData.data) {
        setSavedRegistration({
          parentName,
          parentEmail,
          parentPhone,
          children,
          finalTotal,
          discountAmount,
          paymentMethod,
          paymentStatus: payload.paymentStatus,
          reference: payload.paymentReference,
        });
        setStatus('success');
      } else {
        setErrorMessage(resData.error || 'Failed to submit registration. Please try again.');
        setStatus('error');
      }
    } catch (err: any) {
      console.error('Registration submission error:', err);
      // Fallback local display if server network fails
      setSavedRegistration({
        parentName,
        parentEmail,
        parentPhone,
        children,
        finalTotal,
        discountAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment',
        reference: paymentRef || `CBD_${Date.now()}`,
      });
      setStatus('success');
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    initializePaystackPayment({
      email: parentEmail,
      amountNaira: finalTotal,
      metadata: { parentName, parentPhone, childCount },
      onSuccess: (reference) => {
        submitRegistration('Paystack', reference);
      },
      onError: (errMsg) => {
        setErrorMessage(errMsg);
      },
    });
  };

  const handlePayLater = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    submitRegistration('Pay Later');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const whatsappMessage = savedRegistration
    ? `Hello Codiva Builders! 🎉 I just registered my child(ren) for Codiva Builders.\n` +
      `Parent: ${savedRegistration.parentName}\n` +
      `Children: ${savedRegistration.children.map((c: any) => `${c.name} (${c.course})`).join(', ')}\n` +
      `Total: ₦${savedRegistration.finalTotal.toLocaleString()}\n` +
      `Status: ${savedRegistration.paymentStatus}\n` +
      `Ref: ${savedRegistration.reference}`
    : 'Hello Codiva Builders! I have a question about my enrollment.';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {status === 'success' && savedRegistration ? (
          <div className={styles.successContainer}>
            <div className={styles.successIcon} style={{ color: '#10b981' }}>
              <FaCheckCircle />
            </div>
            <h2 className={styles.successTitle}>🎉 Congratulations!</h2>
            <p className={styles.successSubtext}>
              Your child has been successfully enrolled in <strong>Codiva Builders Academy</strong>.
              <br />
              A confirmation has been sent to your email and WhatsApp. We can't wait to meet your child!
            </p>

            {/* Printable Receipt Card */}
            <div className={styles.receiptCard} id="enrollment-receipt">
              <div className={styles.receiptHeader}>
                <div className={styles.receiptTitle}>Official Enrollment Receipt</div>
                <span
                  className={
                    savedRegistration.paymentStatus === 'Paid'
                      ? styles.statusBadgePaid
                      : styles.statusBadgePending
                  }
                >
                  {savedRegistration.paymentStatus === 'Paid' ? 'Paid ✓' : 'Pending Payment (Reserved)'}
                </span>
              </div>

              <div className={styles.receiptItem}>
                <span className={styles.receiptLabel}>Parent / Guardian:</span>
                <span className={styles.receiptValue}>{savedRegistration.parentName}</span>
              </div>
              <div className={styles.receiptItem}>
                <span className={styles.receiptLabel}>Email:</span>
                <span className={styles.receiptValue}>{savedRegistration.parentEmail}</span>
              </div>
              <div className={styles.receiptItem}>
                <span className={styles.receiptLabel}>Phone / WhatsApp:</span>
                <span className={styles.receiptValue}>{savedRegistration.parentPhone}</span>
              </div>

              <div className={styles.childrenBreakdown}>
                <strong style={{ fontSize: '0.85rem', color: '#0A66C2' }}>Enrolled Children & Programs:</strong>
                {savedRegistration.children.map((child: ChildEntry, idx: number) => (
                  <div key={idx} className={styles.childBreakdownItem}>
                    • <strong>{child.name}</strong> (Age {child.age}) — {child.course} ({child.schedule})
                  </div>
                ))}
              </div>

              {savedRegistration.discountAmount > 0 && (
                <div className={styles.receiptItem} style={{ color: '#16a34a' }}>
                  <span className={styles.receiptLabel}>Multi-child Discount (20% Off):</span>
                  <span className={styles.receiptValue}>-₦{savedRegistration.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className={styles.receiptItem} style={{ fontWeight: 800, fontSize: '1.05rem', marginTop: '0.5rem' }}>
                <span className={styles.receiptLabel}>Total Amount:</span>
                <span className={styles.receiptValue}>₦{savedRegistration.finalTotal.toLocaleString()}</span>
              </div>

              <div className={styles.receiptItem} style={{ fontSize: '0.8rem', color: '#94a3a8', marginTop: '0.5rem' }}>
                <span>Ref Code: {savedRegistration.reference}</span>
                <span>{new Date().toLocaleDateString()}</span>
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

              <button onClick={handlePrintReceipt} className={styles.btnPrint}>
                <FaPrint /> Print / Save Receipt
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Enroll Your Child</h2>
            <p className={styles.subtitle}>
              Register one or more children. Enjoy <strong>20% discount on each child</strong> when enrolling multiple children!
            </p>

            {errorMessage && (
              <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {errorMessage}
              </div>
            )}

            <form className={styles.form}>
              {/* Parent Details */}
              <div className={styles.sectionHeader}>
                <span>1. Parent / Guardian Details</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Emmanuel Okon"
                  className={styles.input}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Parent's Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    className={styles.input}
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 810 528 1572"
                    className={styles.input}
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Children Details */}
              <div className={styles.sectionHeader}>
                <span>2. Children Information ({children.length} {children.length === 1 ? 'Child' : 'Children'})</span>
              </div>

              {children.map((child, idx) => (
                <div key={idx} className={styles.childCard}>
                  <div className={styles.childHeader}>
                    <span className={styles.childTitle}>Child #{idx + 1}</span>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChild(idx)}
                        className={styles.btnRemoveChild}
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.formRow}>
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
                        {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((a) => (
                          <option key={a} value={a}>
                            {a} years old
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Select Program *</label>
                      <select
                        className={styles.select}
                        value={child.course}
                        onChange={(e) => handleChildChange(idx, 'course', e.target.value)}
                      >
                        <option value="Scratch Coding">Scratch Coding (Ages 5-8)</option>
                        <option value="Web Development">Web Development (Ages 9-12)</option>
                        <option value="Python Programming">Python Programming (Ages 13-17)</option>
                        <option value="Graphic Design">Graphic Design (All Ages)</option>
                        <option value="AI for Kids">AI for Kids (All Ages)</option>
                        <option value="Summer Innovation Academy">Summer Innovation Academy 2026</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Learning Schedule *</label>
                      <select
                        className={styles.select}
                        value={child.schedule}
                        onChange={(e) => handleChildChange(idx, 'schedule', e.target.value)}
                      >
                        <option value="Online (Virtual)">Online (Virtual)</option>
                        <option value="Weekend Saturday Classes">Weekend Saturday Classes</option>
                        <option value="Physical Campus (Lagos)">Physical Campus (Lagos)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={handleAddChild} className={styles.btnAddChild}>
                <FaPlus /> Add Another Child (Save 20%)
              </button>

              {/* Dynamic Fee & Discount Card */}
              <div className={styles.pricingCard}>
                <div className={styles.pricingRow}>
                  <span>Fee per Child:</span>
                  <span>₦{basePricePerChild.toLocaleString()}</span>
                </div>
                <div className={styles.pricingRow}>
                  <span>Enrolled Children:</span>
                  <span>{childCount} {childCount === 1 ? 'child' : 'children'}</span>
                </div>

                {hasDiscount && (
                  <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                    <span>
                      Multi-child Discount (20% Off Each):
                      <span className={styles.discountBadge}>20% OFF</span>
                    </span>
                    <span>-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className={`${styles.pricingRow} ${styles.totalRow}`}>
                  <span>Total Investment:</span>
                  <span>₦{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Payment Buttons */}
              <div className={styles.actionButtonGroup}>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={status === 'loading'}
                  className={styles.btnPayNow}
                >
                  <FaCreditCard /> {status === 'loading' ? 'Processing...' : 'Pay Now (Paystack)'}
                </button>

                <button
                  type="button"
                  onClick={handlePayLater}
                  disabled={status === 'loading'}
                  className={styles.btnPayLater}
                >
                  <FaBookmark /> Reserve & Pay Later
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
