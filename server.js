const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory or JSON-backed contact messages store
const messagesFile = path.join(__dirname, 'messages.json');

// Helper to save contact submissions
const saveMessage = (msg) => {
  let messages = [];
  try {
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      messages = JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading messages file:', err);
  }
  messages.push({ ...msg, timestamp: new Date().toISOString() });
  try {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing messages file:', err);
  }
};

// API: Portfolio Metadata & Content
app.get('/api/portfolio', (req, res) => {
  const portfolioData = {
    personal: {
      name: "Abinesh S",
      title: "Data Analyst",
      heroTypingIntro: "Hello, I am Abinesh S. I am a Data Analyst.",
      subtag: "Synthesizing raw data chaos into high-impact predictive models, actionable business intelligence, and real-time analytical ecosystems.",
      location: "Tamil Nadu, India",
      education: "BE CSE III Year @ PACET",
      status: "Available for internships & full-time roles"
    },
    education: [
      {
        degree: "Bachelor of Engineering in Computer Science & Engineering (III Year)",
        institution: "PACET (P.A. College of Engineering and Technology)",
        location: "Pollachi, Tamil Nadu",
        period: "2023 - 2027",
        badge: "Current Degree",
        highlights: "Core competencies in Data Structures, Database Management Systems, Machine Learning Foundations, Business Intelligence & Statistical Analysis."
      },
      {
        degree: "Higher Secondary Certificate (XII)",
        institution: "HILLFORT Matric Hr Sec School",
        location: "Kotagiri, The Nilgiris",
        period: "Completed",
        badge: "Higher Secondary",
        highlights: "Strong mathematical foundation, analytical reasoning, and computer science basics."
      },
      {
        degree: "Secondary School Leaving Certificate (SSLC)",
        institution: "Nanjanadu Government Hr Sec School",
        location: "Nanjanadu, The Nilgiris",
        period: "Completed",
        badge: "Secondary",
        highlights: "Distinguished academic record with an early inclination toward problem solving and quantitative analysis."
      }
    ],
    languages: [
      { name: "Tamil", proficiency: 100, level: "Native / Bilingual" },
      { name: "English", proficiency: 92, level: "Professional Working" }
    ],
    skills: [
      { name: "Python", category: "Programming & ML", level: "95%", icon: "fab fa-python", highlight: "Pandas, NumPy, Scikit-Learn, Streamlit" },
      { name: "SQL", category: "Database & Queries", level: "92%", icon: "fas fa-database", highlight: "PostgreSQL, SQLite, Complex Joins, Window Functions" },
      { name: "Excel", category: "Spreadsheet Analytics", level: "90%", icon: "fas fa-file-excel", highlight: "Power Query, Pivot Tables, Advanced Modeling, VBA" },
      { name: "PowerBI", category: "Data Visualization & BI", level: "88%", icon: "fas fa-chart-pie", highlight: "DAX Measures, Interactive Dashboards, KPI Reporting" },
      { name: "Business Statistics", category: "Mathematical Foundations", level: "94%", icon: "fas fa-square-root-variable", highlight: "Hypothesis Testing, Regression, Probability Distributions" }
    ],
    projects: [
      {
        id: "dynamic-pricing-engine",
        title: "Dynamic Pricing Engine",
        subtitle: "Machine Learning & Real-Time Streaming Analytics",
        tags: ["Python", "Streamlit", "Machine Learning", "Synthetic Data", "Predictive Analytics"],
        description: "A machine learning-powered Streamlit dashboard that simulates real-time dynamic product pricing based on live inventory levels, competitor pricing, and market demand fluctuations. Demonstrates the end-to-end lifecycle of a machine learning model, from synthetic data generation and training to deployment in a 'live' streaming environment.",
        keyFeatures: [
          "Live synthetic market stream simulation with dynamic Poisson demand bursts",
          "Elasticity-driven pricing model balancing margin vs conversion probability",
          "Automated model retraining triggers on market drift",
          "Interactive sensitivity testing slider console with real-time profit estimation"
        ],
        metrics: {
          "Revenue Uplift": "+18.4%",
          "Latency": "< 45ms",
          "Model Type": "Gradient Boosting Regressor",
          "Data Points": "50,000+ Simulated Orders"
        }
      },
      {
        id: "institutional-health-clinic",
        title: "Institutional Health Clinic",
        subtitle: "Full-Stack Data Engineering & Healthcare Analytics",
        tags: ["Pandas", "SQLite", "Flask REST API", "JavaScript", "Chart.js", "Full-Stack Analytics"],
        description: "An end-to-end data analytics and full-stack web project simulating a student health clinic's operational dashboard. Handles the entire data lifecycle: generating realistic mock data, cleaning inconsistencies with Pandas, structuring a relational SQLite database, building a RESTful API with Flask, and visualizing metrics via an interactive JavaScript/Chart.js frontend.",
        keyFeatures: [
          "End-to-end ETL: Raw anomaly ingestion -> Pandas imputation & normalization -> SQLite relational store",
          "Secure RESTful endpoint architecture serving real-time patient throughput and pharmacy inventories",
          "Dynamic interactive charts tracking peak admission hours, diagnosis trends, and prescription fulfillment",
          "Operational KPIs alerting clinical staff to triage bottlenecks"
        ],
        metrics: {
          "Records Cleaned": "12,500+ Patients",
          "API Response": "18ms Average",
          "DB Schema": "Relational 3NF SQLite",
          "Dashboards": "5 Interactive Visuals"
        }
      }
    ],
    experience: [
      {
        role: "Data Analytics & Engineering Trainee",
        organization: "Academic Research & Innovation Lab (PACET)",
        period: "2024 - Present",
        badge: "Featured Role",
        description: "Leading exploratory data analysis (EDA), automated data cleaning pipelines, and predictive prototype development. Transforming multi-variable datasets into actionable operational dashboards for institutional efficiency."
      }
    ],
    certificates: [
      {
        title: "Advanced Data Analytics with Python",
        issuer: "Professional Certification Program",
        date: "2024",
        category: "Machine Learning & Python",
        credentialId: "CERT-PY-88219"
      },
      {
        title: "SQL for Data Science & Relational Modeling",
        issuer: "Database Engineering Institute",
        date: "2024",
        category: "Databases & Query Optimization",
        credentialId: "CERT-SQL-40912"
      },
      {
        title: "PowerBI & Business Intelligence Specialist",
        issuer: "Enterprise Analytics Council",
        date: "2023",
        category: "BI & Dashboard Architecture",
        credentialId: "CERT-PBI-19504"
      },
      {
        title: "Applied Statistical Foundations for Decision Making",
        issuer: "Mathematics & Statistics Academy",
        date: "2023",
        category: "Statistical Inference",
        credentialId: "CERT-STAT-61023"
      }
    ]
  };

  res.json({ success: true, data: portfolioData });
});

// API: Contact Form Submission Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and message.'
    });
  }

  // Basic email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  const submission = { name, email, subject: subject || 'General Inquiry', message };
  saveMessage(submission);

  return res.json({
    success: true,
    message: `Thank you, ${name}! Your transmission has reached Abinesh S. I will respond to your frequency shortly.`
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'active', system: 'Antigravity Portfolio Backend', timestamp: new Date() });
});

// Route for dedicated Projects & Certificates page
app.get('/work', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// Fallback to index.html for single page client navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌌 Antigravity Portfolio server running in hyperdrive on http://localhost:${PORT}`);
});
