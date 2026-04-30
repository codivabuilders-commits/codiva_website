'use client';

import React, { useState } from 'react';
import styles from './EnrollmentForm.module.css';

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentForm({ isOpen, onClose }: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    course: '',
    learningMode: 'Online'
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:5000/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        // Reset form after 3 seconds and close
        setTimeout(() => {
          setStatus('idle');
          setFormData({
            childName: '',
            childAge: '',
            parentName: '',
            parentEmail: '',
            parentPhone: '',
            course: '',
            learningMode: 'Online'
          });
          onClose();
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        
        {status === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.title}>Enrollment Sent!</h2>
            <p className={styles.subtitle}>
              Thank you for choosing Codiva Builders. We will contact you shortly with more details.
            </p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Enroll Your Child</h2>
            <p className={styles.subtitle}>Fill in the details below to start the journey.</p>
            
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Child's Full Name</label>
                  <input 
                    type="text" 
                    name="childName" 
                    required 
                    className={styles.input} 
                    placeholder="e.g. John Doe"
                    value={formData.childName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Child's Age</label>
                  <input 
                    type="number" 
                    name="childAge" 
                    required 
                    className={styles.input} 
                    placeholder="e.g. 8"
                    value={formData.childAge}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Parent/Guardian Name</label>
                <input 
                  type="text" 
                  name="parentName" 
                  required 
                  className={styles.input} 
                  placeholder="e.g. Mary Doe"
                  value={formData.parentName}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Parent's Email</label>
                  <input 
                    type="email" 
                    name="parentEmail" 
                    required 
                    className={styles.input} 
                    placeholder="parent@example.com"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input 
                    type="tel" 
                    name="parentPhone" 
                    required 
                    className={styles.input} 
                    placeholder="+234..."
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Select Course</label>
                <select 
                  name="course" 
                  required 
                  className={styles.select}
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Choose a Program</option>
                  <option value="Scratch Coding">Scratch Coding (Ages 5-8)</option>
                  <option value="Web Development">Web Development (Ages 9-12)</option>
                  <option value="Python Programming">Python Programming (Ages 13-17)</option>
                  <option value="Graphic Design">Graphic Design (All Ages)</option>
                  <option value="AI for Kids">AI for Kids (All Ages)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Learning Mode</label>
                <select 
                  name="learningMode" 
                  required 
                  className={styles.select}
                  value={formData.learningMode}
                  onChange={handleChange}
                >
                  <option value="Online">Online</option>
                  <option value="Physical">Physical (Lagos)</option>
                </select>
              </div>

              {status === 'error' && (
                <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.875rem' }}>
                  Something went wrong. Please try again.
                </p>
              )}

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Processing...' : 'Complete Enrollment'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
