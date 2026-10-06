-- ============================================================================
-- SQLITE RELATIONAL DATABASE SCHEMA: Abinesh S Portfolio & Analytics System
-- Academic Mini-Project: Full-Stack Data Analyst Portfolio & Telemetry Hub
-- ============================================================================

-- Drop tables if re-initializing
DROP TABLE IF EXISTS visitor_events;
DROP TABLE IF EXISTS visitor_analytics;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS admin_users;

-- 1. Skills Constellation Table
CREATE TABLE skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    level_percent INTEGER NOT NULL,
    icon TEXT NOT NULL,
    badge TEXT NOT NULL,
    highlight TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 2. Projects Showcase Table (Relational with JSON payloads for metrics and features)
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category_badge TEXT NOT NULL,
    status_label TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT NOT NULL,             -- JSON array or comma-separated list
    metrics_json TEXT NOT NULL,     -- JSON key-value pairs for KPI cards
    features_json TEXT NOT NULL,    -- JSON array of key architectural features
    github_url TEXT,
    demo_url TEXT,
    display_order INTEGER DEFAULT 0
);

-- 3. Certificates & Accreditations Table
CREATE TABLE certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credential_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_year TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL,
    skills_covered TEXT NOT NULL,
    verification_status TEXT DEFAULT 'Verified & Active',
    display_order INTEGER DEFAULT 0
);

-- 4. Education & Academic Trajectory Table
CREATE TABLE education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT NOT NULL,
    period TEXT NOT NULL,
    badge TEXT NOT NULL,
    highlights TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 5. Linguistic Proficiency Table
CREATE TABLE languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    proficiency_percent INTEGER NOT NULL,
    level_label TEXT NOT NULL,
    icon TEXT NOT NULL,
    color_gradient TEXT NOT NULL
);

-- 6. Secure Contact & Inquiries Table
CREATE TABLE contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread'
);

-- 7. Visitor Telemetry & Session Analytics Table (Data Analyst Hub)
CREATE TABLE visitor_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    browser TEXT,
    os TEXT,
    device_type TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    timezone TEXT,
    referrer TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    max_scroll_depth INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Granular Visitor Interaction Events Table (Clickstreams)
CREATE TABLE visitor_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,       -- 'project_click', 'modal_open', 'cta_click', 'cert_inspect'
    event_target TEXT NOT NULL,     -- Target identifier e.g. 'dynamic-pricing-engine'
    metadata TEXT,                  -- Optional JSON details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Admin Credentials Table (Secure password hashing)
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA INSERTIONS
-- ============================================================================

-- 1. Insert Skills Galaxy
INSERT INTO skills (name, category, level_percent, icon, badge, highlight, description, display_order) VALUES
('Python', 'Programming & Machine Learning', 95, 'fab fa-python', 'Core Engine', 'Pandas, NumPy, Scikit-Learn, Streamlit', 'Data cleansing, statistical hypothesis testing, synthetic data generation, and automated ETL pipelines.', 1),
('SQL', 'Database & Relational Logic', 92, 'fas fa-database', 'Relational Logic', 'PostgreSQL, MySQL, SQLite, 3NF Normalization', 'Complex subqueries, window functions, CTEs, schema normalization, indexing, and high-performance querying.', 2),
('Excel', 'Spreadsheet Analytics', 90, 'fas fa-file-excel', 'Financial & Operational', 'Power Query, Pivot Tables, Advanced Modeling', 'Power Query automation, nested conditional logic, dynamic array formulas, and executive KPI trackers.', 3),
('PowerBI', 'Data Visualization & BI', 88, 'fas fa-chart-pie', 'Enterprise BI', 'DAX Measures, Interactive Dashboards, Star Schema', 'DAX measures, star schema dimensional modeling, interactive drill-downs, and automated scheduled reports.', 4),
('Business Statistics', 'Mathematical Foundations', 94, 'fas fa-square-root-variable', 'Decision Science', 'Hypothesis Testing, Regression, Inferential Stats', 'Hypothesis testing (t-tests, ANOVA, Chi-Square), linear/logistic regression, probability distributions, and A/B test validation.', 5);

