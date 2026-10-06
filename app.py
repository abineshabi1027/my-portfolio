"""
==============================================================================
ANTIGRAVITY DATA ANALYST PORTFOLIO & TELEMETRY HUB (FLASK FULL-STACK)
Academic Mini-Project for Abinesh S (BE CSE III Year @ PACET)
==============================================================================
"""

import os
import json
import sqlite3
import re
import html
from datetime import datetime, timedelta
from functools import wraps

from flask import (
    Flask, request, jsonify, render_template,
    send_from_directory, redirect, url_for, session
)
from werkzeug.security import check_password_hash, generate_password_hash

# Application Configuration
app = Flask(__name__, static_folder='public', static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'antigravity-secret-key-pacet-2024-data-analyst')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=4)

DB_PATH = os.path.join(os.path.dirname(__file__), 'portfolio.db')


# ============================================================================
# DATABASE HELPER FUNCTIONS
# ============================================================================

def get_db_connection():
    """Returns a SQLite connection with Row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def query_db(query, args=(), one=False):
    """Executes a query and returns dictionary results."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.close()
    return (dict(rv[0]) if rv else None) if one else [dict(r) for r in rv]


def execute_db(query, args=()):
    """Executes an INSERT, UPDATE, or DELETE query and commits."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(query, args)
    conn.commit()
    last_id = cur.lastrowid
    conn.close()
    return last_id


def sanitize_input(text):
    """Sanitizes user input against XSS and unwanted control characters."""
    if not text:
        return ""
    # Strip HTML tags and escape characters
    clean = re.sub(r'<[^>]*?>', '', text)
    return html.escape(clean.strip())


# ============================================================================
# AUTHENTICATION DECORATOR FOR ADMIN DASHBOARD
# ============================================================================

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function


# ============================================================================
# 1. DYNAMIC CONTENT MANAGEMENT REST APIs (Database-Driven UI)
# ============================================================================

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Fetch skills constellation from SQLite database."""
    try:
        skills = query_db("SELECT * FROM skills ORDER BY display_order ASC")
        return jsonify({"success": True, "count": len(skills), "data": skills})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Fetch projects showcase from SQLite database, parsing JSON metrics & tags."""
    try:
        projects = query_db("SELECT * FROM projects ORDER BY display_order ASC")
        for p in projects:
            p['tags'] = json.loads(p['tags']) if p.get('tags') else []
            p['metrics'] = json.loads(p['metrics_json']) if p.get('metrics_json') else {}
            p['features'] = json.loads(p['features_json']) if p.get('features_json') else []
        return jsonify({"success": True, "count": len(projects), "data": projects})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/certificates', methods=['GET'])
def get_certificates():
    """Fetch certifications from SQLite database."""
    try:
        certificates = query_db("SELECT * FROM certificates ORDER BY display_order ASC")
        return jsonify({"success": True, "count": len(certificates), "data": certificates})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/education', methods=['GET'])
def get_education():
    """Fetch academic trajectory and education entries."""
    try:
        education = query_db("SELECT * FROM education ORDER BY display_order ASC")
        return jsonify({"success": True, "count": len(education), "data": education})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/languages', methods=['GET'])
def get_languages():
    """Fetch linguistic proficiency entries."""
    try:
        languages = query_db("SELECT * FROM languages ORDER BY id ASC")
        return jsonify({"success": True, "count": len(languages), "data": languages})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/portfolio', methods=['GET'])
def get_full_portfolio():
    """Unified payload endpoint: hydrates the entire frontend in a single roundtrip."""
    try:
        skills = query_db("SELECT * FROM skills ORDER BY display_order ASC")
        raw_projects = query_db("SELECT * FROM projects ORDER BY display_order ASC")
        projects = []
        for p in raw_projects:
            p['tags'] = json.loads(p['tags']) if p.get('tags') else []
            p['metrics'] = json.loads(p['metrics_json']) if p.get('metrics_json') else {}
            p['features'] = json.loads(p['features_json']) if p.get('features_json') else []
            projects.append(p)
        certificates = query_db("SELECT * FROM certificates ORDER BY display_order ASC")
        education = query_db("SELECT * FROM education ORDER BY display_order ASC")
        languages = query_db("SELECT * FROM languages ORDER BY id ASC")

        return jsonify({
            "success": True,
            "data": {
                "skills": skills,
                "projects": projects,
                "certificates": certificates,
                "education": education,
                "languages": languages
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================================
# 2. SECURE CONTACT & LEAD GENERATION SYSTEM
# ============================================================================

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """
    Receives contact form submissions, sanitizes inputs, records telemetry,
    stores in contact_messages SQL table, and provides email alert hooks.
    """
    try:
        data = request.get_json() or request.form

        raw_name = data.get('name', '')
        raw_email = data.get('email', '')
        raw_subject = data.get('subject', 'Portfolio Lead Inquiry')
        raw_message = data.get('message', '')

        name = sanitize_input(raw_name)
        email = sanitize_input(raw_email)
        subject = sanitize_input(raw_subject)
        message = sanitize_input(raw_message)

        # Validation
        if not name or not email or not message:
            return jsonify({
                "success": False,
                "message": "All required transmission fields (name, email, message) must be completed."
            }), 400

        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            return jsonify({
                "success": False,
                "message": "Please provide a valid email frequency address."
            }), 400

        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        user_agent = request.headers.get('User-Agent', '')

        # Store in SQLite database
        msg_id = execute_db(
            """INSERT INTO contact_messages 
               (name, email, subject, message, ip_address, user_agent, created_at, status)
               VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 'unread')""",
            (name, email, subject, message, client_ip, user_agent)
        )

        # Also log interaction event for analytics clickstream
        session_id = data.get('session_id', 'unknown_session')
        execute_db(
            """INSERT INTO visitor_events (session_id, event_type, event_target, metadata, created_at)
               VALUES (?, 'contact_submit', 'contact_form', ?, datetime('now'))""",
            (session_id, json.dumps({"name": name, "email": email, "subject": subject}))
        )

        # =====================================================================
        # PLACEHOLDER AUTOMATED EMAIL ALERT LOGIC (Python smtplib)
        # Uncomment and configure with real SMTP credentials to enable:
        # =====================================================================
        # import smtplib
        # from email.mime.text import MIMEText
        # from email.mime.multipart import MIMEMultipart
        #
        # SMTP_SERVER = "smtp.gmail.com"
        # SMTP_PORT = 587
        # SENDER_EMAIL = "your-email@gmail.com"
        # SENDER_PASSWORD = "your-app-password"
        # RECIPIENT_EMAIL = "abinesh@pacet.edu.in"
        #
        # try:
        #     email_msg = MIMEMultipart("alternative")
        #     email_msg["Subject"] = f"🚀 [Portfolio Lead] New Message: {subject}"
        #     email_msg["From"] = SENDER_EMAIL
        #     email_msg["To"] = RECIPIENT_EMAIL
        #     body_html = f"""
        #     <div style="font-family: Arial, sans-serif; background: #030712; color: #f8fafc; padding: 20px; border-radius: 10px;">
        #         <h2 style="color: #00f2fe;">New Portfolio Transmission Received</h2>
        #         <p><strong>Sender:</strong> {name} ({email})</p>
        #         <p><strong>Subject:</strong> {subject}</p>
        #         <div style="background: rgba(255,255,255,0.05); padding: 15px; border-left: 4px solid #00f2fe; margin-top: 15px;">
        #             <p style="white-space: pre-wrap;">{message}</p>
        #         </div>
        #         <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">Transmitted from IP: {client_ip}</p>
        #     </div>
        #     """
        #     email_msg.attach(MIMEText(body_html, "html"))
        #     with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        #         server.starttls()
        #         server.login(SENDER_EMAIL, SENDER_PASSWORD)
        #         server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, email_msg.as_string())
        # except Exception as email_err:
        #     print(f"SMTP Email Notification Notice: {email_err}")
        # =====================================================================

        return jsonify({
            "success": True,
            "message": f"Thank you, {name}! Your transmission has been securely logged (Message ID #{msg_id}). Abinesh S will connect with your frequency shortly."
        })

    except Exception as e:
        return jsonify({"success": False, "message": f"Transmission error: {str(e)}"}), 500


