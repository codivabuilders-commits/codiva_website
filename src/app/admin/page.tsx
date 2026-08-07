'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { API_BASE_URL } from '@/config/api';
import { getWhatsAppLink, DISPLAY_PHONE } from '@/config/contact';
import {
  FaUsers,
  FaRocket,
  FaLaptopCode,
  FaMoneyBillWave,
  FaSearch,
  FaSync,
  FaWhatsapp,
  FaTrash,
  FaArrowLeft,
  FaEnvelope,
  FaCheckCircle,
  FaDownload,
  FaChild,
  FaTags,
  FaLink,
  FaPlus,
  FaCopy,
  FaBan,
  FaHistory,
  FaEdit,
  FaClone,
  FaToggleOn,
  FaToggleOff,
  FaTimes,
} from 'react-icons/fa';

export interface ChildInfo {
  name: string;
  age: string | number;
  course: string;
  schedule: string;
}

export interface RegisteredUser {
  id: string;
  rawId: number;
  type: string;
  parentName: string;
  childName: string;
  childAge: number | string;
  children: ChildInfo[];
  program: string;
  phone: string;
  email: string;
  campus: string;
  amount: number;
  discountAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference: string;
  agreeUpdates: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applies_to: string;
  min_purchase: number;
  max_discount: number | null;
  usage_limit: number | null;
  usage_count: number;
  one_per_parent: boolean;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SpecialPricing {
  id: number;
  token: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  program: string;
  num_children: number;
  original_price: number;
  override_price: number;
  discount_amount: number;
  reason: string;
  expiry_date: string | null;
  status: 'Pending' | 'Paid' | 'Expired' | 'Cancelled';
  payment_method: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

const PROGRAM_OPTIONS = [
  'All Programs',
  'Summer Innovation Academy',
  'Holiday Innovation Camp',
  'Builder Academy',
  'Builder Plus',
  'Private Coaching',
  'School Partnerships',
  'Coding Fundamentals',
  'AI for Kids',
  'Web Development',
  'Graphic Design',
  'Robotics',
];

export default function AdminDashboardPage() {
  const [mainNav, setMainNav] = useState<'registrations' | 'promotions' | 'special-pricing' | 'audit-logs'>('registrations');

  // Registrations state
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [regLoading, setRegLoading] = useState(true);
  const [regError, setRegError] = useState('');
  const [regTab, setRegTab] = useState<'all' | 'summer' | 'general' | 'paid' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Promotions state
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [promoStats, setPromoStats] = useState<any>({});
  const [promoLoading, setPromoLoading] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '20',
    appliesTo: 'All Programs',
    minPurchase: '0',
    maxDiscount: '',
    usageLimit: '',
    onePerParent: false,
    expiryDate: '',
    isActive: true,
  });