-- 2. Insert Flagship Projects
INSERT INTO projects (id, title, subtitle, category_badge, status_label, description, tags, metrics_json, features_json, github_url, demo_url, display_order) VALUES
(
    'dynamic-pricing-engine',
    'Dynamic Pricing Engine',
    'Real-Time Demand Elasticity & Inventory Optimization',
    'Machine Learning & Streamlit',
    'Streaming Ready',
    'A machine learning-powered Streamlit dashboard that simulates real-time dynamic product pricing based on live inventory levels, competitor pricing, and market demand fluctuations. Demonstrates the end-to-end lifecycle of a machine learning model, from synthetic data generation and training to deployment in a "live" streaming environment.',
    '["Python", "Streamlit", "Scikit-Learn", "Synthetic Data", "Poisson Simulation", "Gradient Boosting"]',
    '{"Revenue Uplift": "+18.4%", "Latency": "< 45ms", "Model Engine": "GBDT Regressor", "Records": "50,000+ Orders"}',
    '["Live synthetic market stream simulation with dynamic Poisson demand bursts", "Elasticity-driven pricing model balancing margin vs conversion probability", "Automated model retraining triggers on market drift", "Interactive sensitivity testing slider console with real-time profit estimation"]',
    'https://github.com',
    '#',
    1
),
(
    'institutional-health-clinic',
    'Institutional Health Clinic',
    'Full Lifecycle Healthcare Informatics & Analytics',
    'Full-Stack & Clinical Data Lifecycle',
    'REST API Active',
    'An end-to-end data analytics and full-stack web project simulating a student health clinic''s operational dashboard. Handles the entire data lifecycle: generating realistic mock data, cleaning inconsistencies with Pandas, structuring a relational SQLite database, building a RESTful API with Flask, and visualizing metrics via an interactive JavaScript/Chart.js frontend.',
    '["Pandas", "SQLite (3NF)", "Flask REST API", "JavaScript", "Chart.js", "Healthcare Informatics"]',
    '{"Cleaned Data": "12,500+ Patients", "API Latency": "18ms Avg", "Schema": "3NF Relational", "Visuals": "5 Dashboards"}',
    '["End-to-end ETL: Raw anomaly ingestion -> Pandas imputation & normalization -> SQLite relational store", "Secure RESTful endpoint architecture serving real-time patient throughput and pharmacy inventories", "Dynamic interactive charts tracking peak admission hours, diagnosis trends, and prescription fulfillment", "Operational KPIs alerting clinical staff to triage bottlenecks"]',
    'https://github.com',
    '#',
    2
);

-- 3. Insert Certificates
INSERT INTO certificates (credential_id, title, issuer, issue_year, category, icon, skills_covered, verification_status, display_order) VALUES
('CERT-PY-88219', 'Advanced Data Analytics with Python', 'Professional Certification Program', '2024', 'Python & Machine Learning', 'fab fa-python', 'Pandas, NumPy, Predictive Scikit-Learn Pipelines', 'Verified & Active', 1),
('CERT-SQL-40912', 'SQL for Data Science & Relational Modeling', 'Database Engineering Institute', '2024', 'Database & Query Optimization', 'fas fa-database', 'Window Functions, 3NF Schema & Query Optimization', 'Verified & Active', 2),
('CERT-PBI-19504', 'PowerBI & Business Intelligence Specialist', 'Enterprise Analytics Council', '2023', 'BI & Dashboard Architecture', 'fas fa-chart-pie', 'DAX Calculations, Star Schemas & KPI Reports', 'Verified & Active', 3),
('CERT-STAT-61023', 'Applied Statistical Foundations for Decision Making', 'Mathematics & Statistics Academy', '2023', 'Decision Science & Inference', 'fas fa-square-root-variable', 'Hypothesis Testing, Regression & Probability', 'Verified & Active', 4);

