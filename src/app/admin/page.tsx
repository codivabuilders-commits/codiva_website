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

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'summer' | 'general' | 'paid' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
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
        setError('Could not load registrations. Please check backend server.');
      }
    } catch (err: any) {
      console.error('Failed to fetch admin registered users:', err);
      setError('Connection failed. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        prev.map((u) =>
          u.id === user.id ? { ...u, paymentStatus: 'Paid', paymentMethod: 'Bank Transfer (Confirmed)' } : u
        )
      );
    } catch (err) {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (user: RegisteredUser) => {
    if (!confirm(`Delete registration for ${user.childName || user.parentName}?`)) return;

    try {
      const endpoint = user.type.includes('Summer')
        ? `${API_BASE_URL}/api/admin/summer-registrations/${user.rawId}`
        : `${API_BASE_URL}/api/admin/enrollments/${user.rawId}`;

      await fetch(endpoint, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Type', 'Parent Name', 'Email', 'Phone', 'Children & Programs', 'Amount (₦)', 'Discount (₦)', 'Payment Status', 'Payment Method', 'Reference', 'Date Registered'];
    const rows = filteredUsers.map((u) => [
      u.type,
      u.parentName,
      u.email,
      u.phone,
      u.children && u.children.length > 0
        ? u.children.map((c: ChildInfo) => `${c.name} (Age ${c.age}, ${c.course})`).join(' | ')
        : u.childName,
      u.amount || 0,
      u.discountAmount || 0,
      u.paymentStatus,
      u.paymentMethod,
      u.paymentReference,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
    ]);

    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codiva_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((u) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'summer' && u.type.includes('Summer')) ||
      (activeTab === 'general' && u.type.includes('General')) ||
      (activeTab === 'paid' && u.paymentStatus === 'Paid') ||
      (activeTab === 'pending' && u.paymentStatus === 'Pending Payment');

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.parentName?.toLowerCase().includes(query) ||
      u.childName?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.program?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const summerCount = users.filter((u) => u.type.includes('Summer')).length;
  const generalCount = users.filter((u) => u.type.includes('General')).length;
  const paidCount = users.filter((u) => u.paymentStatus === 'Paid').length;
  const pendingCount = users.filter((u) => u.paymentStatus === 'Pending Payment').length;
  const totalPaidRevenue = users.filter((u) => u.paymentStatus === 'Paid').reduce((sum, u) => sum + (u.amount || 0), 0);
  const totalPendingRevenue = users.filter((u) => u.paymentStatus !== 'Paid').reduce((sum, u) => sum + (u.amount || 0), 0);
  const totalChildren = users.reduce((sum, u) => sum + (u.children?.length || 1), 0);

  return (
    <div className={styles.adminWrapper}>
      {/* Header Bar */}
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="/summer" style={{ color: '#64748b', fontSize: '1.1rem' }}>
            <FaArrowLeft />
          </a>
          <a href="/" className={styles.brand}>
            <span style={{ color: '#FF6B00' }}>Codiva</span>
            <span style={{ color: '#0A66C2' }}>Builders</span>
            <span className={styles.adminBadge}>Admin Portal</span>
          </a>
        </div>

        <div className={styles.headerActions}>
          <button onClick={handleExportCSV} className={styles.btnExport} title="Export participant list as CSV">
            <FaDownload /> Export CSV
          </button>
          <button onClick={fetchUsers} className={styles.btnRefresh} disabled={loading}>
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Registrations & Enrollment Dashboard</h1>
        <p className={styles.pageSubtitle}>
          Real-time records for <strong>Summer Innovation Academy 2026</strong> and all General Programs.
        </p>

        {/* Stats Summary */}
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
              <div className={styles.statValue}>{totalChildren}</div>
              <div className={styles.statLabel}>Total Children Enrolled</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#FF6B00' }}>
              <FaChild />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>₦{totalPaidRevenue.toLocaleString()}</div>
              <div className={styles.statLabel}>Confirmed Revenue (Paid)</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
              <FaMoneyBillWave />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>₦{totalPendingRevenue.toLocaleString()}</div>
              <div className={styles.statLabel}>Pending Revenue (Unpaid)</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
              <FaMoneyBillWave />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.tabGroup}>
            <button onClick={() => setActiveTab('all')} className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}>
              All ({users.length})
            </button>
            <button onClick={() => setActiveTab('summer')} className={`${styles.tabBtn} ${activeTab === 'summer' ? styles.tabBtnActive : ''}`}>
              Summer ({summerCount})
            </button>
            <button onClick={() => setActiveTab('general')} className={`${styles.tabBtn} ${activeTab === 'general' ? styles.tabBtnActive : ''}`}>
              General ({generalCount})
            </button>
            <button onClick={() => setActiveTab('paid')} className={`${styles.tabBtn} ${activeTab === 'paid' ? styles.tabBtnActive : ''}`}>
              Paid ✓ ({paidCount})
            </button>
            <button onClick={() => setActiveTab('pending')} className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.tabBtnActive : ''}`}>
              Pending ({pendingCount})
            </button>
          </div>

          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search parent, child, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⏳</div>
              <p>Fetching registrations from database...</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState} style={{ color: '#ef4444' }}>
              <div className={styles.emptyIcon}>⚠️</div>
              <p>{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <h3>No registered users found</h3>
              <p>{searchQuery ? 'Try adjusting your search criteria.' : 'No registrations have been submitted yet.'}</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Type</th>
                  <th className={styles.th}>Parent / Guardian</th>
                  <th className={styles.th}>Children & Programs</th>
                  <th className={styles.th}>WhatsApp</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Payment Status</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const cleanPhone = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
                  const waUrl = cleanPhone ? getWhatsAppLink(`Hello ${u.parentName}, this is Codiva Builders regarding your child's enrollment.`) : '#';
                  const childrenList: ChildInfo[] = u.children && u.children.length > 0
                    ? u.children
                    : [{ name: u.childName, age: u.childAge, course: u.program, schedule: u.campus }];

                  return (
                    <tr key={u.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span className={`${styles.badgeType} ${u.type.includes('Summer') ? styles.badgeSummer : styles.badgeGeneral}`}>
                          {u.type}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <strong style={{ color: '#0f172a' }}>{u.parentName}</strong>
                      </td>

                      <td className={styles.td}>
                        <div style={{ maxWidth: '220px' }}>
                          {childrenList.map((c: ChildInfo, ci: number) => (
                            <div key={ci} style={{ fontSize: '0.82rem', marginBottom: '0.2rem', color: '#334155' }}>
                              • <strong>{c.name}</strong> (Age {c.age}) — <span style={{ color: '#0A66C2' }}>{c.course}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className={styles.td}>
                        {cleanPhone ? (
                          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.phoneLink}>
                            <FaWhatsapp /> {u.phone}
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>N/A</span>
                        )}
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                          <FaEnvelope style={{ color: '#94a3b8', marginRight: '0.25rem' }} />
                          {u.email}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>₦{(u.amount || 0).toLocaleString()}</div>
                        {u.discountAmount > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#16a34a' }}>-₦{u.discountAmount.toLocaleString()} saved</div>
                        )}
                      </td>

                      <td className={styles.td}>
                        <span className={u.paymentStatus === 'Paid' ? styles.statusPaid : styles.statusPending}>
                          {u.paymentStatus === 'Paid' ? 'Paid ✓' : 'Pending Payment'}
                        </span>
                        {u.paymentMethod && (
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>{u.paymentMethod}</div>
                        )}
                      </td>

                      <td className={styles.td} style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>

                      <td className={styles.td}>
                        <div className={styles.actionCell}>
                          {u.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleMarkAsPaid(u)}
                              disabled={updatingId === u.id}
                              className={styles.btnMarkPaid}
                              title="Mark as Paid"
                            >
                              <FaCheckCircle /> {updatingId === u.id ? '...' : 'Mark Paid'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u)}
                            className={styles.btnDelete}
                            title="Delete Registration"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Contact info footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Admin contact: {DISPLAY_PHONE} | hello@codivabuilders.com
        </div>
      </div>
    </div>
  );
}
