-- ============================================================
-- Phase 2 — Step 3: Seed data (Ha Minh Nghia)
-- Run AFTER 01_create_tables.sql and 02_rls.sql
-- ============================================================

-- ------------------------------------------------------------
-- profile
-- ------------------------------------------------------------
insert into public.profile (name, title, bio, email, github_url, linkedin_url, location)
values (
  'Ha Minh Nghia',
  'Data Analyst | Data Science Graduate',
  'Data Science graduate (QUT Brisbane) with a background in IoT engineering from FPT University. ' ||
  'Passionate about turning raw data into actionable insights using Python, SQL, Power BI, and Tableau. ' ||
  'Multilingual (Vietnamese, English, Japanese) with hands-on experience in fast-paced, customer-facing environments.',
  'nghia03072002@gmail.com',
  'https://github.com/hmn3702',
  null,   -- add your LinkedIn URL here: 'https://linkedin.com/in/YOUR_HANDLE'
  'Brisbane, QLD, Australia'
);

-- ------------------------------------------------------------
-- education  (most recent first)
-- ------------------------------------------------------------
insert into public.education (institution, degree, field, start_year, end_year, description)
values
  (
    'Queensland University of Technology',
    'Master of Information Technology',
    'Data Science',
    2024,
    2026,
    'Specialising in data science, machine learning, and advanced analytics. Expected graduation 2026.'
  ),
  (
    'FPT University',
    'Bachelor of Information Technology',
    'Internet of Things (IoT)',
    2020,
    2024,
    'Studied embedded systems, IoT protocols (MQTT, CoAP), wireless communications, and software development.'
  );

-- ------------------------------------------------------------
-- experience  (most recent first, order = 1 is top)
-- ------------------------------------------------------------
insert into public.experience (role, company, location, start_date, end_date, is_current, description, "order")
values
  (
    'Bartender',
    'Coffee Stories',
    'Toowong, QLD',
    '2025-09-01',
    null,
    true,
    'Serve customers coffee and beverages, ensuring satisfaction and a welcoming atmosphere. ' ||
    'Manage cash and card transactions with accuracy during busy periods. ' ||
    'Collaborate with the team to ensure smooth daily operations.',
    1
  ),
  (
    'Food Waiter & Cashier',
    'Le''s Kitchen Viet Cuisine',
    'Fortitude Valley, QLD',
    '2025-04-01',
    '2026-01-01',
    false,
    'Greeted customers and ensured a warm dining experience in a fast-paced environment. ' ||
    'Accurately took and processed orders; handled cash, card, and digital payments via POS. ' ||
    'Assisted kitchen operations during peak hours and maintained food safety standards.',
    2
  ),
  (
    'Food Waiter',
    'Yoshinoya',
    'Vietnam',
    '2023-01-01',
    '2024-01-01',
    false,
    'Delivered high-quality customer service to 200+ guests daily, maintaining a 95% positive feedback rate. ' ||
    'Supported kitchen staff during busy periods to maintain seamless operations.',
    3
  ),
  (
    'Kitchen Hand',
    'Chay Tam An Lac',
    'Vietnam',
    '2021-01-01',
    '2023-01-01',
    false,
    'Assisted in preparing 100+ dishes daily, adhering to strict hygiene and safety standards. ' ||
    'Cleaned and maintained kitchen equipment to ensure safety and efficiency.',
    4
  );

-- ------------------------------------------------------------
-- skills
-- ------------------------------------------------------------
insert into public.skills (name, category, level, "order")
values
  -- Data & Analysis
  ('Python',      'Data & Analysis', 'advanced',      1),
  ('R',           'Data & Analysis', 'intermediate',  2),
  ('SQL',         'Data & Analysis', 'advanced',      3),
  ('Pandas',      'Data & Analysis', 'advanced',      4),
  ('Excel',       'Data & Analysis', 'advanced',      5),
  -- Visualisation
  ('Power BI',    'Visualisation',   'advanced',      1),
  ('Tableau',     'Visualisation',   'advanced',      2),
  ('Matplotlib',  'Visualisation',   'intermediate',  3),
  -- Databases
  ('MySQL',       'Databases',       'advanced',      1),
  ('PostgreSQL',  'Databases',       'intermediate',  2),
  ('MongoDB',     'Databases',       'intermediate',  3),
  ('SQL Server',  'Databases',       'intermediate',  4),
  -- Web & DevOps
  ('Next.js',     'Web & DevOps',    'intermediate',  1),
  ('TypeScript',  'Web & DevOps',    'intermediate',  2),
  ('HTML / CSS',  'Web & DevOps',    'advanced',      3),
  ('Git / GitHub','Web & DevOps',    'advanced',      4),
  -- Cloud
  ('AWS',         'Cloud',           'beginner',      1),
  ('Azure',       'Cloud',           'beginner',      2),
  -- IoT & Embedded
  ('Arduino (C)', 'IoT & Embedded',  'advanced',      1),
  ('ESP32/8266',  'IoT & Embedded',  'advanced',      2),
  ('MQTT',        'IoT & Embedded',  'advanced',      3),
  ('FreeRTOS',    'IoT & Embedded',  'intermediate',  4);

-- ------------------------------------------------------------
-- certifications
-- ------------------------------------------------------------
insert into public.certifications (name, issuer, year, credential_url)
values
  ('Google Data Analytics Professional Certificate',       'Google / Coursera',  2024, null),
  ('Microsoft Power BI Data Analyst Professional Certificate', 'Microsoft / Coursera', 2024, null),
  ('Tableau Business Intelligence Analyst Professional Certificate', 'Tableau / Coursera', 2024, null),
  ('IBM Business Intelligence (BI) Analyst Professional Certificate', 'IBM / Coursera',  2024, null),
  ('Google Cybersecurity Professional Certificate',        'Google / Coursera',  2024, null),
  ('Google Cloud Cybersecurity Professional Certificate',  'Google / Coursera',  2024, null),
  ('Google Project Management Professional Certificate',   'Google / Coursera',  2024, null),
  ('Modern Application Development with Java on AWS',      'AWS / Coursera',     2024, null),
  ('Emerging Technologies: From Smartphones to IoT to Big Data', 'Coursera',     2023, null),
  ('Software Development Lifecycle',                       'Coursera',           2023, null),
  ('Computer Communications',                              'Coursera',           2023, null),
  ('CertNexus Certified Ethical Emerging Technologist',    'CertNexus',          2024, null),
  ('FPT Software Academy Embedded Course Certificate',     'FPT Software',       2024, null);

-- ------------------------------------------------------------
-- projects  (add your own — placeholder row so page doesn't show empty)
-- ------------------------------------------------------------
-- Uncomment and fill in when you have projects to add:
--
-- insert into public.projects (title, description, tech_stack, live_url, github_url, featured, "order")
-- values
--   (
--     'My Project Title',
--     'Brief description of what you built and why.',
--     array['Python', 'SQL', 'Power BI'],
--     null,
--     'https://github.com/hmn3702/project-repo',
--     true,
--     1
--   );
