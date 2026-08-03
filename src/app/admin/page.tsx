'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
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
} from 'react-icons/fa';

export interface RegisteredUser {
  id: string;
  rawId: number;
  type: string; // 'Summer Academy 2026' or 'General Program'
  parentName: string;
  childName: string;
  childAge: number | string;
  program: string;
  phone: string;
  email: string;
  campus: string;
  agreeUpdates: boolean;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'summer' | 'general'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Try Next.js API route first
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        // Fallback to Express backend directly
        const expRes = await fetch('http://localhost:5000/api/admin/users', { cache: 'no-store' });
        if (expRes.ok) {
          const expData = await expRes.json();
          setUsers(expData.users || []);
        } else {
          setError('Could not load registrations. Please check backend server.');
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch admin registered users:', err);
      setError('Connection failed. Ensure backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user: RegisteredUser) => {
    if (!confirm(`Are you sure you want to delete registration for ${user.childName}?`)) return;

    try {
      const endpoint = user.type.includes('Summer')
        ? `http://localhost:5000/api/admin/summer-registrations/${user.rawId}`
        : `http://localhost:5000/api/admin/enrollments/${user.rawId}`;

      await fetch(endpoint, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  // Filter users based on active tab & search query
  const filteredUsers = users.filter((u) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'summer' && u.type.includes('Summer')) ||
      (activeTab === 'general' && u.type.includes('General'));

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
  const estimatedRevenue = summerCount * 50000;

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
          <button onClick={fetchUsers} className={styles.btnRefresh} disabled={loading}>
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Registered Students & Academy Admissions</h1>
        <p className={styles.pageSubtitle}>
          Real-time database records for <strong>Summer Innovation Academy 2026</strong> and General Programs.
        </p>

        {/* Stats Summary */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>{users.length}</div>
              <div className={styles.statLabel}>Total Registered Students</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#eff6ff', color: '#0A66C2' }}>
              <FaUsers />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>{summerCount}</div>
              <div className={styles.statLabel}>Summer 2026 Cohort</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#FF6B00' }}>
              <FaRocket />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>{generalCount}</div>
              <div className={styles.statLabel}>General Enrollments</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#f0fdf4', color: '#10b981' }}>
              <FaLaptopCode />
            </div>
          </div>

          <div className={styles.statCard}>
            <div>
              <div className={styles.statValue}>₦{estimatedRevenue.toLocaleString()}</div>
              <div className={styles.statLabel}>Summer Pipeline Revenue</div>
            </div>
            <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
              <FaMoneyBillWave />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('all')}
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('summer')}
              className={`${styles.tabBtn} ${activeTab === 'summer' ? styles.tabBtnActive : ''}`}
            >
              Summer Academy 2026 ({summerCount})
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`${styles.tabBtn} ${activeTab === 'general' ? styles.tabBtnActive : ''}`}
            >
              General Programs ({generalCount})
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
              <p>Fetching registrations from database pool...</p>
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
                  <th className={styles.th}>Child Name & Age</th>
                  <th className={styles.th}>Assigned Track / Course</th>
                  <th className={styles.th}>Parent / Guardian</th>
                  <th className={styles.th}>WhatsApp Contact</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Campus</th>
                  <th className={styles.th}>Registered At</th>
                  <th className={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const cleanPhone = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : '#';

                  return (
                    <tr key={u.id} className={styles.tr}>
                      <td className={styles.td}>
                        <span
                          className={`${styles.badgeType} ${
                            u.type.includes('Summer') ? styles.badgeSummer : styles.badgeGeneral
                          }`}
                        >
                          {u.type}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <strong style={{ color: '#0f172a' }}>{u.childName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Age: {u.childAge}</div>
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontWeight: 700, color: '#0A66C2' }}>{u.program}</span>
                      </td>

                      <td className={styles.td}>
                        <strong>{u.parentName}</strong>
                      </td>

                      <td className={styles.td}>
                        {cleanPhone ? (
                          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.phoneLink}>
                            <FaWhatsapp /> {u.phone}
                          </a>
                        ) : (
                          <span>{u.phone || 'N/A'}</span>
                        )}
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontSize: '0.85rem' }}>
                          <FaEnvelope style={{ color: '#94a3b8', marginRight: '0.25rem' }} />
                          {u.email}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontSize: '0.85rem', color: '#475569' }}>{u.campus}</span>
                      </td>

                      <td className={styles.td} style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </td>

                      <td className={styles.td}>
                        <button
                          onClick={() => handleDelete(u)}
                          className={styles.btnDelete}
                          title="Delete Registration"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
