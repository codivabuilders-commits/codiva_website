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
  res.json({ message: 'Codiva Builders API is running...', status: 'online' });
});

// ==========================================
// PUBLIC ENROLLMENT ENDPOINTS
// ==========================================

// General Program Enrollment Endpoint
app.post('/api/enroll', async (req, res) => {
  try {
    const { 
      childName, 
      childAge, 
      parentName, 
      parentEmail, 
      parentPhone, 
      course, 
      learningMode 
    } = req.body;

    if (!childName || !parentEmail || !course) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert directly into PostgreSQL database pool
    const result = await pool.query(
      `INSERT INTO enrollments (child_name, child_age, parent_name, parent_email, parent_phone, course, learning_mode)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        childName, 
        parseInt(childAge || '0', 10), 
        parentName || '', 
        parentEmail, 
        parentPhone || '', 
        course, 
        learningMode || 'Online'
      ]
    );

    // Also attempt Supabase sync if credentials exist
    if (supabase) {
      try {
        await supabase.from('enrollments').insert([
          { 
            child_name: childName, 
            child_age: childAge, 
            parent_name: parentName, 
            parent_email: parentEmail, 
            parent_phone: parentPhone, 
            course: course, 
            learning_mode: learningMode,
            created_at: new Date()
          }
        ]);
      } catch (sbErr) {
        console.warn('[DB] Supabase secondary sync note:', sbErr.message);
      }
    }

    res.status(201).json({ 
      message: 'Enrollment successful', 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error saving enrollment:', error.message);
    res.status(500).json({ error: 'Failed to process enrollment: ' + error.message });
  }
});

// Summer Academy Registration Endpoint
app.post('/api/summer-register', async (req, res) => {
  try {
    const { 
      parentName, 
      childName, 
      childAge, 
      assignedTrack, 
      parentPhone, 
      parentEmail, 
      preferredCampus,
      agreeUpdates
    } = req.body;

    if (!parentName || !childName || !parentEmail || !parentPhone) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    // Insert directly into PostgreSQL database pool
    const result = await pool.query(
      `INSERT INTO summer_registrations (parent_name, child_name, child_age, assigned_track, parent_phone, parent_email, preferred_campus, agree_updates)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        parentName,
        childName,
        parseInt(childAge, 10),
        assignedTrack || 'Summer Track',
        parentPhone,
        parentEmail,
        preferredCampus || 'Online / Virtual Campus',
        agreeUpdates !== false
      ]
    );

    // Also attempt Supabase sync if credentials exist
    if (supabase) {
      try {
        await supabase.from('summer_registrations').insert([
          { 
            parent_name: parentName, 
            child_name: childName, 
            child_age: parseInt(childAge, 10), 
            assigned_track: assignedTrack,
            parent_phone: parentPhone, 
            parent_email: parentEmail, 
            preferred_campus: preferredCampus || 'Online / Virtual Campus',
            agree_updates: agreeUpdates !== false,
            created_at: new Date()
          }
        ]);
      } catch (sbErr) {
        console.warn('[DB] Supabase secondary sync note:', sbErr.message);
      }
    }

    res.status(201).json({ 
      message: 'Summer registration successful', 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error saving summer registration:', error.message);
    res.status(500).json({ error: 'Failed to process summer registration: ' + error.message });
  }
});

// ==========================================
// ADMIN ENDPOINTS (To view registered users)
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

    const summerUsers = summerRows.map(r => ({
      id: `summer-${r.id}`,
      rawId: r.id,
      type: 'Summer Academy 2026',
      parentName: r.parent_name || r.parentName || '',
      childName: r.child_name || r.childName || '',
      childAge: r.child_age || r.childAge || '',
      program: r.assigned_track || r.assignedTrack || 'Summer Track',
      phone: r.parent_phone || r.parentPhone || '',
      email: r.parent_email || r.parentEmail || '',
      campus: r.preferred_campus || r.preferredCampus || 'Online / Virtual Campus',
      agreeUpdates: r.agree_updates !== false,
      createdAt: r.created_at || new Date().toISOString()
    }));

    const generalUsers = generalRows.map(r => ({
      id: `general-${r.id}`,
      rawId: r.id,
      type: 'General Program',
      parentName: r.parent_name || r.parentName || '',
      childName: r.child_name || r.childName || '',
      childAge: r.child_age || r.childAge || '',
      program: r.course || 'General Course',
      phone: r.parent_phone || r.parentPhone || '',
      email: r.parent_email || r.parentEmail || '',
      campus: r.learning_mode || r.learningMode || 'Online',
      agreeUpdates: true,
      createdAt: r.created_at || new Date().toISOString()
    }));

    const allUsers = [...summerUsers, ...generalUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({
      stats: {
        total: allUsers.length,
        summerCount: summerUsers.length,
        generalCount: generalUsers.length,
      },
      users: allUsers,
      summerRegistrations: summerUsers,
      generalEnrollments: generalUsers
    });
  } catch (error) {
    console.error('Admin API error:', error.message);
    return res.json({
      stats: { total: 0, summerCount: 0, generalCount: 0 },
      users: [],
      summerRegistrations: [],
      generalEnrollments: [],
      warning: error.message
    });
  }
});

// Get Summer Registrations Only
app.get('/api/admin/summer-registrations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM summer_registrations ORDER BY created_at DESC');
    res.json({ count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get General Enrollments Only
app.get('/api/admin/enrollments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enrollments ORDER BY created_at DESC');
    res.json({ count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