# ============================================================================
# 3. VISITOR TELEMETRY & TRACKING SYSTEM (Data Analyst Hub)
# ============================================================================

def parse_user_agent(ua_string):
    """Helper to extract browser, OS, and device classification."""
    browser = 'Other'
    os_name = 'Other'
    device = 'Desktop'

    ua_lower = ua_string.lower()

    # Device
    if 'mobile' in ua_lower or 'android' in ua_lower or 'iphone' in ua_lower:
        device = 'Mobile'
    elif 'tablet' in ua_lower or 'ipad' in ua_lower:
        device = 'Tablet'

    # Browser
    if 'edg' in ua_lower:
        browser = 'Edge'
    elif 'chrome' in ua_lower and 'edg' not in ua_lower:
        browser = 'Chrome'
    elif 'firefox' in ua_lower:
        browser = 'Firefox'
    elif 'safari' in ua_lower and 'chrome' not in ua_lower:
        browser = 'Safari'

    # OS
    if 'windows' in ua_lower:
        os_name = 'Windows'
    elif 'macintosh' in ua_lower or 'mac os' in ua_lower:
        os_name = 'macOS'
    elif 'linux' in ua_lower:
        os_name = 'Linux'
    elif 'android' in ua_lower:
        os_name = 'Android'
    elif 'iphone' in ua_lower or 'ipad' in ua_lower:
        os_name = 'iOS'

    return browser, os_name, device


