-- Realistic Patient Data Seed
-- Clean existing data first (optional, but good for idempotent seeds)
TRUNCATE patients, case_records, vitals, prescriptions RESTART IDENTITY CASCADE;

-- 1. Insert Patients
INSERT INTO patients (full_name, age, gender, contact_phone, contact_email, occupation, address, lifestyle_habits)
VALUES 
('Rajesh Kumar', 45, 'Male', '+91 9876543210', 'rajesh.k@example.com', 'Software Engineer', 'HSR Layout, Bangalore', 'Sedentary lifestyle, occasional smoker, loves spicy food'),
('Priya Sharma', 32, 'Female', '+91 9876543211', 'priya.s@example.com', 'Teacher', 'Vasant Kunj, Delhi', 'Vegetarian, regular yoga practitioner'),
('Amit Patel', 58, 'Male', '+91 9876543212', 'amit.p@example.com', 'Business Owner', 'Andheri West, Mumbai', 'High stress, irregular eating habits, hypertensive'),
('Sneha Reddy', 24, 'Female', '+91 9876543213', 'sneha.r@example.com', 'Student', 'Banjara Hills, Hyderabad', 'Active, likes outdoor sports, irregular sleep during exams'),
('Mohammed Ali', 10, 'Male', '+91 9876543214', 'ali.m@example.com', 'Student', 'T Nagar, Chennai', 'Likes sweets, prone to catching cold in winter'),
('Sunita Deshmukh', 52, 'Female', '+91 9876543215', 'sunita.d@example.com', 'Homemaker', 'Shivaji Nagar, Pune', 'Chronic knee pain, prefers home remedies'),
('Vikram Singh', 38, 'Male', '+91 9876543216', 'vikram.s@example.com', 'Sales Manager', 'Salt Lake, Kolkata', 'Frequent travel, irregular diet, chronic acidity'),
('Ananya Iyer', 29, 'Female', '+91 9876543217', 'ananya.i@example.com', 'Artist', 'Adyar, Chennai', 'Anxiety issues, allergic rhinitis in morning');

-- 2. Insert Case Records (Consultations)
-- Case for Rajesh Kumar (ID 1)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (1, CURRENT_TIMESTAMP - INTERVAL '15 days', 'Chronic Sinusitis with severe frontal headache. Worse in morning and damp weather.', '["sinusitis", "headache", "chronic"]', '2 years', 'Had recurrent pneumonia as a child.', 'Father has asthma.', 'Chronic Frontal Sinusitis', 'Constitutional treatment started.', 1);

-- Case for Priya Sharma (ID 2)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (2, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Eczema on both hands. Redness, itching, and dry scales. Worse after using detergents.', '["eczema", "skin", "itching"]', '6 months', 'Allergy to dust.', 'Mother has psoriasis.', 'Contact Dermatitis (Eczema)', 'Local application avoided, internal remedy prescribed.', 1);

-- Case for Amit Patel (ID 3)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (3, CURRENT_TIMESTAMP - INTERVAL '5 days', 'High Blood Pressure (160/100). Frequent dizziness and palpitations after stress.', '["hypertension", "palpitations", "dizziness"]', '3 months', 'History of high cholesterol.', 'Strong family history of cardiac issues.', 'Essential Hypertension', 'Stress management and diet advice given along with remedy.', 1);

-- 3. Insert Vitals for these Case Records
-- Vitals for Rajesh's Case (Record ID 1)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (1, 120, 80, 72, 36.6, 75.5, 175);

-- Vitals for Priya's Case (Record ID 2)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (2, 110, 70, 78, 36.8, 62.0, 162);

-- Vitals for Amit's Case (Record ID 3)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (3, 160, 100, 88, 37.0, 88.5, 170);

-- 4. Insert Prescriptions
-- Prescription for Rajesh
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (1, 1, 1, 'Arsenicum Album', '30C', '3 drops', 'TDS', 'Take in half cup of water, 30 mins before meals', CURRENT_DATE - 15, CURRENT_DATE + 15);

-- Prescription for Priya
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (2, 2, 1, 'Graphites', '200C', '2 pills', 'Once daily', 'Empty stomach in the morning', CURRENT_DATE - 10, CURRENT_DATE + 20);

-- Prescription for Amit
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (3, 3, 1, 'Nux Vomica', '200C', '3 drops', 'Night', 'Before sleeping, avoid coffee and raw onions', CURRENT_DATE - 5, CURRENT_DATE + 10);
