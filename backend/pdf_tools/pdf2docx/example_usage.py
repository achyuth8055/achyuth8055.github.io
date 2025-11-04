"""
Example: Using pdf2docx_ui module in your own project

This demonstrates how easy it is to integrate PDF to DOCX conversion
into any Python project.
"""

# ============================================================================
# Example 1: Simplest Way - Just run the UI
# ============================================================================
def example1_quick_start():
    """Just start the UI - that's it!"""
    from pdf2docx_ui import run_ui
    
    # This one line starts the entire web UI
    run_ui()
    
    # Access at http://127.0.0.1:5001


# ============================================================================
# Example 2: Convert PDFs in Your Code (No UI)
# ============================================================================
def example2_programmatic():
    """Use conversion function directly in your business logic."""
    from pdf2docx_ui import convert_pdf_to_docx
    
    # In your application logic
    def process_document(pdf_path):
        """Your function that needs PDF conversion."""
        print(f"Processing: {pdf_path}")
        
        # Convert PDF to DOCX
        docx_path = convert_pdf_to_docx(pdf_path)
        
        # Continue with your business logic
        print(f"Converted document available at: {docx_path}")
        return docx_path
    
    # Usage
    result = process_document('invoice.pdf')
    print(f"Result: {result}")


# ============================================================================
# Example 3: Add to Existing Flask App
# ============================================================================
def example3_flask_integration():
    """Add converter to your existing Flask application."""
    from flask import Flask
    from pdf2docx_ui import create_converter_blueprint
    
    # Your existing Flask app
    app = Flask(__name__)
    
    # Your existing routes
    @app.route('/')
    def home():
        return """
        <h1>My Application</h1>
        <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/reports">Reports</a></li>
            <li><a href="/converter">PDF Converter</a></li>
        </ul>
        """
    
    @app.route('/dashboard')
    def dashboard():
        return "<h1>Dashboard</h1>"
    
    @app.route('/reports')
    def reports():
        return "<h1>Reports</h1>"
    
    # Add PDF converter with just 2 lines!
    converter = create_converter_blueprint(prefix='/converter')
    app.register_blueprint(converter)
    
    return app


# ============================================================================
# Example 4: Batch Processing
# ============================================================================
def example4_batch_processing():
    """Process multiple PDFs in a batch."""
    from pdf2docx_ui import convert_pdf_to_docx
    from pathlib import Path
    
    def batch_convert_invoices(input_folder, output_folder):
        """Convert all invoices in a folder."""
        input_path = Path(input_folder)
        output_path = Path(output_folder)
        output_path.mkdir(exist_ok=True)
        
        results = {
            'success': [],
            'failed': []
        }
        
        for pdf_file in input_path.glob('*.pdf'):
            try:
                docx_file = output_path / f"{pdf_file.stem}.docx"
                convert_pdf_to_docx(str(pdf_file), str(docx_file))
                results['success'].append(pdf_file.name)
                print(f"✅ {pdf_file.name}")
            
            except Exception as e:
                results['failed'].append((pdf_file.name, str(e)))
                print(f"❌ {pdf_file.name}: {e}")
        
        return results
    
    # Usage
    results = batch_convert_invoices('./invoices_pdf', './invoices_docx')
    print(f"\nSummary: {len(results['success'])} succeeded, {len(results['failed'])} failed")


# ============================================================================
# Example 5: Build a REST API
# ============================================================================
def example5_rest_api():
    """Create a REST API for PDF conversion."""
    from flask import Flask, request, jsonify, send_file
    from pdf2docx_ui import convert_pdf_to_docx
    import tempfile
    import os
    
    app = Flask(__name__)
    
    @app.route('/api/convert', methods=['POST'])
    def api_convert():
        """
        API endpoint: POST /api/convert
        Body: multipart/form-data with 'file' field
        Returns: Converted DOCX file
        """
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            file.save(tmp.name)
            pdf_path = tmp.name
        
        try:
            # Convert
            docx_path = convert_pdf_to_docx(pdf_path)
            
            # Send file
            return send_file(
                docx_path,
                as_attachment=True,
                download_name=file.filename.replace('.pdf', '.docx')
            )
        
        finally:
            os.remove(pdf_path)
    
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy', 'service': 'pdf-converter'})
    
    return app


