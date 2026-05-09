-- Third Round of Realistic Patient Data Seed
-- Adding 10 more patients and comprehensive clinical data for each

-- 1. Insert 10 More Patients (IDs 17-26)
INSERT INTO patients (full_name, age, gender, contact_phone, contact_email, occupation, address, lifestyle_habits)
VALUES 
('Harish Mehta', 48, 'Male', '+91 9876543226', 'harish.m@example.com', 'Accountant', 'Borivali, Mumbai', 'Prolonged sitting, drinks coffee frequently, prone to acidity'),
('Kavita Rao', 35, 'Female', '+91 9876543227', 'kavita.r@example.com', 'HR Executive', 'Whitefield, Bangalore', 'High stress, late dinners, history of thyroid issues'),
('Suresh Gopinath', 60, 'Male', '+91 9876543228', 'suresh.g@example.com', 'Post Office Clerk', 'Kottayam, Kerala', 'Smokes 5 cigarettes/day, chronic cough, regular walker'),
('Aditi Saxena', 22, 'Female', '+91 9876543229', 'aditi.s@example.com', 'Fashion Student', 'South Ex, Delhi', 'Skips meals, low water intake, painful menses'),
('Rahul Deshpande', 44, 'Male', '+91 9876543230', 'rahul.d@example.com', 'IT Manager', 'Baner, Pune', 'Eyes strain, neck pain from laptop use, occasional gym'),
('Fatima Bi', 55, 'Female', '+91 9876543231', 'fatima.b@example.com', 'Tailor', 'Charminar, Hyderabad', 'Strains eyes, varicose veins, likes sweets'),
('Akash Mishra', 27, 'Male', '+91 9876543232', 'akash.m@example.com', 'Civil Engineer', 'Patna, Bihar', 'Exposed to cement dust, frequent skin rashes'),
('Shanti Swaroop', 70, 'Male', '+91 9876543233', 'shanti.s@example.com', 'Retired Professor', 'Chandigarh', 'Prostate issues, frequent urination at night'),
('Megha Gupta', 33, 'Female', '+91 9876543234', 'megha.g@example.com', 'Bank Teller', 'Jaipur, Rajasthan', 'Standing for long hours, lower back ache, history of UTI'),
('Nitin Gadkari', 40, 'Male', '+91 9876543235', 'nitin.g@example.com', 'Transport Contractor', 'Nagpur, Maharashtra', 'Irregular sleep, roadside eating, obesity issues');

-- 2. Insert Consultations (Multiple for each new patient)
-- Consultations for Harish Mehta (Patient 17)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(7, 17, CURRENT_TIMESTAMP - INTERVAL '30 days', 'Acid reflux and burning in chest after meals.', '["acidity", "gerd"]', '1 month', 'Acid Peptic Disorder', 'Nux Vomica 30C - TDS', 1),
(8, 17, CURRENT_TIMESTAMP - INTERVAL '15 days', 'Acidity better, but now has flatulence and bloating.', '["bloating", "gas"]', '1 week', 'Flatulent Dyspepsia', 'Lycopodium 30C - BD', 1);

-- Consultations for Kavita Rao (Patient 18)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(9, 18, CURRENT_TIMESTAMP - INTERVAL '20 days', 'Feeling very tired, hair fall and weight gain.', '["fatigue", "hairfall"]', '3 months', 'Hypothyroidism suspected', 'Thyroidinum 3X - OD', 1),
(10, 18, CURRENT_TIMESTAMP - INTERVAL '5 days', 'Tiredness slightly better, but mood swings increased.', '["mood swings"]', '1 week', 'Hormonal Imbalance', 'Sepia 200C - Weekly', 1);