  // Special Pricing state
  const [specialPricings, setSpecialPricings] = useState<SpecialPricing[]>([]);
  const [specialStats, setSpecialStats] = useState<any>({});
  const [specialLoading, setSpecialLoading] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [selectedParentMode, setSelectedParentMode] = useState<'existing' | 'new'>('existing');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [specialFormData, setSpecialFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    program: 'Summer Innovation Academy',
    numChildren: '1',
    originalPrice: '150000',
    overridePrice: '50000',
    reason: 'Family Discount',
    expiryDate: '',
  });

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Fetch functions
  const fetchRegistrations = async () => {
    setRegLoading(true);
    setRegError('');
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/admin/users`, { cache: 'no-store' });
      } catch (err) {
        res = await fetch('/api/admin/users', { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setRegError('Could not load registrations.');
      }
    } catch (err: any) {
      setRegError('Connection failed.');
    } finally {
      setRegLoading(false);
    }
  };

  const fetchPromotions = async () => {
    setPromoLoading(true);
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/admin/promotions`, { cache: 'no-store' });
      } catch (e) {
        res = await fetch('/api/admin/promotions', { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        setPromos(data.promos || []);
        setPromoStats(data.stats || {});
      }
    } catch (err) {
      console.error('Fetch promotions error:', err);
    } finally {
      setPromoLoading(false);
    }
  };

  const fetchSpecialPricings = async () => {
    setSpecialLoading(true);
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/admin/special-pricings`, { cache: 'no-store' });
      } catch (e) {
        res = await fetch('/api/admin/special-pricings', { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        setSpecialPricings(data.specialPricings || []);
        setSpecialStats(data.stats || {});
      }
    } catch (err) {
      console.error('Fetch special pricings error:', err);
    } finally {
      setSpecialLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/admin/discount-audit-logs`, { cache: 'no-store' });
      } catch (e) {
        res = await fetch('/api/admin/discount-audit-logs', { cache: 'no-store' });
      }
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Fetch audit logs error:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (mainNav === 'promotions') fetchPromotions();
    if (mainNav === 'special-pricing') fetchSpecialPricings();
    if (mainNav === 'audit-logs') fetchAuditLogs();
  }, [mainNav]);

  // Handle Mark as Paid
  const handleMarkAsPaid = async (user: RegisteredUser) => {
    if (!confirm(`Mark ${user.childName || user.parentName}'s registration as Paid?`)) return;
    setUpdatingId(user.id);

    try {
      const tableType = user.type.includes('Summer') ? 'summer' : 'general';
      await fetch(`${API_BASE_URL}/api/admin/registrations/${tableType}/${user.rawId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'Paid' }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, paymentStatus: 'Paid' } : u))
      );
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete Registration
  const handleDeleteUser = async (user: RegisteredUser) => {
    if (!confirm(`Are you sure you want to delete registration for ${user.parentName}?`)) return;
    try {
      const tableType = user.type.includes('Summer') ? 'summer-registrations' : 'enrollments';
      await fetch(`${API_BASE_URL}/api/admin/${tableType}/${user.rawId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert('Failed to delete registration.');
    }
  };

  // Promo Code Actions
  const handleOpenCreatePromo = () => {
    setEditingPromo(null);
    setPromoFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '20',
      appliesTo: 'All Programs',
      minPurchase: '0',
      maxDiscount: '',
      usageLimit: '',
      onePerParent: false,
      expiryDate: '',
      isActive: true,
    });
    setShowPromoModal(true);
  };

  const handleOpenEditPromo = (promo: PromoCode) => {
    setEditingPromo(promo);
    setPromoFormData({
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discount_type,
      discountValue: String(promo.discount_value),
      appliesTo: promo.applies_to || 'All Programs',
      minPurchase: String(promo.min_purchase || 0),
      maxDiscount: promo.max_discount ? String(promo.max_discount) : '',
      usageLimit: promo.usage_limit ? String(promo.usage_limit) : '',
      onePerParent: promo.one_per_parent === true,
      expiryDate: promo.expiry_date ? new Date(promo.expiry_date).toISOString().substring(0, 10) : '',
      isActive: promo.is_active,
    });
    setShowPromoModal(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoFormData.code.trim()) return alert('Promo code is required.');

    const url = editingPromo
      ? `${API_BASE_URL}/api/admin/promotions/${editingPromo.id}`
      : `${API_BASE_URL}/api/admin/promotions`;
    const method = editingPromo ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoFormData),
      });

      const data = await res.json();
      if (res.ok) {
        setShowPromoModal(false);
        fetchPromotions();
      } else {
        alert(data.error || 'Failed to save promo code.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  const handleTogglePromo = async (promo: PromoCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/promotions/${promo.id}/toggle`, { method: 'PATCH' });
      if (res.ok) fetchPromotions();
    } catch (err) {
      alert('Failed to toggle promo code.');
    }
  };

  const handleDuplicatePromo = async (promo: PromoCode) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/promotions/${promo.id}/duplicate`, { method: 'POST' });
      if (res.ok) fetchPromotions();
    } catch (err) {
      alert('Failed to duplicate promo code.');
    }
  };

  const handleDeletePromo = async (promo: PromoCode) => {
    if (!confirm(`Delete promo code '${promo.code}'?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/promotions/${promo.id}`, { method: 'DELETE' });
      if (res.ok) fetchPromotions();
    } catch (err) {
      alert('Failed to delete promo code.');
    }
  };

  // Special Pricing Actions
  const handleOpenCreateSpecial = () => {
    setSpecialFormData({
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      program: 'Summer Innovation Academy',
      numChildren: '1',
      originalPrice: '150000',
      overridePrice: '50000',
      reason: 'Family Discount',
      expiryDate: '',
    });
    setShowSpecialModal(true);
  };

  const handleSelectExistingParent = (parentEmail: string) => {
    const found = users.find((u) => u.email === parentEmail);
    if (found) {
      setSpecialFormData((prev) => ({
        ...prev,
        parentName: found.parentName,
        parentEmail: found.email,
        parentPhone: found.phone,
        program: found.program.split(' | ')[0] || 'Summer Innovation Academy',
      }));
    }
  };

  const handleSaveSpecialPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialFormData.parentName || !specialFormData.parentEmail || !specialFormData.parentPhone) {
      return alert('Parent details are required.');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/special-pricings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialFormData),
      });

      const data = await res.json();
      if (res.ok) {
        setShowSpecialModal(false);
        fetchSpecialPricings();
        if (data.token) {
          const link = `${window.location.origin}/pay/${data.token}`;
          navigator.clipboard.writeText(link);
          alert(`Special Pricing Link created & copied to clipboard:\n${link}`);
        }
      } else {
        alert(data.error || 'Failed to create special pricing link.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  const handleCancelSpecialPricing = async (sp: SpecialPricing) => {
    if (!confirm(`Cancel special pricing link for ${sp.parent_name}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/special-pricings/${sp.id}/cancel`, { method: 'PATCH' });
      if (res.ok) fetchSpecialPricings();
    } catch (err) {
      alert('Failed to cancel link.');
    }
  };

  const handleDeleteSpecialPricing = async (sp: SpecialPricing) => {
    if (!confirm(`Delete special pricing link for ${sp.parent_name}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/special-pricings/${sp.id}`, { method: 'DELETE' });
      if (res.ok) fetchSpecialPricings();
    } catch (err) {
      alert('Failed to delete link.');
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/pay/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesTab =
      regTab === 'all'
        ? true
        : regTab === 'summer'
        ? u.type.includes('Summer')
        : regTab === 'general'
        ? u.type.includes('General')
        : regTab === 'paid'
        ? u.paymentStatus === 'Paid'
        : u.paymentStatus !== 'Paid';

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.parentName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.childName.toLowerCase().includes(q) ||
      u.program.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  const totalPaidRevenue = users.filter((u) => u.paymentStatus === 'Paid').reduce((sum, u) => sum + u.amount, 0);

  return (
    <div className={styles.adminWrapper}>
      {/* Header */}
      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <span style={{ color: '#0A66C2' }}>Codiva</span> Builders
          <span className={styles.adminBadge}>Admin Hub</span>
        </a>

        <div className={styles.headerActions}>
          <button
            onClick={() => {
              if (mainNav === 'registrations') fetchRegistrations();
              if (mainNav === 'promotions') fetchPromotions();
              if (mainNav === 'special-pricing') fetchSpecialPricings();
              if (mainNav === 'audit-logs') fetchAuditLogs();
            }}
            className={styles.btnRefresh}
          >
            <FaSync /> Sync Data
          </button>
          <a href="/" className={styles.btnRefresh} style={{ textDecoration: 'none' }}>
            <FaArrowLeft /> View Site
          </a>
        </div>
      </header>

      {/* Main Admin Navigation */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 2rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', gap: '1.5rem' }}>
          <button
            onClick={() => setMainNav('registrations')}
            className={styles.tabBtn}
            style={{
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: mainNav === 'registrations' ? '#0A66C2' : '#64748b',
              borderBottom: mainNav === 'registrations' ? '3px solid #0A66C2' : 'none',
              borderRadius: 0,
            }}
          >
            <FaUsers style={{ marginRight: '0.4rem' }} /> Registrations CRM
          </button>

          <button
            onClick={() => setMainNav('promotions')}
            className={styles.tabBtn}
            style={{
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: mainNav === 'promotions' ? '#0A66C2' : '#64748b',
              borderBottom: mainNav === 'promotions' ? '3px solid #0A66C2' : 'none',
              borderRadius: 0,
            }}
          >
            <FaTags style={{ marginRight: '0.4rem' }} /> Promo Codes
          </button>

          <button
            onClick={() => setMainNav('special-pricing')}
            className={styles.tabBtn}
            style={{
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: mainNav === 'special-pricing' ? '#0A66C2' : '#64748b',
              borderBottom: mainNav === 'special-pricing' ? '3px solid #0A66C2' : 'none',
              borderRadius: 0,
            }}
          >
            <FaLink style={{ marginRight: '0.4rem' }} /> Special Override Links
          </button>

          <button
            onClick={() => setMainNav('audit-logs')}
            className={styles.tabBtn}
            style={{
              padding: '0.6rem 1.2rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: mainNav === 'audit-logs' ? '#0A66C2' : '#64748b',
              borderBottom: mainNav === 'audit-logs' ? '3px solid #0A66C2' : 'none',
              borderRadius: 0,
            }}
          >
            <FaHistory style={{ marginRight: '0.4rem' }} /> Audit Logs
          </button>
        </div>
      </div>

      <div className={styles.container}>
        {/* ========================================== */}
        {/* VIEW 1: REGISTRATIONS CRM */}
        {/* ========================================== */}
        {mainNav === 'registrations' && (
          <>
            <h1 className={styles.pageTitle}>Student Registrations</h1>
            <p className={styles.pageSubtitle}>Manage and verify enrolled parents, children, tracks, and payment statuses.</p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{users.length}</div>
                  <div className={styles.statLabel}>Total Registrations</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#0A66C2' }}>
                  <FaUsers />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{users.filter((u) => u.paymentStatus === 'Paid').length}</div>
                  <div className={styles.statLabel}>Verified Paid Seats</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaCheckCircle />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>₦{totalPaidRevenue.toLocaleString()}</div>
                  <div className={styles.statLabel}>Total Paid Revenue</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                  <FaMoneyBillWave />
                </div>
              </div>
            </div>

            <div className={styles.controlsBar}>
              <div className={styles.tabGroup}>
                {(['all', 'summer', 'general', 'paid', 'pending'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRegTab(t)}
                    className={`${styles.tabBtn} ${regTab === t ? styles.tabBtnActive : ''}`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by parent, child, or email..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Parent / Contact</th>
                    <th className={styles.th}>Program / Campus</th>
                    <th className={styles.th}>Enrolled Children</th>
                    <th className={styles.th}>Amount</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 700 }}>{u.parentName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                        <a
                          href={getWhatsAppLink(`Hello ${u.parentName}, contacting you regarding your Codiva Builders registration.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.phoneLink}
                        >
                          <FaWhatsapp /> {u.phone}
                        </a>
                      </td>

                      <td className={styles.td}>
                        <span className={`${styles.badgeType} ${u.type.includes('Summer') ? styles.badgeSummer : styles.badgeGeneral}`}>
                          {u.type}
                        </span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{u.program}</div>
                      </td>

                      <td className={styles.td}>
                        {u.children && u.children.length > 0 ? (
                          u.children.map((c, idx) => (
                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                              • <strong>{c.name}</strong> ({c.age} yrs)
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: '0.85rem' }}>{u.childName} ({u.childAge} yrs)</div>
                        )}
                      </td>

                      <td className={styles.td}>
                        <div style={{ fontWeight: 800 }}>₦{u.amount.toLocaleString()}</div>
                        {u.discountAmount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>
                            Save: ₦{u.discountAmount.toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td className={styles.td}>
                        <span className={u.paymentStatus === 'Paid' ? styles.statusPaid : styles.statusPending}>
                          {u.paymentStatus}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <div className={styles.actionCell}>
                          {u.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(u)}
                              disabled={updatingId === u.id}
                              className={styles.btnMarkPaid}
                            >
                              Mark Paid
                            </button>
                          )}
                          <button onClick={() => handleDeleteUser(u)} className={styles.btnDelete}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* VIEW 2: PROMO CODES MANAGEMENT */}
        {/* ========================================== */}
        {mainNav === 'promotions' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h1 className={styles.pageTitle}>Promo Code Management</h1>
                <p className={styles.pageSubtitle}>Create, edit, limit, and track campaign discount codes.</p>
              </div>
              <button onClick={handleOpenCreatePromo} className={styles.btnPrimary}>
                <FaPlus /> Create Promo Code
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{promoStats.activeCount || 0}</div>
                  <div className={styles.statLabel}>Active Promo Codes</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaTags />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>₦{(promoStats.totalDiscountGiven || 0).toLocaleString()}</div>
                  <div className={styles.statLabel}>Total Discount Given</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#0A66C2' }}>
                  <FaMoneyBillWave />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{promoStats.mostUsedPromo || 'None'}</div>
                  <div className={styles.statLabel}>Most Used Promo</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                  <FaRocket />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{promoStats.totalPromoRedemptions || 0}</div>
                  <div className={styles.statLabel}>Total Redemptions</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                  <FaUsers />
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Code / Description</th>
                    <th className={styles.th}>Discount</th>
                    <th className={styles.th}>Applies To</th>
                    <th className={styles.th}>Usage</th>
                    <th className={styles.th}>Expiry</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map((p) => {
                    const isExpired = p.expiry_date && new Date(p.expiry_date) < new Date();
                    return (
                      <tr key={p.id} className={styles.tr}>
                        <td className={styles.td}>
                          <div style={{ fontWeight: 800, color: '#0A66C2', fontSize: '1rem' }}>{p.code}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.description || 'No description'}</div>
                        </td>

                        <td className={styles.td}>
                          <div style={{ fontWeight: 700 }}>
                            {p.discount_type === 'percentage'
                              ? `${p.discount_value}% OFF`
                              : `₦${Number(p.discount_value).toLocaleString()} OFF`}
                          </div>
                          {p.min_purchase > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Min: ₦{Number(p.min_purchase).toLocaleString()}
                            </div>
                          )}
                        </td>

                        <td className={styles.td}>
                          <span className={styles.badgeGeneral}>{p.applies_to || 'All Programs'}</span>
                        </td>

                        <td className={styles.td}>
                          <div style={{ fontWeight: 600 }}>
                            {p.usage_count} / {p.usage_limit ? p.usage_limit : '∞'}
                          </div>
                          {p.one_per_parent && (
                            <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>1 Use Per Parent</div>
                          )}
                        </td>

                        <td className={styles.td}>
                          {p.expiry_date ? new Date(p.expiry_date).toLocaleDateString() : 'No Expiry'}
                        </td>

                        <td className={styles.td}>
                          {isExpired ? (
                            <span className={styles.statusPending} style={{ background: '#fee2e2', color: '#dc2626' }}>
                              Expired
                            </span>
                          ) : p.is_active ? (
                            <span className={styles.statusPaid}>Active</span>
                          ) : (
                            <span className={styles.statusPending}>Disabled</span>
                          )}
                        </td>

                        <td className={styles.td}>
                          <div className={styles.actionCell}>
                            <button onClick={() => handleOpenEditPromo(p)} className={`${styles.btnActionSmall} ${styles.btnEdit}`}>
                              <FaEdit /> Edit
                            </button>
                            <button onClick={() => handleTogglePromo(p)} className={`${styles.btnActionSmall} ${styles.btnSecondary}`}>
                              {p.is_active ? <FaToggleOn style={{ color: '#16a34a' }} /> : <FaToggleOff />}
                            </button>
                            <button onClick={() => handleDuplicatePromo(p)} className={`${styles.btnActionSmall} ${styles.btnSecondary}`}>
                              <FaClone />
                            </button>
                            <button onClick={() => handleDeletePromo(p)} className={styles.btnDelete}>
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* VIEW 3: SPECIAL PRICING LINKS */}
        {/* ========================================== */}
        {mainNav === 'special-pricing' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h1 className={styles.pageTitle}>Special Pricing Payment Links</h1>
                <p className={styles.pageSubtitle}>Generate non-guessable, one-off discounted checkout links for individual parents.</p>
              </div>
              <button onClick={handleOpenCreateSpecial} className={styles.btnPrimary}>
                <FaPlus /> Create Special Link
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{specialStats.totalLinks || 0}</div>
                  <div className={styles.statLabel}>Total Special Links</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#0A66C2' }}>
                  <FaLink />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>{specialStats.pendingCount || 0}</div>
                  <div className={styles.statLabel}>Pending Active Links</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                  <FaRocket />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>₦{(specialStats.totalDiscountsGiven || 0).toLocaleString()}</div>
                  <div className={styles.statLabel}>Total Special Discounts</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  <FaMoneyBillWave />
                </div>
              </div>

              <div className={styles.statCard}>
                <div>
                  <div className={styles.statValue}>₦{(specialStats.paidRevenue || 0).toLocaleString()}</div>
                  <div className={styles.statLabel}>Paid Revenue (Special Links)</div>
                </div>
                <div className={styles.statIcon} style={{ background: '#f3e8ff', color: '#9333ea' }}>
                  <FaCheckCircle />
                </div>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Parent / Contact</th>
                    <th className={styles.th}>Program</th>
                    <th className={styles.th}>Original</th>
                    <th className={styles.th}>Override</th>
                    <th className={styles.th}>Discount</th>
                    <th className={styles.th}>Reason</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {specialPricings.map((sp) => (
                    <tr key={sp.id} className={styles.tr}>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 800 }}>{sp.parent_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{sp.parent_email} • {sp.parent_phone}</div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.badgeSummer}>{sp.program}</span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{sp.num_children} child(ren)</div>
                      </td>

                      <td className={styles.td} style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                        ₦{Number(sp.original_price).toLocaleString()}
                      </td>

                      <td className={styles.td} style={{ fontWeight: 800, color: '#16a34a' }}>
                        ₦{Number(sp.override_price).toLocaleString()}
                      </td>

                      <td className={styles.td} style={{ fontWeight: 700, color: '#0A66C2' }}>
                        -₦{Number(sp.discount_amount).toLocaleString()}
                      </td>

                      <td className={styles.td}>{sp.reason}</td>

                      <td className={styles.td}>
                        <span
                          className={
                            sp.status === 'Paid'
                              ? styles.statusPaid
                              : sp.status === 'Cancelled' || sp.status === 'Expired'
                              ? styles.statusPending
                              : styles.statusPending
                          }
                          style={{
                            background:
                              sp.status === 'Paid'
                                ? '#dcfce7'
                                : sp.status === 'Cancelled'
                                ? '#fee2e2'
                                : '#fef3c7',
                            color:
                              sp.status === 'Paid'
                                ? '#15803d'
                                : sp.status === 'Cancelled'
                                ? '#dc2626'
                                : '#b45309',
                          }}
                        >
                          {sp.status}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <div className={styles.actionCell}>
                          <button
                            onClick={() => handleCopyLink(sp.token)}
                            className={`${styles.btnActionSmall} ${styles.btnCopy}`}
                          >
                            <FaCopy /> {copiedToken === sp.token ? 'Copied!' : 'Copy Link'}
                          </button>
                          {sp.status === 'Pending' && (
                            <button onClick={() => handleCancelSpecialPricing(sp)} className={`${styles.btnActionSmall} ${styles.btnSecondary}`}>
                              <FaBan /> Cancel
                            </button>
                          )}
                          <button onClick={() => handleDeleteSpecialPricing(sp)} className={styles.btnDelete}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ========================================== */}
        {/* VIEW 4: AUDIT LOGSs */}
        {/* ========================================== */}
        {mainNav === 'audit-logs' && (
          <>
            <h1 className={styles.pageTitle}>Discount System Audit Logs</h1>
            <p className={styles.pageSubtitle}>Complete security trail for promo codes and special pricing overrides.</p>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Timestamp</th>
                    <th className={styles.th}>Action</th>
                    <th className={styles.th}>Entity</th>
                    <th className={styles.th}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className={styles.tr}>
                      <td className={styles.td} style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>

                      <td className={styles.td}>
                        <span className={styles.badgeGeneral}>{log.action}</span>
                      </td>

                      <td className={styles.td} style={{ fontWeight: 700 }}>
                        {log.entity_type} ({log.entity_id})
                      </td>

                      <td className={styles.td} style={{ fontSize: '0.85rem' }}>
                        <code>{JSON.stringify(log.details)}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL: CREATE / EDIT PROMO CODE */}
      {/* ========================================== */}
      {showPromoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}</h3>
              <button onClick={() => setShowPromoModal(false)} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Promo Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME20"
                  className={styles.input}
                  value={promoFormData.code}
                  onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount Type *</label>
                <select
                  className={styles.select}
                  value={promoFormData.discountType}
                  onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value as any })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Discount Value *</label>
                <input
                  type="number"
                  required
                  placeholder={promoFormData.discountType === 'percentage' ? '20 for 20%' : '10000 for ₦10,000'}
                  className={styles.input}
                  value={promoFormData.discountValue}
                  onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Applies To</label>
                <select
                  className={styles.select}
                  value={promoFormData.appliesTo}
                  onChange={(e) => setPromoFormData({ ...promoFormData, appliesTo: e.target.value })}
                >
                  {PROGRAM_OPTIONS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fullWidth}>
                <label className={styles.label}>Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off Summer Camp early bird"
                  className={styles.input}
                  value={promoFormData.description}
                  onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Minimum Purchase (₦)</label>
                <input
                  type="number"
                  placeholder="0"
                  className={styles.input}
                  value={promoFormData.minPurchase}
                  onChange={(e) => setPromoFormData({ ...promoFormData, minPurchase: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Max Discount Cap (₦)</label>
                <input
                  type="number"
                  placeholder="Optional max discount"
                  className={styles.input}
                  value={promoFormData.maxDiscount}
                  onChange={(e) => setPromoFormData({ ...promoFormData, maxDiscount: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Usage Limit</label>
                <input
                  type="number"
                  placeholder="Leave blank for unlimited"
                  className={styles.input}
                  value={promoFormData.usageLimit}
                  onChange={(e) => setPromoFormData({ ...promoFormData, usageLimit: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Expiry Date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={promoFormData.expiryDate}
                  onChange={(e) => setPromoFormData({ ...promoFormData, expiryDate: e.target.value })}
                />
              </div>

              <div className={styles.fullWidth} style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={promoFormData.onePerParent}
                    onChange={(e) => setPromoFormData({ ...promoFormData, onePerParent: e.target.checked })}
                  />
                  One Use Per Parent Email
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={promoFormData.isActive}
                    onChange={(e) => setPromoFormData({ ...promoFormData, isActive: e.target.checked })}
                  />
                  Active & Enabled
                </label>
              </div>

              <div className={`${styles.modalFooter} ${styles.fullWidth}`}>
                <button type="button" onClick={() => setShowPromoModal(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE SPECIAL PRICING LINK */}
      {/* ========================================== */}
      {showSpecialModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create Special Pricing Link</h3>
              <button onClick={() => setShowSpecialModal(false)} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveSpecialPricing} className={styles.formGrid}>
              <div className={styles.fullWidth} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedParentMode('existing')}
                  className={styles.btnSecondary}
                  style={{
                    flex: 1,
                    background: selectedParentMode === 'existing' ? '#eff6ff' : '#f1f5f9',
                    borderColor: selectedParentMode === 'existing' ? '#0A66C2' : '#cbd5e1',
                    color: selectedParentMode === 'existing' ? '#0A66C2' : '#475569',
                  }}
                >
                  Select Existing Parent
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedParentMode('new')}
                  className={styles.btnSecondary}
                  style={{
                    flex: 1,
                    background: selectedParentMode === 'new' ? '#eff6ff' : '#f1f5f9',
                    borderColor: selectedParentMode === 'new' ? '#0A66C2' : '#cbd5e1',
                    color: selectedParentMode === 'new' ? '#0A66C2' : '#475569',
                  }}
                >
                  Enter New Parent
                </button>
              </div>

              {selectedParentMode === 'existing' && (
                <div className={styles.fullWidth}>
                  <label className={styles.label}>Select Parent from CRM</label>
                  <select
                    className={styles.select}
                    onChange={(e) => handleSelectExistingParent(e.target.value)}
                  >
                    <option value="">-- Choose Parent --</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.parentName} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Emmanuel Okon"
                  className={styles.input}
                  value={specialFormData.parentName}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, parentName: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent Email *</label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  className={styles.input}
                  value={specialFormData.parentEmail}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, parentEmail: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+234 801 234 5678"
                  className={styles.input}
                  value={specialFormData.parentPhone}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, parentPhone: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Program *</label>
                <select
                  className={styles.select}
                  value={specialFormData.program}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, program: e.target.value })}
                >
                  {PROGRAM_OPTIONS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Number of Children</label>
                <input
                  type="number"
                  min="1"
                  className={styles.input}
                  value={specialFormData.numChildren}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, numChildren: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Reason for Override</label>
                <select
                  className={styles.select}
                  value={specialFormData.reason}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, reason: e.target.value })}
                >
                  <option value="Family Discount">Family Discount</option>
                  <option value="Scholarship">Scholarship</option>
                  <option value="VIP">VIP</option>
                  <option value="Special Approval">Special Approval</option>
                  <option value="Staff Benefit">Staff Benefit</option>
                  <option value="Referral Reward">Referral Reward</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Original Price (₦) *</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={specialFormData.originalPrice}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, originalPrice: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Override Price (₦) *</label>
                <input
                  type="number"
                  required
                  className={styles.input}
                  value={specialFormData.overridePrice}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, overridePrice: e.target.value })}
                />
              </div>

              <div className={styles.fullWidth} style={{ background: '#f0fdf4', padding: '0.85rem', borderRadius: '10px', border: '1px solid #86efac', color: '#16a34a', fontWeight: 700 }}>
                Calculated Discount: ₦
                {Math.max(
                  0,
                  (Number(specialFormData.originalPrice) || 0) - (Number(specialFormData.overridePrice) || 0)
                ).toLocaleString()}
              </div>

              <div className={styles.fullWidth}>
                <label className={styles.label}>Expiry Date (Optional)</label>
                <input
                  type="date"
                  className={styles.input}
                  value={specialFormData.expiryDate}
                  onChange={(e) => setSpecialFormData({ ...specialFormData, expiryDate: e.target.value })}
                />
              </div>

              <div className={`${styles.modalFooter} ${styles.fullWidth}`}>
                <button type="button" onClick={() => setShowSpecialModal(false)} className={styles.btnSecondary}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Generate Payment Link & Copy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
