const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { pool, pingDatabase } = require('./database/pool');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS middleware to guarantee CORS headers on all requests & preflights
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Initialize Database connection on startup
pingDatabase()
  .then(() => {
    console.log('[DB] Connected to PostgreSQL via database pool.');
  })
  .catch((err) => {
    console.error('[DB] Connection error:', err.message);
  });

// Optional Supabase Client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Healthcheck Route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Codiva Builders API is running...', 
    status: 'online',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '2348105281572'
  });
});

// Helper for multi-children processing & discount engine
function calculateMultiChildDiscount(childrenList = [], basePricePerChild = 40000) {
  const childCount = childrenList.length || 1;
  const rawSubtotal = childCount * basePricePerChild;
  
  // 20% discount on each child if 2 or more children
  let discountPercentage = 0;
  if (childCount >= 2) {
    discountPercentage = 0.20;
  }
  
  const discountAmount = rawSubtotal * discountPercentage;
  const finalTotal = rawSubtotal - discountAmount;

  return {
    childCount,
    rawSubtotal,
    discountAmount,
    discountPercentage,
    finalTotal
  };
}

// ==========================================
// PUBLIC ENROLLMENT ENDPOINTS
// ==========================================

// General Program Enrollment Endpoint (Supports Multi-children & Paystack)
app.post('/api/enroll', async (req, res) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  try {
    const { 
      parentName, 
      parentEmail, 
      parentPhone, 
      children, // Array of { name, age, course, schedule }
      childName, // Fallback single child
      childAge, 
      course, 
      learningMode,
      paymentMethod, // 'Paystack' | 'Pay Later'
      paymentStatus, // 'Paid' | 'Pending Payment'
      paymentReference,
      basePricePerChild
    } = req.body || {};

    if (!parentName || !parentEmail || !parentPhone) {
      return res.status(400).json({ error: 'Parent Name, Email, and Phone number are required' });
    }

    // Build standardized children list
    let childrenList = Array.isArray(children) && children.length > 0 ? children : [];
    if (childrenList.length === 0 && childName) {
      childrenList.push({
        name: childName,
        age: parseInt(childAge || '0', 10),
        course: course || 'General Program',
        schedule: learningMode || 'Online'
      });
    }

    if (childrenList.length === 0) {
      return res.status(400).json({ error: 'At least one child details must be provided' });
    }

    const firstChild = childrenList[0];
    const pricing = calculateMultiChildDiscount(childrenList, basePricePerChild || 40000);
    const status = paymentStatus || (paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment');
    const method = paymentMethod || 'Pay Later';
    const ref = paymentReference || `ENR_${Date.now()}`;

    let savedData = null;

    try {
      const result = await pool.query(
        `INSERT INTO enrollments 
         (parent_name, parent_email, parent_phone, child_name, child_age, course, learning_mode, children_json, amount, discount_amount, payment_status, payment_method, payment_reference)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [
          parentName,
          parentEmail,
          parentPhone,
          firstChild.name || '',
          parseInt(firstChild.age || '0', 10),
          firstChild.course || 'General Course',
          firstChild.schedule || learningMode || 'Online',
          JSON.stringify(childrenList),
          pricing.finalTotal,
          pricing.discountAmount,
          status,
          method,
          ref
        ]
      );
      savedData = result.rows[0];
    } catch (pgErr) {
      console.warn('[DB] PostgreSQL enrollment insert note:', pgErr.message);
    }

    if (!savedData && supabase) {
      try {
        const { data: sbData } = await supabase.from('enrollments').insert([
          { 
            parent_name: parentName, 
            parent_email: parentEmail, 
            parent_phone: parentPhone, 
            child_name: firstChild.name || '', 
            child_age: parseInt(firstChild.age || '0', 10), 
            course: firstChild.course || 'General Course', 
            learning_mode: firstChild.schedule || learningMode || 'Online',
            children_json: childrenList,
            amount: pricing.finalTotal,
            discount_amount: pricing.discountAmount,
            payment_status: status,
            payment_method: method,
            payment_reference: ref,
            created_at: new Date()
          }
        ]).select();
        if (sbData && sbData.length > 0) savedData = sbData[0];
      } catch (sbErr) {
        console.warn('[DB] Supabase enrollment insert note:', sbErr.message);
      }
    }

    return res.status(201).json({ 
      message: 'Enrollment registered successfully', 
      pricing,
      data: savedData || { 
        id: Date.now(),
        parentName, 
        parentEmail, 
        childrenList,
        amount: pricing.finalTotal,
        paymentStatus: status,
        paymentReference: ref
      } 
    });
  } catch (error) {
    console.error('Error saving enrollment:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Summer Academy Registration Endpoint (Multi-children + Discount + Payment)
app.post('/api/summer-register', async (req, res) => {
  const origin = req.headers.origin;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  try {
    const { 
      parentName, 
      parentPhone, 
      parentEmail, 
      children,
      childName, 
      childAge, 
      assignedTrack, 
      preferredCampus,
      agreeUpdates,
      paymentMethod,
      paymentStatus,
      paymentReference,
      basePricePerChild
    } = req.body || {};

    if (!parentName || !parentEmail || !parentPhone) {
      return res.status(400).json({ error: 'Parent Name, Email, and Phone number are required' });
    }

    let childrenList = Array.isArray(children) && children.length > 0 ? children : [];
    if (childrenList.length === 0 && childName) {
      childrenList.push({
        name: childName,
        age: parseInt(childAge || '0', 10),
        course: assignedTrack || 'Summer Track',
        schedule: preferredCampus || 'Online / Virtual Campus'
      });
    }

    if (childrenList.length === 0) {
      return res.status(400).json({ error: 'At least one child details must be provided' });
    }

    const firstChild = childrenList[0];
    const pricing = calculateMultiChildDiscount(childrenList, basePricePerChild || 50000);
    const status = paymentStatus || (paymentMethod === 'Paystack' ? 'Paid' : 'Pending Payment');
    const method = paymentMethod || 'Pay Later';
    const ref = paymentReference || `SMR_${Date.now()}`;

    let savedData = null;

    try {
      const result = await pool.query(
        `INSERT INTO summer_registrations 
         (parent_name, child_name, child_age, assigned_track, parent_phone, parent_email, preferred_campus, agree_updates, children_json, amount, discount_amount, payment_status, payment_method, payment_reference)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING *`,
        [
          parentName,
          firstChild.name || '',
          parseInt(firstChild.age || '0', 10),
          firstChild.course || assignedTrack || 'Summer Track',
          parentPhone,
          parentEmail,
          preferredCampus || 'Online / Virtual Campus',
          agreeUpdates !== false,
          JSON.stringify(childrenList),
          pricing.finalTotal,
          pricing.discountAmount,
          status,
          method,
          ref
        ]
      );
      savedData = result.rows[0];
    } catch (pgErr) {
      console.error('[DB] PostgreSQL summer_registration insert FAILED:', pgErr.message, pgErr.detail || '');
    }

    if (!savedData && supabase) {
      try {
        const { data: sbData } = await supabase.from('summer_registrations').insert([
          { 
            parent_name: parentName, 
            child_name: firstChild.name || '', 
            child_age: parseInt(firstChild.age || '0', 10), 
            assigned_track: firstChild.course || assignedTrack || 'Summer Track',
            parent_phone: parentPhone, 
            parent_email: parentEmail, 
            preferred_campus: preferredCampus || 'Online / Virtual Campus',
            agree_updates: agreeUpdates !== false,
            children_json: childrenList,
            amount: pricing.finalTotal,
            discount_amount: pricing.discountAmount,
            payment_status: status,
            payment_method: method,
            payment_reference: ref,
            created_at: new Date()
          }
        ]).select();

        if (sbData && sbData.length > 0) {
          savedData = sbData[0];
        }
      } catch (sbErr) {
        console.warn('[DB] Supabase insert note:', sbErr.message);
      }
    }

    return res.status(201).json({ 
      message: 'Summer registration saved successfully', 
      pricing,
      data: savedData || { 
        id: Date.now(),
        parentName, 
        parentEmail, 
        childrenList,
        amount: pricing.finalTotal,
        paymentStatus: status,
        paymentReference: ref
      } 
    });
  } catch (error) {
    console.error('Error saving summer registration:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Paystack Verification & Payment Update Endpoint
app.post('/api/paystack/verify', async (req, res) => {
  try {
    const { reference, registrationId, type } = req.body || {};

    if (!reference) {
      return res.status(400).json({ error: 'Missing payment reference' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Server-side verification with Paystack API if secret key is configured
    if (paystackSecretKey && paystackSecretKey.trim() !== '') {
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${paystackSecretKey.trim()}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.status || verifyData.data?.status !== 'success') {
          console.error('[Paystack] Transaction verification failed:', verifyData);
          return res.status(400).json({
            error: 'Payment verification failed with Paystack API',
            details: verifyData.message || 'Transaction was not successful',
          });
        }

        console.log(`[Paystack] Successfully verified reference ${reference} via Paystack API.`);
      } catch (verifyErr) {
        console.error('[Paystack] API call error:', verifyErr.message);
        return res.status(502).json({ error: 'Unable to reach Paystack verification servers' });
      }
    } else {
      console.warn('[Paystack] PAYSTACK_SECRET_KEY is not set. Skipping server-side API verification.');
    }

    // Mark database record as Paid
    const table = type === 'Summer Academy 2026' || type === 'summer' ? 'summer_registrations' : 'enrollments';

    if (registrationId) {
      try {
        await pool.query(
          `UPDATE ${table} SET payment_status = 'Paid', payment_method = 'Paystack', payment_reference = $1 WHERE id = $2`,
          [reference, registrationId]
        );
      } catch (pgErr) {
        console.warn('[DB] Could not update payment status in postgres pool:', pgErr.message);
      }

      if (supabase) {
        try {
          await supabase.from(table).update({
            payment_status: 'Paid',
            payment_method: 'Paystack',
            payment_reference: reference
          }).eq('id', registrationId);
        } catch (sbErr) {
          console.warn('[DB] Supabase update note:', sbErr.message);
        }
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified and status updated to Paid',
      reference,
      status: 'Paid'
    });
  } catch (error) {
    console.error('Paystack verification error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ADMIN ENDPOINTS (To view & manage registered users)
// ==========================================

// Get All Registrations (Combined Summer + General)
app.get('/api/admin/users', async (req, res) => {
  try {
    let summerRows = [];
    let generalRows = [];

    // Try PostgreSQL Pool first
    try {
      const summerRes = await pool.query("SELECT *, 'summer' as type FROM summer_registrations ORDER BY created_at DESC");
      summerRows = summerRes.rows || [];
    } catch (pgErr) {
      console.warn('[DB] PostgreSQL summer_registrations query note:', pgErr.message);
    }

    try {
      const generalRes = await pool.query("SELECT *, 'general' as type FROM enrollments ORDER BY created_at DESC");
      generalRows = generalRes.rows || [];
    } catch (pgErr) {
      console.warn('[DB] PostgreSQL enrollments query note:', pgErr.message);
    }

    // Secondary Fallback: Supabase Client if postgres pool returned nothing
    if (summerRows.length === 0 && generalRows.length === 0 && supabase) {
      try {
        const { data: sbSummer } = await supabase.from('summer_registrations').select('*').order('created_at', { ascending: false });
        const { data: sbGeneral } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
        
        if (sbSummer) summerRows = sbSummer;
        if (sbGeneral) generalRows = sbGeneral;
      } catch (sbErr) {
        console.warn('[DB] Supabase fallback fetch note:', sbErr.message);
      }
    }

    const parseChildren = (row) => {
      if (row.children_json) {
        try {
          const parsed = typeof row.children_json === 'string' ? JSON.parse(row.children_json) : row.children_json;
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      // Single child fallback
      return [{
        name: row.child_name || row.childName || 'Child',
        age: row.child_age || row.childAge || '',
        course: row.assigned_track || row.course || 'General Track',
        schedule: row.preferred_campus || row.learning_mode || 'Online'
      }];
    };

    const summerUsers = summerRows.map(r => {
      const children = parseChildren(r);
      const amount = Number(r.amount) || (children.length >= 2 ? children.length * 40000 : 50000 * children.length);
      return {
        id: `summer-${r.id}`,
        rawId: r.id,
        type: 'Summer Academy 2026',
        parentName: r.parent_name || r.parentName || '',
        childName: children.map(c => c.name).join(', '),
        childAge: children.map(c => c.age).join(', '),
        children,
        program: children.map(c => c.course).join(' | '),
        phone: r.parent_phone || r.parentPhone || '',
        email: r.parent_email || r.parentEmail || '',
        campus: r.preferred_campus || r.preferredCampus || 'Online / Virtual Campus',
        amount,
        discountAmount: Number(r.discount_amount) || 0,
        paymentStatus: r.payment_status || 'Pending Payment',
        paymentMethod: r.payment_method || 'Pay Later',
        paymentReference: r.payment_reference || '',
        agreeUpdates: r.agree_updates !== false,
        createdAt: r.created_at || new Date().toISOString()
      };
    });

    const generalUsers = generalRows.map(r => {
      const children = parseChildren(r);
      const amount = Number(r.amount) || (children.length >= 2 ? children.length * 32000 : 40000 * children.length);
      return {
        id: `general-${r.id}`,
        rawId: r.id,
        type: 'General Program',
        parentName: r.parent_name || r.parentName || '',
        childName: children.map(c => c.name).join(', '),
        childAge: children.map(c => c.age).join(', '),
        children,
        program: children.map(c => c.course).join(' | '),
        phone: r.parent_phone || r.parentPhone || '',
        email: r.parent_email || r.parentEmail || '',
        campus: r.learning_mode || r.learningMode || 'Online',
        amount,
        discountAmount: Number(r.discount_amount) || 0,
        paymentStatus: r.payment_status || 'Pending Payment',
        paymentMethod: r.payment_method || 'Pay Later',
        paymentReference: r.payment_reference || '',
        agreeUpdates: true,
        createdAt: r.created_at || new Date().toISOString()
      };
    });

    const allUsers = [...summerUsers, ...generalUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    let totalPaidRevenue = 0;
    let totalPendingRevenue = 0;
    let totalChildrenCount = 0;

    allUsers.forEach(u => {
      totalChildrenCount += u.children ? u.children.length : 1;
      if (u.paymentStatus === 'Paid') {
        totalPaidRevenue += u.amount;
      } else {
        totalPendingRevenue += u.amount;
      }
    });

    return res.json({
      stats: {
        totalRegistrations: allUsers.length,
        totalChildrenCount,
        totalPaidRevenue,
        totalPendingRevenue,
        summerCount: summerUsers.length,
        generalCount: generalUsers.length,
        paidCount: allUsers.filter(u => u.paymentStatus === 'Paid').length,
        pendingCount: allUsers.filter(u => u.paymentStatus === 'Pending Payment').length,
      },
      users: allUsers,
      summerRegistrations: summerUsers,
      generalEnrollments: generalUsers
    });
  } catch (error) {
    console.error('Admin API error:', error.message);
    return res.json({
      stats: { totalRegistrations: 0, totalChildrenCount: 0, totalPaidRevenue: 0, totalPendingRevenue: 0 },
      users: [],
      warning: error.message
    });
  }
});

// Update Registration Payment Status (e.g. Mark Pending as Paid)
app.patch('/api/admin/registrations/:type/:id/status', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { paymentStatus } = req.body || {};

    const newStatus = paymentStatus || 'Paid';
    const table = type === 'summer' ? 'summer_registrations' : 'enrollments';

    try {
      await pool.query(`UPDATE ${table} SET payment_status = $1 WHERE id = $2`, [newStatus, id]);
    } catch (pgErr) {
      console.warn('[DB] PostgreSQL status update note:', pgErr.message);
    }

    if (supabase) {
      try {
        await supabase.from(table).update({ payment_status: newStatus }).eq('id', id);
      } catch (sbErr) {
        console.warn('[DB] Supabase status update note:', sbErr.message);
      }
    }

    return res.json({ message: `Registration status updated to ${newStatus}`, id, status: newStatus });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a Summer Registration Entry
app.delete('/api/admin/summer-registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM summer_registrations WHERE id = $1', [id]);
    res.json({ message: 'Summer registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a General Enrollment Entry
app.delete('/api/admin/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