@app.route('/api/analytics/track', methods=['POST'])
def track_visitor():
    """
    Receives anonymous visitor session telemetry:
    - Session ID, time spent, max scroll depth, referrer, rough location/timezone.
    """
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id')
        if not session_id:
            return jsonify({"success": False, "message": "session_id required"}), 400

        time_spent = int(data.get('time_spent_seconds', 0))
        scroll_depth = int(data.get('max_scroll_depth', 0))
        city = sanitize_input(data.get('city', 'Coimbatore/Pollachi'))
        region = sanitize_input(data.get('region', 'Tamil Nadu'))
        country = sanitize_input(data.get('country', 'India'))
        timezone = sanitize_input(data.get('timezone', 'Asia/Kolkata'))
        referrer = sanitize_input(data.get('referrer', 'Direct'))

        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        ua_string = request.headers.get('User-Agent', '')
        browser, os_name, device = parse_user_agent(ua_string)

        # Check if session exists in visitor_analytics
        existing = query_db(
            "SELECT id, time_spent_seconds, max_scroll_depth FROM visitor_analytics WHERE session_id = ?",
            (session_id,), one=True
        )

        if existing:
            # Update duration and scroll depth
            new_time = max(existing['time_spent_seconds'], time_spent)
            new_scroll = max(existing['max_scroll_depth'], scroll_depth)
            execute_db(
                """UPDATE visitor_analytics 
                   SET time_spent_seconds = ?, max_scroll_depth = ?, last_heartbeat = datetime('now')
                   WHERE id = ?""",
                (new_time, new_scroll, existing['id'])
            )
        else:
            # Insert new session
            execute_db(
                """INSERT INTO visitor_analytics 
                   (session_id, ip_address, user_agent, browser, os, device_type, city, region, country, timezone, referrer, time_spent_seconds, max_scroll_depth, created_at, last_heartbeat)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))""",
                (session_id, client_ip, ua_string, browser, os_name, device, city, region, country, timezone, referrer, time_spent, scroll_depth)
            )

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/analytics/event', methods=['POST'])
def track_event():
    """Records granular interaction events (project clicks, modal opens, cert inspections)."""
    try:
        data = request.get_json() or {}
        session_id = data.get('session_id', 'anonymous')
        event_type = sanitize_input(data.get('event_type', 'generic_click'))
        event_target = sanitize_input(data.get('event_target', 'unknown'))
        metadata = json.dumps(data.get('metadata', {}))

        execute_db(
            """INSERT INTO visitor_events (session_id, event_type, event_target, metadata, created_at)
               VALUES (?, ?, ?, ?, datetime('now'))""",
            (session_id, event_type, event_target, metadata)
        )
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ============================================================================
# 4. DATA ANALYST ADMIN DASHBOARD (Hidden, Password-Protected)
# ============================================================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Hidden admin login portal."""
    error = None
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        admin = query_db("SELECT * FROM admin_users WHERE username = ?", (username,), one=True)
        if admin and check_password_hash(admin['password_hash'], password):
            session['admin_logged_in'] = True
            session['admin_username'] = admin['username']
            session['admin_role'] = admin['role']
            return redirect(url_for('admin_dashboard'))
        else:
            error = "Invalid Analyst Access Key or Username."

    return render_template('admin_login.html', error=error)