-- Consultations for Suresh Gopinath (Patient 19)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(11, 19, CURRENT_TIMESTAMP - INTERVAL '40 days', 'Chronic dry cough, worse at night.', '["cough", "chronic"]', '6 months', 'Smokers Cough', 'Bryonia 30C - TDS', 1),
(12, 19, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Cough is loose now, bringing up phlegm.', '["cough", "expectoration"]', '3 days', 'Resolving Bronchitis', 'Antim Tart 30C - TDS', 1);

-- Consultations for Aditi Saxena (Patient 20)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(13, 20, CURRENT_TIMESTAMP - INTERVAL '25 days', 'Severe pain during menses, needs to lie down.', '["dysmenorrhea", "pain"]', '2 years', 'Primary Dysmenorrhea', 'Mag Phos 6X - 4 tabs every 2 hours during pain', 1),
(14, 20, CURRENT_TIMESTAMP, 'General weakness after periods.', '["weakness", "anemia"]', '1 week', 'Post-menstrual weakness', 'China 30C - BD', 1);

-- Consultations for Rahul Deshpande (Patient 21)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(15, 21, CURRENT_TIMESTAMP - INTERVAL '12 days', 'Neck stiffness and radiation of pain to right arm.', '["cervical", "stiffness"]', '2 months', 'Cervical Spondylosis', 'Hypericum 200C - BD', 1),
(16, 21, CURRENT_TIMESTAMP, 'Stiffness reduced, but numbness in fingertips persists.', '["numbness"]', '5 days', 'Nerve Compression', 'Kalmia Lat 30C - TDS', 1);

-- Consultations for Fatima Bi (Patient 22)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(17, 22, CURRENT_TIMESTAMP - INTERVAL '18 days', 'Aching in legs, veins look bluish and swollen.', '["varicose veins", "leg pain"]', '4 years', 'Varicose Veins', 'Hamamelis 30C - TDS', 1),
(18, 22, CURRENT_TIMESTAMP - INTERVAL '2 days', 'Legs feel heavy in evening, itching over veins.', '["heaviness", "itching"]', '1 week', 'Venous Insufficiency', 'Pulsatilla 200C - Weekly', 1);

-- Consultations for Akash Mishra (Patient 23)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(19, 23, CURRENT_TIMESTAMP - INTERVAL '15 days', 'Red, itchy patches on elbows and knees.', '["skin", "itching", "rash"]', '3 weeks', 'Atopic Dermatitis', 'Sulphur 30C - OD', 1),
(20, 23, CURRENT_TIMESTAMP, 'Itching increased after remedy, skin feels burning.', '["aggravation", "burning"]', '2 days', 'Homeopathic Aggravation', 'Placebo - TDS', 1);

-- Consultations for Shanti Swaroop (Patient 24)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(21, 24, CURRENT_TIMESTAMP - INTERVAL '22 days', 'Frequent urge to urinate, slow stream.', '["prostate", "urinary"]', '1 year', 'Benign Prostatic Hyperplasia', 'Sabal Serrulata Q - 10 drops TDS', 1),
(22, 24, CURRENT_TIMESTAMP - INTERVAL '5 days', 'Urgency reduced, but still waking up 3 times at night.', '["nocturia"]', '1 week', 'BPH Monitoring', 'Conium Mac 200C - Weekly', 1);

-- Consultations for Megha Gupta (Patient 25)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(23, 25, CURRENT_TIMESTAMP - INTERVAL '28 days', 'Dull ache in lower back, worse after standing at bank.', '["backache", "fatigue"]', '6 months', 'Lumbar Strain', 'Aesculus Hip 30C - TDS', 1),
(24, 25, CURRENT_TIMESTAMP - INTERVAL '10 days', 'Backache better, but now has burning during urination.', '["uti", "burning"]', '2 days', 'Cystitis', 'Cantharis 30C - every 2 hours', 1);

-- Consultations for Nitin Gadkari (Patient 26)
INSERT INTO case_records (id, patient_id, consultation_date, chief_complaints, complaint_tags, complaint_duration, diagnosis, treatment_plan, created_by) VALUES
(25, 26, CURRENT_TIMESTAMP - INTERVAL '20 days', 'Shortness of breath on walking, snoring at night.', '["obesity", "dyspnea"]', '1 year', 'Obesity / Sleep Apnea suspected', 'Calcarea Carb 200C - Weekly', 1),
(26, 26, CURRENT_TIMESTAMP - INTERVAL '7 days', 'Energy levels improving, Snoring reduced.', '["improvement"]', '1 week', 'Weight Management', 'Phytolacca Berry Q - 15 drops before meals', 1);

-- 3. Insert Prescriptions (Matching the consultations)
-- Harish Mehta
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(7, 17, 1, 'Nux Vomica', '30C', '3 drops', 'TDS', 'Before meals', CURRENT_DATE - 30),
(8, 17, 1, 'Lycopodium', '30C', '3 drops', 'BD', 'After meals', CURRENT_DATE - 15);

-- Kavita Rao
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(9, 18, 1, 'Thyroidinum', '3X', '2 tabs', 'OD', 'Morning empty stomach', CURRENT_DATE - 20),
(10, 18, 1, 'Sepia', '200C', '2 pills', 'Weekly', 'Sunday morning', CURRENT_DATE - 5);

-- Suresh Gopinath
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(11, 19, 1, 'Bryonia', '30C', '3 drops', 'TDS', 'In warm water', CURRENT_DATE - 40),
(12, 19, 1, 'Antim Tart', '30C', '3 drops', 'TDS', 'When cough is loose', CURRENT_DATE - 10);

-- Aditi Saxena
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(13, 20, 1, 'Mag Phos', '6X', '4 tabs', 'QDS', 'Dissolve in hot water', CURRENT_DATE - 25),
(14, 20, 1, 'China', '30C', '3 drops', 'BD', 'For 10 days', CURRENT_DATE);

-- Rahul Deshpande
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(15, 21, 1, 'Hypericum', '200C', '3 drops', 'BD', 'For nerve pain', CURRENT_DATE - 12),
(16, 21, 1, 'Kalmia Lat', '30C', '3 drops', 'TDS', 'Focus on numbness', CURRENT_DATE);

-- Fatima Bi
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(17, 22, 1, 'Hamamelis', '30C', '3 drops', 'TDS', 'Do not massage legs', CURRENT_DATE - 18),
(18, 22, 1, 'Pulsatilla', '200C', '2 pills', 'Weekly', 'Avoid spicy food', CURRENT_DATE - 2);

-- Akash Mishra
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(19, 23, 1, 'Sulphur', '30C', '2 pills', 'OD', 'Early morning', CURRENT_DATE - 15),
(20, 23, 1, 'Placebo', '30C', '3 drops', 'TDS', 'Wait for reaction to settle', CURRENT_DATE);

-- Shanti Swaroop
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(21, 24, 1, 'Sabal Serrulata', 'Q', '10 drops', 'TDS', 'In half cup water', CURRENT_DATE - 22),
(22, 24, 1, 'Conium Mac', '200C', '2 pills', 'Weekly', 'Night time', CURRENT_DATE - 5);

-- Megha Gupta
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(23, 25, 1, 'Aesculus Hip', '30C', '3 drops', 'TDS', 'After work', CURRENT_DATE - 28),
(24, 25, 1, 'Cantharis', '30C', '3 drops', '2 hourly', 'During acute burning', CURRENT_DATE - 10);

-- Nitin Gadkari
INSERT INTO prescriptions (case_record_id, patient_id, prescribed_by, remedy_name, potency, dosage, repetition, instructions, prescription_date) VALUES
(25, 26, 1, 'Calcarea Carb', '200C', '2 pills', 'Weekly', 'Morning', CURRENT_DATE - 20),
(26, 26, 1, 'Phytolacca Berry', 'Q', '15 drops', 'TDS', 'Before meals', CURRENT_DATE - 7);