-- 4. Insert Education Timeline
INSERT INTO education (degree, institution, location, period, badge, highlights, display_order) VALUES
('Bachelor of Engineering in Computer Science & Engineering (BE CSE)', 'PACET (P.A. College of Engineering and Technology)', 'Pollachi, Tamil Nadu', '2023 - 2027', 'Current Degree (III Year)', 'Immersed in Database Management Systems (DBMS), Machine Learning architectures, Algorithm Design, and Applied Analytics. Actively transforming computational logic into data analysis workflows and business intelligence applications.', 1),
('Higher Secondary Certificate (HSC)', 'HILLFORT Matric Hr Sec School', 'Kotagiri, The Nilgiris', 'Completed', 'Higher Secondary (Class XII)', 'Graduated with deep foundations in Mathematics, Physics, and Analytical Thinking. Developed an early passion for algorithms, statistical distributions, and structured problem modeling.', 2),
('Secondary School Leaving Certificate (SSLC)', 'Nanjanadu Government Hr Sec School', 'Nanjanadu, The Nilgiris', 'Completed', 'Secondary Education (Class X)', 'Built an exceptional academic record grounded in disciplined scientific curiosity, foundational arithmetic, and leadership in regional academic programs.', 3);

-- 5. Insert Languages
INSERT INTO languages (name, proficiency_percent, level_label, icon, color_gradient) VALUES
('Tamil', 100, 'Native / Bilingual', 'fas fa-globe-asia', 'from-cyan-400 to-blue-500'),
('English', 92, 'Professional Working', 'fas fa-globe', 'from-purple-400 to-pink-500');

-- 6. Insert Mock Initial Telemetry (To seed the Data Analyst Dashboard with realistic data)
INSERT INTO visitor_analytics (session_id, ip_address, user_agent, browser, os, device_type, city, region, country, timezone, referrer, time_spent_seconds, max_scroll_depth, created_at) VALUES
('sess_demo_01', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Chrome', 'Windows', 'Desktop', 'Coimbatore', 'Tamil Nadu', 'India', 'Asia/Kolkata', 'Direct', 142, 95, datetime('now', '-3 days')),
('sess_demo_02', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Safari', 'macOS', 'Desktop', 'Chennai', 'Tamil Nadu', 'India', 'Asia/Kolkata', 'LinkedIn', 210, 100, datetime('now', '-2 days')),
('sess_demo_03', '127.0.0.1', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5)', 'Safari Mobile', 'iOS', 'Mobile', 'Bengaluru', 'Karnataka', 'India', 'Asia/Kolkata', 'GitHub', 88, 70, datetime('now', '-1 days')),
('sess_demo_04', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Firefox', 'Windows', 'Desktop', 'Pollachi', 'Tamil Nadu', 'India', 'Asia/Kolkata', 'Direct', 315, 100, datetime('now', '-6 hours')),
('sess_demo_05', '127.0.0.1', 'Mozilla/5.0 (Linux; Android 13)', 'Chrome Mobile', 'Android', 'Mobile', 'Ooty', 'Tamil Nadu', 'India', 'Asia/Kolkata', 'Direct', 94, 60, datetime('now', '-1 hours'));

-- 7. Insert Mock Visitor Interaction Events
INSERT INTO visitor_events (session_id, event_type, event_target, metadata, created_at) VALUES
('sess_demo_01', 'project_click', 'dynamic-pricing-engine', '{"action":"open_simulation"}', datetime('now', '-3 days')),
('sess_demo_02', 'project_click', 'institutional-health-clinic', '{"action":"inspect_architecture"}', datetime('now', '-2 days')),
('sess_demo_02', 'cert_inspect', 'CERT-PY-88219', '{"action":"verify"}', datetime('now', '-2 days')),
('sess_demo_04', 'project_click', 'dynamic-pricing-engine', '{"action":"slider_move"}', datetime('now', '-6 hours')),
('sess_demo_04', 'contact_submit', 'contact_form', '{"subject":"Data Analyst Role"}', datetime('now', '-6 hours'));

-- 8. Insert Default Mock Contact Message
INSERT INTO contact_messages (name, email, subject, message, ip_address, created_at, status) VALUES
('Campus Talent Acquisition', 'recruiter@analytics-firm.com', 'Data Analyst Internship Opportunity', 'Hello Abinesh, we reviewed your Dynamic Pricing Engine and Institutional Health Clinic projects. We would love to discuss an analyst internship role.', '127.0.0.1', datetime('now', '-6 hours'), 'unread');

-- 9. Admin User (Default: username = "admin", password = "antigravity2024" or pbkdf2 hash)
-- Hashed using werkzeug.security.generate_password_hash('antigravity2024')
-- Will be configured in init_db.py as well
