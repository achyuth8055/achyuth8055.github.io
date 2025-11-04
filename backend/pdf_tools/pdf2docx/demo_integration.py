"""
DEMO: How easy it is to integrate pdf2docx_ui into your project

This file demonstrates 3 different ways to use the module, 
each progressively more complex but still simple!
"""

print("\n" + "="*70)
print("PDF2DOCX UI - Integration Demo")
print("="*70)
print("\nThis demo shows 3 ways to integrate PDF conversion:")
print("  1. Just convert a file (no UI)")
print("  2. Start a web UI")
print("  3. Add to your Flask app")
print("\n" + "="*70 + "\n")

# ============================================================================
# Demo 1: Convert a file directly
# ============================================================================
print("DEMO 1: Convert a PDF file directly (no UI)")
print("-" * 70)

from pdf2docx_ui import convert_pdf_to_docx
import os

# Find a sample PDF
sample_dir = 'test/samples'
if os.path.exists(sample_dir):
    sample_pdf = os.path.join(sample_dir, 'demo-text.pdf')
    
    if os.path.exists(sample_pdf):
        print(f"Input:  {sample_pdf}")
        print("Converting...")
        
        # THIS IS ALL YOU NEED - ONE LINE!
        output = convert_pdf_to_docx(sample_pdf, 'demo_output.docx')
        
        if os.path.exists(output):
            size = os.path.getsize(output) / 1024
            print(f"Output: {output} ({size:.1f} KB)")
            print("✅ Success!\n")
            
            # Cleanup
            os.remove(output)
        else:
            print("❌ Failed\n")
    else:
        print("Sample file not found\n")
else:
    print("Sample directory not found\n")

# ============================================================================
# Demo 2: Run the web UI
# ============================================================================
print("DEMO 2: Start a web UI")
print("-" * 70)
print("To start the web UI, just run:")
print("\n    from pdf2docx_ui import run_ui")
print("    run_ui()")
print("\nThat's it! Two lines and you have a full web interface.")
print("(We're not starting it now to avoid blocking this demo)\n")

# ============================================================================
# Demo 3: Integrate into Flask app
# ============================================================================
print("DEMO 3: Add to your existing Flask application")
print("-" * 70)
print("Here's a complete Flask app with PDF conversion integrated:\n")

demo_code = '''
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
            <li><a href="/converter">PDF Converter</a></li>
        </ul>
    """

# ADD THESE TWO LINES to integrate PDF converter:
converter = create_converter_blueprint(prefix='/converter')
app.register_blueprint(converter)

if __name__ == '__main__':
    app.run(port=5000)
'''

print(demo_code)
print("\nJust TWO lines added and your app now has PDF conversion!")
print("PDF converter available at: http://localhost:5000/converter/\n")

# ============================================================================
# Summary
# ============================================================================
print("="*70)
print("SUMMARY")
print("="*70)
print("\n✅ Method 1: One line to convert programmatically")
print("   convert_pdf_to_docx('input.pdf')")
print("\n✅ Method 2: Two lines to start web UI")
print("   from pdf2docx_ui import run_ui")
print("   run_ui()")
print("\n✅ Method 3: Two lines to add to Flask app")
print("   converter = create_converter_blueprint()")
print("   app.register_blueprint(converter)")
print("\n" + "="*70)
print("\nFor more examples, see:")
print("  - INTEGRATION_GUIDE.md (8 detailed methods)")
print("  - example_usage.py (complete working examples)")
print("  - test_integration.py (automated tests)")
print("\n" + "="*70 + "\n")