# ============================================================================
# Example 6: Automated Document Workflow
# ============================================================================
def example6_workflow():
    """Integrate conversion into an automated workflow."""
    from pdf2docx_ui import convert_pdf_to_docx
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.base import MIMEBase
    from email import encoders
    
    def document_workflow(pdf_path, recipient_email):
        """
        Complete workflow:
        1. Convert PDF to DOCX
        2. Email the result
        3. Log the action
        """
        print(f"Starting workflow for: {pdf_path}")
        
        # Step 1: Convert
        print("  Converting PDF to DOCX...")
        docx_path = convert_pdf_to_docx(pdf_path)
        print(f"  ✅ Converted: {docx_path}")
        
        # Step 2: Email (pseudo-code)
        print(f"  Sending to: {recipient_email}")
        # send_email(recipient_email, docx_path)
        
        # Step 3: Log
        print("  ✅ Workflow complete")
        
        return {
            'status': 'success',
            'input': pdf_path,
            'output': docx_path,
            'recipient': recipient_email
        }


# ============================================================================
# Example 7: Custom Application with Authentication
# ============================================================================
def example7_with_auth():
    """Add authentication to the converter."""
    from flask import Flask, request, redirect, session
    from pdf2docx_ui import create_converter_blueprint
    from functools import wraps
    
    app = Flask(__name__)
    app.secret_key = 'your-secret-key'
    
    # Simple authentication decorator
    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user' not in session:
                return redirect('/login')
            return f(*args, **kwargs)
        return decorated_function
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            # Check credentials (simplified)
            if request.form.get('password') == 'secret':
                session['user'] = request.form.get('username')
                return redirect('/converter')
        
        return '''
            <form method="post">
                <input name="username" placeholder="Username">
                <input name="password" type="password" placeholder="Password">
                <button type="submit">Login</button>
            </form>
        '''
    
    # Add converter with authentication
    converter = create_converter_blueprint(prefix='/converter')
    
    # Protect all converter routes
    @app.before_request
    def check_auth():
        if request.path.startswith('/converter'):
            if 'user' not in session:
                return redirect('/login')
    
    app.register_blueprint(converter)
    
    return app


# ============================================================================
# Example 8: Integration with Database
# ============================================================================
def example8_with_database():
    """Store conversion history in a database."""
    from pdf2docx_ui import convert_pdf_to_docx
    from datetime import datetime
    import sqlite3
    
    class ConversionLogger:
        def __init__(self, db_path='conversions.db'):
            self.db = sqlite3.connect(db_path)
            self._create_table()
        
        def _create_table(self):
            self.db.execute('''
                CREATE TABLE IF NOT EXISTS conversions (
                    id INTEGER PRIMARY KEY,
                    pdf_name TEXT,
                    docx_name TEXT,
                    timestamp TEXT,
                    status TEXT,
                    error TEXT
                )
            ''')
            self.db.commit()
        
        def convert_and_log(self, pdf_path):
            """Convert PDF and log to database."""
            timestamp = datetime.now().isoformat()
            
            try:
                docx_path = convert_pdf_to_docx(pdf_path)
                
                # Log success
                self.db.execute('''
                    INSERT INTO conversions (pdf_name, docx_name, timestamp, status)
                    VALUES (?, ?, ?, ?)
                ''', (pdf_path, docx_path, timestamp, 'success'))
                self.db.commit()
                
                return docx_path
            
            except Exception as e:
                # Log failure
                self.db.execute('''
                    INSERT INTO conversions (pdf_name, timestamp, status, error)
                    VALUES (?, ?, ?, ?)
                ''', (pdf_path, timestamp, 'failed', str(e)))
                self.db.commit()
                raise
    
    # Usage
    logger = ConversionLogger()
    result = logger.convert_and_log('document.pdf')


# ============================================================================
# Main: Run Examples
# ============================================================================
if __name__ == '__main__':
    import sys
    
    examples = {
        '1': ('Quick Start', example1_quick_start),
        '2': ('Programmatic Conversion', example2_programmatic),
        '3': ('Flask Integration', example3_flask_integration),
        '4': ('Batch Processing', example4_batch_processing),
        '5': ('REST API', example5_rest_api),
        '6': ('Workflow Automation', example6_workflow),
        '7': ('With Authentication', example7_with_auth),
        '8': ('With Database', example8_with_database),
    }
    
    print("\n" + "="*60)
    print("PDF2DOCX UI - Integration Examples")
    print("="*60)
    print("\nAvailable examples:")
    for key, (name, _) in examples.items():
        print(f"  {key}. {name}")
    print("\nUsage: python example_usage.py [example_number]")
    print("Example: python example_usage.py 1")
    print("="*60 + "\n")
    
    if len(sys.argv) > 1:
        choice = sys.argv[1]
        if choice in examples:
            name, func = examples[choice]
            print(f"Running: {name}\n")
            func()
        else:
            print(f"Invalid example number: {choice}")
    else:
        print("No example specified. Use: python example_usage.py [1-8]")
