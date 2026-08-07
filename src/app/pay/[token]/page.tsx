'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './pay.module.css';
import { API_BASE_URL } from '@/config/api';
import { getWhatsAppLink, DISPLAY_PHONE } from '@/config/contact';
import { initializePaystackPayment } from '@/utils/paystack';
import { FaLock, FaCheckCircle, FaExclamationTriangle, FaCreditCard, FaBookmark, FaWhatsapp, FaDownload } from 'react-icons/fa';

export default function SpecialPaymentPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pricingData, setPricingData] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paidState, setPaidState] = useState<any>(null);

  const fetchTokenDetails = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/special-pricing/${token}`);
      } catch (e) {
        res = await fetch(`/api/special-pricing/${token}`);
      }

      const data = await res.json();
      if (res.ok) {
        setPricingData(data);
        if (data.status === 'Paid') {
          setPaidState({
            reference: data.paymentReference || `SP_${data.token}`,
            method: data.paymentMethod || 'Paystack',
            paidAt: data.paidAt,
          });
        }
      } else {
        setError(data.error || 'Invalid or expired payment link.');
      }
    } catch (err: any) {
      setError('Connection failed. Please refresh or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTokenDetails();
    }
  }, [token]);

  const executeSpecialPayment = async (method: 'Paystack' | 'Pay Later', paymentRef?: string) => {
    setSubmitting(true);
    setError('');

    const ref = paymentRef || `SP_${Date.now()}`;

    try {
      let res;
      const body = { paymentMethod: method, paymentReference: ref };

      try {
        res = await fetch(`${API_BASE_URL}/api/special-pricing/${token}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch (e) {
        res = await fetch(`/api/special-pricing/${token}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      const data = await res.json();

      if (res.ok && data.status === 'Paid') {
        setPaidState({
          reference: ref,
          method,
          paidAt: new Date().toISOString(),
        });
        setPricingData((prev: any) => ({ ...prev, status: 'Paid' }));
      } else {
        setError(data.error || 'Payment processing failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment server connection failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayNow = () => {
    if (!pricingData) return;

    initializePaystackPayment({
      email: pricingData.parentEmail,
      amountNaira: pricingData.overridePrice,
      metadata: {
        parentName: pricingData.parentName,
        phone: pricingData.parentPhone,
        program: pricingData.program,
        token: pricingData.token,
        type: 'Special Pricing Link',
      },
      onSuccess: (reference: string) => {
        executeSpecialPayment('Paystack', reference);
      },
      onClose: () => {
        setError('Paystack payment window was closed before completion.');
      },
    });
  };

  const handlePayLater = () => {
    executeSpecialPayment('Pay Later');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading secure payment link...</div>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.statusCard}>
            <div className={`${styles.statusIcon} ${styles.expiredIcon}`}>⚠️</div>
            <h2 className={styles.statusTitle}>Payment Link Unavailable</h2>
            <p className={styles.statusText}>{error || 'This special payment link is invalid or no longer active.'}</p>
            <a href="/" className={styles.btnPayLater} style={{ display: 'inline-flex', textDecoration: 'none' }}>
              Return to Codiva Builders
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = pricingData.status === 'Paid' || paidState !== null;
  const isExpired = pricingData.status === 'Expired';
  const isCancelled = pricingData.status === 'Cancelled';

  const whatsappMsg = `Hello Codiva Builders! I have completed payment of ₦${pricingData.overridePrice.toLocaleString()} for ${pricingData.program} (Special Offer Ref: ${paidState?.reference || pricingData.token}). Please confirm my child's seat.`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.brandBadge}>Codiva Builders</span>
          <h1 className={styles.title}>Special Offer Checkout</h1>
          <p className={styles.subtitle}>Personalized Discounted Payment Link</p>
        </div>

        <div className={styles.body}>
          {isCancelled ? (
            <div className={styles.statusCard}>
              <div className={`${styles.statusIcon} ${styles.expiredIcon}`}>🚫</div>
              <h2 className={styles.statusTitle}>Payment Link Cancelled</h2>
              <p className={styles.statusText}>This special discount link was cancelled by the administrator.</p>
            </div>
          ) : isExpired ? (
            <div className={styles.statusCard}>
              <div className={`${styles.statusIcon} ${styles.expiredIcon}`}>⌛</div>
              <h2 className={styles.statusTitle}>Link Expired</h2>
              <p className={styles.statusText}>This special offer payment link has reached its expiry date.</p>
            </div>
          ) : isPaid ? (
            <div className={styles.statusCard}>
              <div className={`${styles.statusIcon} ${styles.paidIcon}`}>✓</div>
              <h2 className={styles.statusTitle}>Payment Successful!</h2>
              <p className={styles.statusText}>
                Thank you, <strong>{pricingData.parentName}</strong>! Your special discount payment has been registered.
              </p>

              <div className={styles.receiptBox}>
                <div className={styles.pricingRow}>
                  <span>Parent / Email:</span>
                  <strong>{pricingData.parentName} ({pricingData.parentEmail})</strong>
                </div>
                <div className={styles.pricingRow}>
                  <span>Program:</span>
                  <strong>{pricingData.program}</strong>
                </div>
                <div className={styles.pricingRow}>
                  <span>Number of Children:</span>
                  <strong>{pricingData.numChildren} child(ren)</strong>
                </div>
                <div className={styles.pricingRow}>
                  <span>Amount Paid:</span>
                  <strong style={{ color: '#16a34a', fontSize: '1.1rem' }}>₦{pricingData.overridePrice.toLocaleString()}</strong>
                </div>
                <div className={styles.pricingRow}>
                  <span>Payment Ref:</span>
                  <strong>{paidState?.reference || pricingData.paymentReference}</strong>
                </div>
              </div>

              <a
                href={getWhatsAppLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPaystack}
                style={{ textDecoration: 'none', background: '#25D366' }}
              >
                <FaWhatsapp style={{ fontSize: '1.3rem' }} /> Confirm Seat via WhatsApp
              </a>
            </div>
          ) : (
            <>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Parent Name</span>
                  <span className={styles.infoValue}>{pricingData.parentName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{pricingData.parentEmail}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Selected Program</span>
                  <span className={styles.infoValue}>{pricingData.program}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Children Count</span>
                  <span className={styles.infoValue}>{pricingData.numChildren} child(ren)</span>
                </div>
              </div>

              <div className={styles.pricingBox}>
                <div className={styles.pricingRow}>
                  <span>Original Standard Price:</span>
                  <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                    ₦{pricingData.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                  <span>
                    Special Discount ({pricingData.reason}):
                    <span className={styles.discountBadge}>SAVINGS</span>
                  </span>
                  <span>-₦{pricingData.discountAmount.toLocaleString()}</span>
                </div>
                <div className={`${styles.pricingRow} ${styles.totalRow}`}>
                  <span>Amount Due:</span>
                  <span>₦{pricingData.overridePrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Fast Bank Transfer Option */}
              <div className={styles.bankBox}>
                <div className={styles.bankTitle}>⚡ Direct Bank Transfer Option</div>
                <div className={styles.bankGrid}>
                  <div>Bank: <strong>GTBank</strong></div>
                  <div>Account: <strong>0212516916</strong></div>
                  <div>Name: <strong>Omidoyin Ayodeji</strong></div>
                  <div>Ref: <strong>{pricingData.token}</strong></div>
                </div>
              </div>

              <div className={styles.actionGroup}>
                <button
                  onClick={handlePayNow}
                  disabled={submitting}
                  className={styles.btnPaystack}
                >
                  <FaCreditCard /> {submitting ? 'Processing...' : `Pay ₦${pricingData.overridePrice.toLocaleString()} (Paystack)`}
                </button>

                <button
                  onClick={handlePayLater}
                  disabled={submitting}
                  className={styles.btnPayLater}
                >
                  <FaBookmark /> Reserve & Pay via Bank Transfer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
