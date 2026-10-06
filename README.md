# 🌌 Antigravity Data Analyst Portfolio & Telemetry Hub
### Academic Mini-Project: Full-Stack Web Application for Abinesh S
**BE CSE III Year @ PACET (P.A. College of Engineering and Technology, Pollachi)**

---

## 🎯 Project Overview
This project transforms a personal portfolio into a **complete full-stack academic mini-project web application** powered by:
- **Backend**: Python (Flask RESTful API Architecture)
- **Database**: Relational SQLite (`portfolio.db`) with 3NF-compliant schema (`schema.sql`)
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript, HTML5 Canvas Particle Engine, FontAwesome 6, Google Fonts
- **Visual Analytics**: Interactive **Chart.js** telemetry dashboard on a hidden, password-protected admin route
- **Theme**: Futuristic **Antigravity & Glassmorphism** design system with 3D tilt hover animations, zero-gravity float keyframes, and neon accents.

---

## 🏗️ Relational SQLite Database Architecture (`schema.sql`)

The application is completely database-driven (**no hardcoded skills, projects, or certificates** in the HTML).

| Table | Description |
|---|---|
| `skills` | Constellation of analytical skills (Python, SQL, Excel, PowerBI, Business Statistics) with mastery %, icons, category, and display order. |
| `projects` | Flagship data analytics projects with JSON tags, architectural feature lists, and performance KPI metrics. |
| `certificates` | Document verification frames with credential IDs, issuing bodies, and skill coverage. |
| `education` | Academic trajectory entries (PACET BE CSE, HILLFORT HSC, Nanjanadu SSLC). |
| `languages` | Linguistic spectrum entries (Tamil, English) with fluency metrics and gradient definitions. |
| `contact_messages` | Inbound communication records (name, email, subject, sanitized message, IP address, user agent, timestamp, read/unread status). |
| `visitor_analytics` | Anonymous visitor engagement telemetry (session ID, time spent, max scroll depth, location, browser, OS, device). |
| `visitor_events` | Granular clickstream logs (project card clicks, modal triggers, button interactions). |
| `admin_users` | Secure hashed admin credentials using Werkzeug PBKDF2 cryptography. |

---

## 🔌 Flask REST API Endpoints (`app.py`)

### 1. Dynamic Content Delivery
- `GET /api/skills`: Fetches all skills ordered by priority.
- `GET /api/projects`: Fetches projects and parses nested JSON metrics & features.
- `GET /api/certificates`: Fetches verified credentials.
- `GET /api/education`: Fetches academic timeline.
- `GET /api/languages`: Fetches language proficiencies.
- `GET /api/portfolio`: **Unified payload** endpoint that hydrates the entire client interface in a single roundtrip.

### 2. Secure Contact & Lead Generation
- `POST /api/contact`: Sanitizes inputs (strips HTML/XSS), validates email formats, records client IP/user agent, inserts into `contact_messages`, and includes commented-out automated email alerting via Python's `smtplib`.

### 3. Visitor Telemetry Tracking
- `POST /api/analytics/track`: Captures anonymous session heartbeats, engagement duration, and scroll depth.
- `POST /api/analytics/event`: Records discrete interaction events (e.g., project clicks, simulation triggers).

### 4. Data Analyst Admin Dashboard (Protected)
- `GET /admin/login`: Authentication portal.
- `POST /admin/login`: Validates password hash and initializes secure session.
- `GET /admin/dashboard`: Hidden admin analytics center.
- `GET /api/admin/metrics`: Aggregates live statistical metrics for Chart.js.
- `POST /api/admin/messages/<id>/mark-read`: Marks an inquiry as processed.

---

## 📊 Data Analyst Admin Dashboard (`/admin/dashboard`)

The hidden dashboard serves as a live demonstration of Abinesh's data analytics and visualization capabilities:
1. **Engagement Velocity Line Chart**: Daily active sessions over time with neon gradient fills.
2. **Project Interest Clickstream Bar Chart**: Compares visitor click engagement between *Dynamic Pricing Engine* and *Institutional Health Clinic*.
3. **Device Telemetry Doughnut Chart**: Form-factor breakdown (Desktop vs Mobile vs Tablet).
4. **Browser Ecosystem Chart**: Client software profiling.
5. **Real-time KPI Tiles**: Total sessions, average engagement duration (seconds), scroll depth %, unread leads.
6. **Inbound Transmission Queue**: Interactive management table for messages received through the contact form.

### 🔐 Default Admin Credentials
- **URL**: `http://localhost:5000/admin/dashboard`
- **Username**: `admin`
- **Password**: `antigravity2024`

---

## 📧 Automated Email Alerts (`smtplib`)
In `app.py` under `handle_contact()`, an automated email dispatch block is provided and ready to activate. To enable automatic email forwarding to your inbox:
1. Uncomment the `smtplib` section in `app.py`.
2. Configure your SMTP provider credentials (e.g. Gmail App Password).

---

## 🚀 How to Run the Mini-Project Locally

### 1. Prerequisites
Ensure Python 3.10+ is installed on your machine.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Dependencies: `flask`, `werkzeug`)*

### 3. Initialize SQLite Database
```bash
python init_db.py
```
This creates `portfolio.db` from `schema.sql` and populates all initial academic, project, skill, certificate, and baseline telemetry records.

### 4. Start the Application
```bash
python app.py
```

### 5. Access the Application
- **Main Portfolio Website**: [http://127.0.0.1:5000](http://127.0.0.1:5000)
- **Data Analyst Admin Dashboard**: [http://127.0.0.1:5000/admin/dashboard](http://127.0.0.1:5000/admin/dashboard)
  - Username: `admin`
  - Password: `antigravity2024`

---

## 📁 Neatly Separated Project Structure

```
MYPORTFOLIO/
├── app.py                      # Flask Full-Stack Server & REST APIs
├── schema.sql                  # Relational SQLite Database Schema & Seed Data
├── init_db.py                  # Database initialization and admin hashing script
├── requirements.txt            # Python dependencies (Flask, Werkzeug)
├── portfolio.db                # SQLite database file (created by init_db.py)
├── README.md                   # Complete academic documentation
├── templates/
│   ├── admin_login.html        # Glassmorphic admin authentication template
│   └── admin_dashboard.html    # Interactive Chart.js Data Analyst dashboard
└── public/
    ├── index.html              # Database-driven UI with loading skeletons
    ├── css/
    │   └── style.css           # Antigravity float keyframes, glassmorphism, 3D tilt
    ├── js/
    │   ├── main.js             # Telemetry tracker, dynamic DB hydrator, modals
    │   └── particles.js        # Zero-G Canvas particle physics simulation
    └── images/                 # Custom profile picture slot (profile.jpg)
```
