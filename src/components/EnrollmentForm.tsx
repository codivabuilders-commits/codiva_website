'use client';

import React, { useState } from 'react';
import styles from './EnrollmentForm.module.css';
import { API_BASE_URL } from '@/config/api';
import { getWhatsAppLink, DISPLAY_PHONE } from '@/config/contact';
import { initializePaystackPayment } from '@/utils/paystack';
import { toPng } from 'html-to-image';
import { FaPlus, FaTrash, FaCreditCard, FaBookmark, FaWhatsapp, FaPrint, FaCheckCircle, FaFileInvoiceDollar, FaDownload } from 'react-icons/fa';

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
    { name: '', age: '8', course: 'Scratch Coding', schedule: 'Weekend Saturday Classes' },
  ]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedRegistration, setSavedRegistration] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  const basePricePerChild = 40000;
  const childCount = children.length;
  const rawSubtotal = childCount * basePricePerChild;
  const discountPercentage = childCount >= 2 ? 0.2 : 0;
  const multiChildDiscount = rawSubtotal * discountPercentage;
  const subtotalAfterMultiChild = rawSubtotal - multiChildDiscount;

  const promoDiscount = appliedPromo ? Number(appliedPromo.discountAmount) || 0 : 0;
  const totalDiscountAmount = multiChildDiscount + promoDiscount;
  const finalTotal = Math.max(0, subtotalAfterMultiChild - promoDiscount);
  const hasDiscount = childCount >= 2 || appliedPromo !== null;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code');
      setPromoSuccess('');
      return;
    }

    setValidatingPromo(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      let res;
      const body = {
        code: promoInput.trim(),
        cartSubtotal: subtotalAfterMultiChild,
        program: children[0]?.course || 'General Program',
        parentEmail: parentEmail.trim(),
      };

      try {
        res = await fetch(`${API_BASE_URL}/api/promotions/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        res = await fetch('/api/promotions/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromo(data);
        setPromoSuccess(`Promo Applied: ${data.code} (-₦${Number(data.discountAmount).toLocaleString()})`);
        setPromoError('');
      } else {
        setAppliedPromo(null);
        setPromoError(data.message || 'Invalid Promo Code');
      }
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoError('Could not validate promo code. Please try again.');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoSuccess('');
    setPromoError('');
  };

  const handleAddChild = () => {
    setChildren([...children, { name: '', age: '8', course: 'Scratch Coding', schedule: 'Weekend Saturday Classes' }]);
  };

  const handleRemoveChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const handleChildChange = (index: number, field: keyof ChildEntry, value: string) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const isPaid = savedRegistration?.paymentStatus === 'Paid';

  const handleDownloadImage = async () => {
    const node = document.getElementById('enrollment-receipt');
    if (!node) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = isPaid
        ? `Codiva_Receipt_${savedRegistration?.reference || Date.now()}.png`
        : `Codiva_Invoice_${savedRegistration?.reference || Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download image failed:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const executeRegistration = async (paymentMethod: 'Paystack' | 'Pay Later', paymentRef?: string) => {
    if (!parentName.trim() || !parentEmail.trim() || !parentPhone.trim()) {
      setErrorMessage('Please fill in all parent details.');
      return;
    }

    const invalidChild = children.find((c) => !c.name.trim());
    if (invalidChild) {
      setErrorMessage('Please fill in child details for all entries.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const payload = {
      parentName,
      parentEmail,
      parentPhone,
      children,
      basePricePerChild,
      promoCode: appliedPromo?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment',
      paymentReference: paymentRef || `CBD_ENR_${Date.now()}`,
    };

    try {
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
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
          discountAmount: totalDiscountAmount,
          appliedPromo,
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
      console.error('Registration API failed:', err);
      setSavedRegistration({
        parentName,
        parentEmail,
        parentPhone,
        children,
        finalTotal,
        discountAmount: totalDiscountAmount,
        paymentMethod,
        paymentStatus: payload.paymentStatus,
        reference: payload.paymentReference,
      });
      setStatus('success');
    }
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !parentEmail.trim() || !parentPhone.trim()) {
      setErrorMessage('Please fill in all parent details first.');
      return;
    }

    initializePaystackPayment({
      email: parentEmail,
      amountNaira: finalTotal,
      metadata: { parentName, parentPhone, childCount },
      onSuccess: (ref) => {
        executeRegistration('Paystack', ref);
      },
      onError: (err) => {
        setErrorMessage(err);
      },
    });
  };

  const handlePayLater = (e: React.FormEvent) => {
    e.preventDefault();
    executeRegistration('Pay Later');
  };

  if (!isOpen) return null;

  const whatsappMessage = savedRegistration
    ? isPaid
      ? `Hello Codiva Builders! 🎉 I completed payment for my child's enrollment.\n` +
        `Parent: ${savedRegistration.parentName}\n` +
        `Children: ${savedRegistration.children.map((c: any) => `${c.name} (${c.course})`).join(', ')}\n` +
        `Total Paid: ₦${savedRegistration.finalTotal.toLocaleString()}\n` +
        `Ref: ${savedRegistration.reference}`
      : `Hello Codiva Builders! 🔒 I have reserved a seat for my child.\n` +
        `Parent: ${savedRegistration.parentName}\n` +
        `Children: ${savedRegistration.children.map((c: any) => `${c.name} (${c.course})`).join(', ')}\n` +
        `Total Due: ₦${savedRegistration.finalTotal.toLocaleString()}\n` +
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
            <div className={styles.successIcon} style={{ color: isPaid ? '#10b981' : '#f59e0b' }}>
              {isPaid ? <FaCheckCircle /> : <FaBookmark />}
            </div>
            
            <h2 className={styles.successTitle}>
              {isPaid ? '🎉 Congratulations! Enrollment Complete' : '🔒 Seat Reserved Successfully!'}
            </h2>
            
            <p className={styles.successSubtext}>
              {isPaid ? (
                <>
                  Your child has been successfully enrolled in <strong>Codiva Builders Academy</strong>.
                  <br />
                  A confirmation receipt has been generated. We can't wait to meet your child!
                </>
              ) : (
                <>
                  Your seat has been reserved at <strong>Codiva Builders Academy</strong>!
                  <br />
                  Please review your proforma invoice below and complete payment to finalize registration.
                </>
              )}
            </p>

            <div className={styles.receiptCard} id="enrollment-receipt">
              <div className={styles.printHeader}>
                <div className={styles.brandTitle}>
                  <span style={{ color: '#FF6B00' }}>Codiva</span>
                  <span style={{ color: '#0A66C2' }}>Builders</span>
                </div>
                <div className={styles.brandSub}>by Veleon Academy • Building Young Tech Leaders</div>
              </div>

              <div className={styles.receiptHeader}>
                <div className={styles.receiptTitle}>
                  {isPaid ? 'OFFICIAL PAYMENT RECEIPT' : 'PROFORMA INVOICE / SEAT RESERVATION'}
                </div>
                <span className={isPaid ? styles.statusBadgePaid : styles.statusBadgePending}>
                  {isPaid ? 'Paid ✓' : 'Seat Reserved (Pending Payment)'}
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
                <span className={styles.receiptLabel}>{isPaid ? 'Total Paid:' : 'Total Due:'}</span>
                <span className={styles.receiptValue}>₦{savedRegistration.finalTotal.toLocaleString()}</span>
              </div>

              <div className={styles.receiptItem} style={{ fontSize: '0.8rem', color: '#94a3a8', marginTop: '0.5rem' }}>
                <span>Ref Code: {savedRegistration.reference}</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

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

              <button onClick={handleDownloadImage} disabled={isDownloading} className={styles.btnDownload}>
                <FaDownload /> {isDownloading ? 'Generating Image...' : isPaid ? 'Download Receipt Image' : 'Download Invoice Image'}
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

              {/* Promo Code Input Section */}
              <div className={styles.sectionHeader} style={{ marginTop: '1.5rem' }}>
                <span>Promo / Special Discount Code</span>
              </div>

              <div className={styles.formRow} style={{ alignItems: 'flex-start' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Enter Promo Code (e.g. WELCOME20)"
                    className={styles.input}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    disabled={appliedPromo !== null}
                  />
                </div>
                {appliedPromo ? (
                  <button type="button" onClick={handleRemovePromo} className={styles.btnPayLater} style={{ padding: '0.65rem 1rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}>
                    Remove
                  </button>
                ) : (
                  <button type="button" onClick={handleApplyPromo} disabled={validatingPromo} className={styles.btnAddChild} style={{ padding: '0.65rem 1.25rem', marginTop: 0 }}>
                    {validatingPromo ? 'Validating...' : 'Apply'}
                  </button>
                )}
              </div>

              {promoSuccess && (
                <div style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #bbf7d0', fontWeight: 600 }}>
                  ✓ {promoSuccess}
                </div>
              )}

              {promoError && (
                <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                  ⚠️ {promoError}
                </div>
              )}

              {/* Dynamic Fee & Discount Card */}
              <div className={styles.pricingCard}>
                <div className={styles.pricingRow}>
                  <span>Subtotal ({childCount} {childCount === 1 ? 'child' : 'children'}):</span>
                  <span>₦{rawSubtotal.toLocaleString()}</span>
                </div>

                {multiChildDiscount > 0 && (
                  <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                    <span>
                      Multi-child Discount (20% Off Each):
                      <span className={styles.discountBadge}>20% OFF</span>
                    </span>
                    <span>-₦{multiChildDiscount.toLocaleString()}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                    <span>
                      Promo Code ({appliedPromo.code}):
                      <span className={styles.discountBadge}>{appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}% OFF` : 'FIXED'}</span>
                    </span>
                    <span>-₦{promoDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className={`${styles.pricingRow} ${styles.totalRow}`}>
                  <span>Amount Payable:</span>
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
