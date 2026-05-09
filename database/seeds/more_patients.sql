-- Extended Realistic Patient Data Seed
-- This adds more patients and their respective medical histories

-- 1. Insert More Patients (ID will start from 9)
INSERT INTO patients (full_name, age, gender, contact_phone, contact_email, occupation, address, lifestyle_habits)
VALUES 
('Meera Nair', 65, 'Female', '+91 9876543218', 'meera.n@example.com', 'Retired Bank Manager', 'Kochi, Kerala', 'Vegetarian, walks daily, history of osteoarthritis'),
('Arjun Malhotra', 12, 'Male', '+91 9876543219', 'malhotra.a@example.com', 'Student', 'Gurgaon, Haryana', 'Prone to seasonal allergies, enjoys swimming'),
('Zoya Khan', 34, 'Female', '+91 9876543220', 'zoya.k@example.com', 'Graphic Designer', 'Bandra, Mumbai', 'Frequent migraines, late-night worker, caffeine dependent'),
('Karan Verma', 42, 'Male', '+91 9876543221', 'karan.v@example.com', 'Chef', 'Indira Nagar, Lucknow', 'Standing for long hours, varicose veins issues, gourmet diet'),
('Saritha Hegde', 28, 'Female', '+91 9876543222', 'saritha.h@example.com', 'Nurse', 'Manipal, Karnataka', 'Irregular shifts, PCOS symptoms, highly active'),
('Gurpreet Singh', 50, 'Male', '+91 9876543223', 'gurpreet.s@example.com', 'Farmer', 'Ludhiana, Punjab', 'Exposed to pesticides, chronic back pain, heavy lifting'),
('Deepak Jha', 31, 'Male', '+91 9876543224', 'deepak.j@example.com', 'Delivery Partner', 'Rohini, Delhi', 'Dust exposure, constant biking, gastric issues'),
('Lakshmi Devi', 72, 'Female', '+91 9876543225', 'lakshmi.d@example.com', 'Homemaker', 'Mysuru, Karnataka', 'Elderly care, mild memory loss, diabetic');

-- 2. Insert Case Records (Consultations) for new patients
-- Case for Meera Nair (ID 9)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (9, CURRENT_TIMESTAMP - INTERVAL '3 days', 'Severe pain in knee joints, stiffness in the morning. Better with warm applications.', '["osteoarthritis", "joint pain", "stiffness"]', '5 years', 'Menopause at 50, history of calcium deficiency.', 'Mother had rheumatoid arthritis.', 'Osteoarthritis of Knees', 'Rhus Tox 200C - BD for 10 days', 1);

-- Case for Arjun Malhotra (ID 10)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (10, CURRENT_TIMESTAMP - INTERVAL '2 days', 'Allergic rhinitis, continuous sneezing with watery discharge. Worse in air conditioning.', '["allergy", "sneezing", "rhinitis"]', '1 year', 'Recurrent tonsillitis.', 'Father has dust allergy.', 'Allergic Rhinitis', 'Allium Cepa 30C - 3 times a day for 5 days', 1);

-- Case for Zoya Khan (ID 11)
INSERT INTO case_records (patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, past_history, family_history, diagnosis, treatment_plan, created_by)
VALUES (11, CURRENT_TIMESTAMP - INTERVAL '1 day', 'Throbbing headache on right side. Triggered by loud noise and bright light.', '["migraine", "headache", "sensitivity"]', '3 years', 'Irregular menstrual cycles.', 'Sister has similar migraine issues.', 'Right-sided Migraine', 'Belladonna 200C - SOS during episodes', 1);

-- 3. Insert Vitals for these new Case Records
-- Vitals for Meera (Record ID 4)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (4, 138, 88, 68, 36.5, 68.0, 155);

-- Vitals for Arjun (Record ID 5)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (5, 110, 70, 82, 37.2, 42.5, 148);

-- Vitals for Zoya (Record ID 6)
INSERT INTO vitals (case_record_id, blood_pressure_systolic, blood_pressure_diastolic, pulse_rate, temperature, weight, height)
VALUES (6, 115, 75, 76, 36.7, 58.0, 160);

-- 4. Insert Prescriptions for new patients
-- Prescription for Meera
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (4, 9, 1, 'Rhus Tox', '200C', '2 pills', 'BD', 'Dissolve in mouth, do not touch with hands', CURRENT_DATE - 3, CURRENT_DATE + 12);

-- Prescription for Arjun
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (5, 10, 1, 'Allium Cepa', '30C', '3 drops', 'TDS', 'Take 15 mins before food', CURRENT_DATE - 2, CURRENT_DATE + 5);

-- Prescription for Zoya
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date, follow_up_date)
VALUES (6, 11, 1, 'Belladonna', '200C', '5 pills', 'SOS', 'Take when pain starts, repeat every hour if severe', CURRENT_DATE - 1, CURRENT_DATE + 15);
