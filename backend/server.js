const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
  res.send('Codiva Builders API is running...');
});

// Enrollment Endpoint
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

    const { data, error } = await supabase
      .from('enrollments')
      .insert([
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

    if (error) throw error;

    res.status(201).json({ message: 'Enrollment successful', data });
  } catch (error) {
    console.error('Error saving enrollment:', error.message);
    res.status(500).json({ error: 'Failed to process enrollment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
