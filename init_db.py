"""
Database Initialization Script for Abinesh S Portfolio & Analytics Hub
Academic Mini-Project
"""
import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(__file__), 'portfolio.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

def init_database():
    print(f"Initializing SQLite database at: {DB_PATH}")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    
    cursor.executescript(schema_sql)
    
    # Create default Admin Account
    # Default username: admin | default password: antigravity2024
    admin_user = 'admin'
    admin_pass = 'antigravity2024'
    password_hash = generate_password_hash(admin_pass)
    
    cursor.execute(
        "INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)",
        (admin_user, password_hash, 'Lead Data Analyst & Admin')
    )
    
    conn.commit()
    conn.close()
    print("Database initialized successfully with complete seed data!")
    print(f"Default Admin Credentials created:")
    print(f"Username: {admin_user}")
    print(f"Password: {admin_pass}")

if __name__ == '__main__':
    init_database()