@app.route('/admin/logout')
def admin_logout():
    """Log out admin session."""
    session.clear()
    return redirect(url_for('admin_login'))


@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    """Hidden Data Analyst Admin Dashboard UI."""
    return render_template('admin_dashboard.html', admin_name=session.get('admin_username'))


@app.route('/api/admin/metrics', methods=['GET'])
@admin_required
def admin_metrics_api():
    """
    Computes statistical telemetry metrics for Chart.js rendering:
    - Session engagement distribution
    - Top clicked projects
    - Daily traffic timeline
    - Device breakdown
    - Recent inquiries
    """
    try:
        # 1. High-Level KPI Summary
        total_sessions = query_db("SELECT COUNT(*) as count FROM visitor_analytics", one=True)['count']
        avg_duration = query_db("SELECT AVG(time_spent_seconds) as avg_time FROM visitor_analytics", one=True)['avg_time'] or 0
        avg_scroll = query_db("SELECT AVG(max_scroll_depth) as avg_scroll FROM visitor_analytics", one=True)['avg_scroll'] or 0
        total_messages = query_db("SELECT COUNT(*) as count FROM contact_messages", one=True)['count']
        unread_messages = query_db("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'", one=True)['count']

        # 2. Project Clicks Distribution (Bar / Doughnut Chart)
        project_clicks = query_db(
            """SELECT event_target, COUNT(*) as click_count 
               FROM visitor_events 
               WHERE event_type = 'project_click' 
               GROUP BY event_target 
               ORDER BY click_count DESC"""
        )

        # 3. Device Breakdown (Pie Chart)
        devices = query_db(
            """SELECT device_type, COUNT(*) as count 
               FROM visitor_analytics 
               GROUP BY device_type"""
        )

        # 4. Browser Distribution
        browsers = query_db(
            """SELECT browser, COUNT(*) as count 
               FROM visitor_analytics 
               GROUP BY browser"""
        )

        # 5. Traffic Timeline by Day (Line Chart - Last 7 days)
        traffic_trend = query_db(
            """SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count 
               FROM visitor_analytics 
               GROUP BY date 
               ORDER BY date DESC 
               LIMIT 7"""
        )
        traffic_trend.reverse()  # Chronological order

        # 6. Recent Contact Messages Table
        recent_messages = query_db(
            """SELECT id, name, email, subject, message, created_at, status 
               FROM contact_messages 
               ORDER BY created_at DESC 
               LIMIT 10"""
        )

        return jsonify({
            "success": True,
            "kpis": {
                "total_sessions": total_sessions,
                "avg_duration_sec": round(avg_duration, 1),
                "avg_scroll_pct": round(avg_scroll, 1),
                "total_messages": total_messages,
                "unread_messages": unread_messages
            },
            "charts": {
                "project_clicks": project_clicks,
                "device_breakdown": devices,
                "browser_distribution": browsers,
                "traffic_trend": traffic_trend
            },
            "recent_messages": recent_messages
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/admin/messages/<int:msg_id>/mark-read', methods=['POST'])
@admin_required
def mark_message_read(msg_id):
    """Mark inquiry as read."""
    execute_db("UPDATE contact_messages SET status = 'read' WHERE id = ?", (msg_id,))
    return jsonify({"success": True})


# ============================================================================
# 5. STATIC FRONTEND SERVING
# ============================================================================

@app.route('/')
def serve_index():
    """Serves the primary portfolio frontend."""
    return send_from_directory('public', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    """Static assets fallback."""
    if os.path.exists(os.path.join('public', path)):
        return send_from_directory('public', path)
    return send_from_directory('public', 'index.html')


# ============================================================================
# ENTRYPOINT
# ============================================================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f">> Antigravity Flask Full-Stack Server active on http://127.0.0.1:{port}")
    print(f">> Hidden Admin Dashboard: http://127.0.0.1:{port}/admin/dashboard (User: admin | Pass: antigravity2024)")
    app.run(host='0.0.0.0', port=port, debug=False)
