import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def create_code_document():
    doc = Document()
    
    # Page setup: Standard margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("ABINESH S - PORTFOLIO SOURCE CODE")
    title_run.font.name = "Calibri"
    title_run.font.size = Pt(22)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(15, 23, 42)
    
    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub.add_run("Full-Stack Data Analyst Portfolio & Telemetry Hub | BE CSE III Year @ PACET")
    sub_run.font.name = "Calibri"
    sub_run.font.size = Pt(11)
    sub_run.font.color.rgb = RGBColor(100, 116, 139)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    
    code_files = [
        ("app.py", "Python Flask Backend & RESTful APIs"),
        ("schema.sql", "SQLite Relational Database Schema & Seed Data"),
        ("init_db.py", "Database Initialization & Security Hashing"),
        ("public/index.html", "Frontend HTML5 & Antigravity Glassmorphism UI"),
        ("public/css/style.css", "Custom Antigravity Keyframes & Glassmorphism Styling"),
        ("public/js/main.js", "Frontend Logic, Database Hydration & Telemetry Tracker"),
        ("public/js/particles.js", "Zero-G HTML5 Canvas Particle Physics Engine"),
        ("templates/admin_login.html", "Admin Authentication UI Template"),
        ("templates/admin_dashboard.html", "Data Analyst Telemetry Dashboard Template (Chart.js)"),
        ("server.js", "Node.js / Express Backend Server (Alternative Runtime)"),
        ("package.json", "Node.js Configuration & Dependencies"),
        ("requirements.txt", "Python Dependencies Configuration")
    ]
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename, heading in code_files:
        filepath = os.path.join(base_dir, filename.replace('/', os.sep))
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            code_text = f.read()
            
        # Heading
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        
        run_h = h.add_run(f"{heading} ({filename})")
        run_h.font.name = "Calibri"
        run_h.font.size = Pt(14)
        run_h.font.bold = True
        run_h.font.color.rgb = RGBColor(14, 116, 144) # Deep Cyan
        
        # Code Box (1x1 table with background shading)
        table = doc.add_table(rows=1, cols=1)
        table.autofit = False
        table.columns[0].width = Inches(6.9)
        
        cell = table.cell(0, 0)
        set_cell_background(cell, "F8FAFC") # Light slate background for readability
        
        # Borders: subtle left border
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="18" w:space="0" w:color="0EA5E9"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(4)
        cp.paragraph_format.space_after = Pt(4)
        cp.paragraph_format.line_spacing = 1.05
        
        c_run = cp.add_run(code_text)
        c_run.font.name = "Consolas"
        c_run.font.size = Pt(8.5)
        c_run.font.color.rgb = RGBColor(30, 41, 59)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    output_path = os.path.join(base_dir, "Abinesh_S_Portfolio_Source_Code.docx")
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == '__main__':
    create_code_document()
