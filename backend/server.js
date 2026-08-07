const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/codivaheart', async (_req, res) => {
  try {
    await pool.query(
      'UPDATE codivaheart SET last_ping = CURRENT_TIMESTAMP, counter = counter + 1 WHERE id = 1'
    );
    res.status(200).json({ status: 'alive', heart: 'beating' });
  } catch (err) {
    console.error('CodivaHeart check failed', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
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

    const { promoCode } = req.body || {};
    const firstChild = childrenList[0];
    const pricing = calculateMultiChildDiscount(childrenList, basePricePerChild || 40000);

    let promoDiscount = 0;
    let validatedPromo = null;

    if (promoCode && promoCode.trim()) {
      const promoResult = await validatePromoCodeHelper({
        code: promoCode,
        cartSubtotal: pricing.finalTotal,
        program: firstChild.course || 'General Course',
        parentEmail
      });
      if (promoResult.valid) {
        promoDiscount = promoResult.discountAmount;
        validatedPromo = promoResult;
      }
    }

    pricing.discountAmount = pricing.discountAmount + promoDiscount;
    pricing.finalTotal = Math.max(0, pricing.finalTotal - promoDiscount);

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

    if (validatedPromo) {
      await recordPromoUsage(
        validatedPromo.promoId,
        validatedPromo.code,
        parentEmail,
        ref,
        validatedPromo.discountAmount
      );
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
      basePricePerChild,
      promoCode
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

    let promoDiscount = 0;
    let validatedPromo = null;

    if (promoCode && promoCode.trim()) {
      const promoResult = await validatePromoCodeHelper({
        code: promoCode,
        cartSubtotal: pricing.finalTotal,
        program: firstChild.course || assignedTrack || 'Summer Track',
        parentEmail
      });
      if (promoResult.valid) {
        promoDiscount = promoResult.discountAmount;
        validatedPromo = promoResult;
      }
    }

    pricing.discountAmount = pricing.discountAmount + promoDiscount;
    pricing.finalTotal = Math.max(0, pricing.finalTotal - promoDiscount);

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

    if (validatedPromo) {
      await recordPromoUsage(
        validatedPromo.promoId,
        validatedPromo.code,
        parentEmail,
        ref,
        validatedPromo.discountAmount
      );
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

// ==========================================
// PROMOTIONS & SPECIAL PRICING ENDPOINTS
// ==========================================

async function logDiscountAudit(action, entityType, entityId, details) {
  try {
    await pool.query(
      `INSERT INTO discount_audit_logs (action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4)`,
      [action, entityType, String(entityId || ''), JSON.stringify(details || {})]
    );
  } catch (err) {
    console.warn('[Audit Log Error]', err.message);
  }
}

async function validatePromoCodeHelper({ code, cartSubtotal, program, parentEmail }) {
  if (!code || !code.trim()) {
    return { valid: false, message: 'Promo code is required.' };
  }

  const cleanCode = code.trim().toUpperCase();
  const subtotal = Number(cartSubtotal) || 0;

  try {
    const res = await pool.query('SELECT * FROM promo_codes WHERE UPPER(code) = $1', [cleanCode]);
    if (res.rows.length === 0) {
      return { valid: false, message: 'Invalid Promo Code' };
    }

    const promo = res.rows[0];

    if (!promo.is_active) {
      return { valid: false, message: 'Invalid Promo Code' };
    }

    if (promo.expiry_date && new Date(promo.expiry_date) < new Date()) {
      return { valid: false, message: 'This promotion has expired.' };
    }

    if (promo.usage_limit !== null && promo.usage_limit !== undefined && promo.usage_count >= promo.usage_limit) {
      return { valid: false, message: 'This promo has reached its usage limit.' };
    }

    const minPurchase = Number(promo.min_purchase) || 0;
    if (subtotal < minPurchase) {
      return { valid: false, message: `Minimum purchase of ₦${minPurchase.toLocaleString()} required.` };
    }

    if (promo.applies_to && promo.applies_to !== 'All Programs' && program) {
      const appliesToClean = promo.applies_to.trim().toLowerCase();
      const programClean = program.trim().toLowerCase();
      if (!programClean.includes(appliesToClean) && !appliesToClean.includes(programClean)) {
        return { valid: false, message: `This promo code is only applicable to ${promo.applies_to}.` };
      }
    }

    if (promo.one_per_parent && parentEmail && parentEmail.trim()) {
      const usageRes = await pool.query(
        'SELECT id FROM promo_usages WHERE promo_id = $1 AND LOWER(parent_email) = $2',
        [promo.id, parentEmail.trim().toLowerCase()]
      );
      if (usageRes.rows.length > 0) {
        return { valid: false, message: 'A parent cannot reuse the same promo.' };
      }
    }

    let discountAmount = 0;
    const discountVal = Number(promo.discount_value) || 0;

    if (promo.discount_type === 'percentage') {
      discountAmount = (subtotal * discountVal) / 100;
      if (promo.max_discount !== null && promo.max_discount !== undefined) {
        const maxDisc = Number(promo.max_discount);
        if (maxDisc > 0 && discountAmount > maxDisc) {
          discountAmount = maxDisc;
        }
      }
    } else {
      discountAmount = discountVal;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      valid: true,
      promoId: promo.id,
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discount_type,
      discountValue: discountVal,
      discountAmount,
      subtotal,
      finalTotal,
    };
  } catch (err) {
    console.error('Validation helper error:', err.message);
    return { valid: false, message: 'Error validating promo code.' };
  }
}

async function recordPromoUsage(promoId, promoCode, parentEmail, orderRef, discountAmount) {
  try {
    await pool.query(
      `INSERT INTO promo_usages (promo_id, promo_code, parent_email, order_reference, discount_amount) VALUES ($1, $2, $3, $4, $5)`,
      [promoId, promoCode, parentEmail || '', orderRef || '', discountAmount]
    );
    await pool.query(`UPDATE promo_codes SET usage_count = usage_count + 1, updated_at = NOW() WHERE id = $1`, [promoId]);
    await logDiscountAudit('REDEEM_PROMO', 'PROMO_CODE', promoId, { promoCode, parentEmail, discountAmount, orderRef });
  } catch (err) {
    console.warn('[Record Promo Usage Warning]', err.message);
  }
}

// Validate Promo Code (Public API)
app.post('/api/promotions/validate', async (req, res) => {
  const { code, cartSubtotal, program, parentEmail } = req.body || {};
  const result = await validatePromoCodeHelper({ code, cartSubtotal, program, parentEmail });
  if (!result.valid) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

// Admin Promo Codes GET
app.get('/api/admin/promotions', async (req, res) => {
  try {
    const promoRes = await pool.query('SELECT * FROM promo_codes ORDER BY created_at DESC');
    const promos = promoRes.rows || [];

    const usageRes = await pool.query('SELECT SUM(discount_amount) as total_discount, COUNT(*) as total_redemptions FROM promo_usages');
    const statsRow = usageRes.rows[0] || {};
    const totalDiscountGiven = Number(statsRow.total_discount) || 0;
    const totalPromoRedemptions = Number(statsRow.total_redemptions) || 0;

    const now = new Date();
    let activeCount = 0;
    let expiredCount = 0;
    let mostUsedPromo = 'None';
    let maxUsage = -1;

    promos.forEach((p) => {
      const isExpired = p.expiry_date && new Date(p.expiry_date) < now;
      if (p.is_active && !isExpired) {
        activeCount++;
      }
      if (isExpired) {
        expiredCount++;
      }
      if (p.usage_count > maxUsage && p.usage_count > 0) {
        maxUsage = p.usage_count;
        mostUsedPromo = `${p.code} (${p.usage_count})`;
      }
    });

    return res.json({
      promos,
      stats: {
        totalPromos: promos.length,
        activeCount,
        expiredCount,
        totalDiscountGiven,
        mostUsedPromo,
        totalPromoRedemptions,
      },
    });
  } catch (err) {
    console.error('Fetch promotions error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Promo Code CREATE
app.post('/api/admin/promotions', async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      appliesTo,
      minPurchase,
      maxDiscount,
      usageLimit,
      onePerParent,
      expiryDate,
      isActive,
    } = req.body || {};

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ error: 'Promo Code, Discount Type, and Discount Value are required.' });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await pool.query('SELECT id FROM promo_codes WHERE UPPER(code) = $1', [cleanCode]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: `Promo code '${cleanCode}' already exists.` });
    }

    const insertRes = await pool.query(
      `INSERT INTO promo_codes 
       (code, description, discount_type, discount_value, applies_to, min_purchase, max_discount, usage_limit, one_per_parent, expiry_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        cleanCode,
        description || '',
        discountType,
        Number(discountValue),
        appliesTo || 'All Programs',
        Number(minPurchase || 0),
        maxDiscount ? Number(maxDiscount) : null,
        usageLimit ? parseInt(usageLimit, 10) : null,
        onePerParent === true,
        expiryDate || null,
        isActive !== false,
      ]
    );

    const createdPromo = insertRes.rows[0];
    await logDiscountAudit('CREATE_PROMO', 'PROMO_CODE', createdPromo.id, { code: cleanCode, discountType, discountValue });

    return res.status(201).json({ message: 'Promo code created successfully', promo: createdPromo });
  } catch (err) {
    console.error('Create promo error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Promo Code UPDATE
app.put('/api/admin/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discountType,
      discountValue,
      appliesTo,
      minPurchase,
      maxDiscount,
      usageLimit,
      onePerParent,
      expiryDate,
      isActive,
    } = req.body || {};

    const cleanCode = code ? code.trim().toUpperCase() : undefined;

    const updateRes = await pool.query(
      `UPDATE promo_codes SET
        code = COALESCE($1, code),
        description = $2,
        discount_type = $3,
        discount_value = $4,
        applies_to = $5,
        min_purchase = $6,
        max_discount = $7,
        usage_limit = $8,
        one_per_parent = $9,
        expiry_date = $10,
        is_active = $11,
        updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        cleanCode,
        description || '',
        discountType,
        Number(discountValue),
        appliesTo || 'All Programs',
        Number(minPurchase || 0),
        maxDiscount ? Number(maxDiscount) : null,
        usageLimit ? parseInt(usageLimit, 10) : null,
        onePerParent === true,
        expiryDate || null,
        isActive !== false,
        id,
      ]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    const updatedPromo = updateRes.rows[0];
    await logDiscountAudit('UPDATE_PROMO', 'PROMO_CODE', id, { code: updatedPromo.code });

    return res.json({ message: 'Promo code updated successfully', promo: updatedPromo });
  } catch (err) {
    console.error('Update promo error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Promo Code Toggle Active/Inactive
app.patch('/api/admin/promotions/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const toggleRes = await pool.query(
      `UPDATE promo_codes SET is_active = NOT is_active, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );
    if (toggleRes.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found' });
    }
    const promo = toggleRes.rows[0];
    await logDiscountAudit('TOGGLE_PROMO', 'PROMO_CODE', id, { code: promo.code, is_active: promo.is_active });
    return res.json({ message: `Promo code ${promo.is_active ? 'enabled' : 'disabled'}`, promo });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Promo Code DELETE
app.delete('/api/admin/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const delRes = await pool.query('DELETE FROM promo_codes WHERE id = $1 RETURNING code', [id]);
    if (delRes.rows.length > 0) {
      await logDiscountAudit('DELETE_PROMO', 'PROMO_CODE', id, { code: delRes.rows[0].code });
    }
    return res.json({ message: 'Promo code deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Promo Code DUPLICATE
app.post('/api/admin/promotions/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    const originalRes = await pool.query('SELECT * FROM promo_codes WHERE id = $1', [id]);
    if (originalRes.rows.length === 0) {
      return res.status(404).json({ error: 'Promo code not found' });
    }
    const orig = originalRes.rows[0];
    const newCode = `${orig.code}_COPY_${Math.floor(Math.random() * 1000)}`;

    const dupRes = await pool.query(
      `INSERT INTO promo_codes 
       (code, description, discount_type, discount_value, applies_to, min_purchase, max_discount, usage_limit, one_per_parent, expiry_date, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        newCode,
        `Copy of ${orig.description || orig.code}`,
        orig.discount_type,
        orig.discount_value,
        orig.applies_to,
        orig.min_purchase,
        orig.max_discount,
        orig.usage_limit,
        orig.one_per_parent,
        orig.expiry_date,
        orig.is_active,
      ]
    );

    const dup = dupRes.rows[0];
    await logDiscountAudit('DUPLICATE_PROMO', 'PROMO_CODE', dup.id, { originalId: id, newCode });
    return res.status(201).json({ message: 'Promo code duplicated', promo: dup });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Special Pricing GET
app.get('/api/admin/special-pricings', async (req, res) => {
  try {
    const listRes = await pool.query('SELECT * FROM special_pricings ORDER BY created_at DESC');
    const records = listRes.rows || [];

    let totalDiscountsGiven = 0;
    let paidRevenue = 0;
    let pendingCount = 0;

    records.forEach((r) => {
      totalDiscountsGiven += Number(r.discount_amount) || 0;
      if (r.status === 'Paid') {
        paidRevenue += Number(r.override_price) || 0;
      } else if (r.status === 'Pending') {
        pendingCount++;
      }
    });

    return res.json({
      specialPricings: records,
      stats: {
        totalLinks: records.length,
        pendingCount,
        totalDiscountsGiven,
        paidRevenue,
      },
    });
  } catch (err) {
    console.error('Fetch special pricings error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Special Pricing CREATE (Generates secure payment link)
app.post('/api/admin/special-pricings', async (req, res) => {
  try {
    const {
      parentName,
      parentEmail,
      parentPhone,
      program,
      numChildren,
      originalPrice,
      overridePrice,
      reason,
      expiryDate,
    } = req.body || {};

    if (!parentName || !parentEmail || !parentPhone || !program || originalPrice === undefined || overridePrice === undefined) {
      return res.status(400).json({ error: 'Parent details, program, original price, and override price are required.' });
    }

    const origPriceNum = Number(originalPrice);
    const overPriceNum = Number(overridePrice);
    const discountAmount = Math.max(0, origPriceNum - overPriceNum);

    // Generate secure random token e.g. sP8KJ4Qw9
    const randomBytes = crypto.randomBytes(6).toString('hex');
    const token = `sP${randomBytes}`;

    const insertRes = await pool.query(
      `INSERT INTO special_pricings 
       (token, parent_name, parent_email, parent_phone, program, num_children, original_price, override_price, discount_amount, reason, expiry_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Pending')
       RETURNING *`,
      [
        token,
        parentName,
        parentEmail,
        parentPhone,
        program,
        parseInt(numChildren || '1', 10),
        origPriceNum,
        overPriceNum,
        discountAmount,
        reason || 'Special Approval',
        expiryDate || null,
      ]
    );

    const record = insertRes.rows[0];
    await logDiscountAudit('CREATE_SPECIAL_PRICING', 'SPECIAL_PRICING', record.id, { token, parentName, overridePrice });

    return res.status(201).json({ message: 'Special pricing link created', specialPricing: record, token });
  } catch (err) {
    console.error('Create special pricing error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Special Pricing CANCEL
app.patch('/api/admin/special-pricings/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const cancelRes = await pool.query(
      `UPDATE special_pricings SET status = 'Cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );
    if (cancelRes.rows.length === 0) {
      return res.status(404).json({ error: 'Special pricing link not found' });
    }
    const record = cancelRes.rows[0];
    await logDiscountAudit('CANCEL_SPECIAL_PRICING', 'SPECIAL_PRICING', id, { token: record.token });
    return res.json({ message: 'Special pricing link cancelled', specialPricing: record });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Special Pricing DELETE
app.delete('/api/admin/special-pricings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM special_pricings WHERE id = $1', [id]);
    await logDiscountAudit('DELETE_SPECIAL_PRICING', 'SPECIAL_PRICING', id, {});
    return res.json({ message: 'Special pricing record deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Public Endpoint: Fetch Special Pricing Link details by Token
app.get('/api/special-pricing/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const fetchRes = await pool.query('SELECT * FROM special_pricings WHERE token = $1', [token]);
    if (fetchRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or non-existent payment link.' });
    }

    let record = fetchRes.rows[0];

    // Check expiry
    if (record.status === 'Pending' && record.expiry_date && new Date(record.expiry_date) < new Date()) {
      await pool.query("UPDATE special_pricings SET status = 'Expired' WHERE id = $1", [record.id]);
      record.status = 'Expired';
    }

    return res.json({
      token: record.token,
      parentName: record.parent_name,
      parentEmail: record.parent_email,
      parentPhone: record.parent_phone,
      program: record.program,
      numChildren: record.num_children,
      originalPrice: Number(record.original_price),
      overridePrice: Number(record.override_price),
      discountAmount: Number(record.discount_amount),
      reason: record.reason,
      expiryDate: record.expiry_date,
      status: record.status,
      paidAt: record.paid_at,
      paymentMethod: record.payment_method,
      paymentReference: record.payment_reference,
    });
  } catch (err) {
    console.error('Fetch special pricing token error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Public Endpoint: Process Payment for Special Pricing Link
app.post('/api/special-pricing/:token/pay', async (req, res) => {
  try {
    const { token } = req.params;
    const { paymentMethod, paymentReference } = req.body || {};

    const fetchRes = await pool.query('SELECT * FROM special_pricings WHERE token = $1', [token]);
    if (fetchRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid payment link.' });
    }

    const record = fetchRes.rows[0];

    if (record.status === 'Paid') {
      return res.status(400).json({ error: 'This payment link has already been used.' });
    }
    if (record.status === 'Cancelled') {
      return res.status(400).json({ error: 'This payment link has been cancelled by admin.' });
    }
    if (record.expiry_date && new Date(record.expiry_date) < new Date()) {
      await pool.query("UPDATE special_pricings SET status = 'Expired' WHERE id = $1", [record.id]);
      return res.status(400).json({ error: 'This payment link has expired.' });
    }

    const ref = paymentReference || `SP_${Date.now()}`;
    const method = paymentMethod || 'Pay Later';

    // Verify Paystack if secret key is present and method is Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (method === 'Paystack' && paystackSecretKey && paystackSecretKey.trim() !== '') {
      try {
        const verifyRes = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
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
          return res.status(400).json({ error: 'Paystack transaction verification failed.' });
        }
      } catch (verifyErr) {
        return res.status(502).json({ error: 'Could not reach Paystack verification servers.' });
      }
    }

    // Update Special Pricing record to Paid
    const updateRes = await pool.query(
      `UPDATE special_pricings 
       SET status = 'Paid', payment_method = $1, payment_reference = $2, paid_at = NOW() 
       WHERE id = $3 RETURNING *`,
      [method, ref, record.id]
    );

    const updatedRecord = updateRes.rows[0];

    // Automatically record enrollment/registration in enrollments table so parent shows in Admin CRM!
    try {
      const childrenList = Array.from({ length: record.num_children || 1 }).map((_, idx) => ({
        name: `Child ${idx + 1} (${record.parent_name})`,
        age: 8,
        course: record.program,
        schedule: 'Special Override Link',
      }));

      await pool.query(
        `INSERT INTO enrollments 
         (parent_name, parent_email, parent_phone, child_name, child_age, course, learning_mode, children_json, amount, discount_amount, payment_status, payment_method, payment_reference)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Paid', $11, $12)`,
        [
          record.parent_name,
          record.parent_email,
          record.parent_phone,
          childrenList[0].name,
          8,
          record.program,
          'Special Pricing Link',
          JSON.stringify(childrenList),
          Number(record.override_price),
          Number(record.discount_amount),
          method,
          ref,
        ]
      );
    } catch (enrErr) {
      console.warn('[Special Pricing Enrollment Auto-create Note]', enrErr.message);
    }

    await logDiscountAudit('REDEEM_SPECIAL_PRICING', 'SPECIAL_PRICING', record.id, {
      token,
      overridePrice: record.override_price,
      paymentReference: ref,
    });

    return res.json({
      message: 'Payment completed successfully!',
      status: 'Paid',
      specialPricing: updatedRecord,
      reference: ref,
    });
  } catch (err) {
    console.error('Special pricing payment error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Admin Discount Audit Logs GET
app.get('/api/admin/discount-audit-logs', async (req, res) => {
  try {
    const logsRes = await pool.query('SELECT * FROM discount_audit_logs ORDER BY created_at DESC LIMIT 100');
    return res.json({ logs: logsRes.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
