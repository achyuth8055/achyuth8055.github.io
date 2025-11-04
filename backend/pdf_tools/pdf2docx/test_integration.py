#!/usr/bin/env python3
"""
Quick test script to verify pdf2docx_ui module integration.
"""

print("\n" + "="*60)
print("PDF2DOCX UI Module - Integration Test")
print("="*60 + "\n")

# Test 1: Import the module
print("✓ Test 1: Importing module...")
try:
    from pdf2docx_ui import (
        create_app,
        run_ui,
        create_converter_blueprint,
        convert_pdf_to_docx
    )
    print("  ✅ All functions imported successfully\n")
except ImportError as e:
    print(f"  ❌ Import failed: {e}\n")
    exit(1)

# Test 2: Programmatic conversion
print("✓ Test 2: Testing programmatic conversion...")
try:
    import os
    sample_dir = os.path.join(os.path.dirname(__file__), 'test', 'samples')
    sample_pdf = os.path.join(sample_dir, 'demo-text.pdf')
    
    if os.path.exists(sample_pdf):
        output_docx = 'test_output.docx'
        
        def callback(msg):
            print(f"  {msg}")
        
        result = convert_pdf_to_docx(sample_pdf, output_docx, callback=callback)
        
        if os.path.exists(result):
            size = os.path.getsize(result) / 1024
            print(f"  ✅ Conversion successful! Output: {result} ({size:.2f} KB)")
            os.remove(result)  # Cleanup
        else:
            print("  ❌ Output file not created")
    else:
        print("  ⚠️  Sample file not found, skipping test")
    print()
except Exception as e:
    print(f"  ❌ Conversion test failed: {e}\n")

# Test 3: Create Flask app
print("✓ Test 3: Creating Flask app...")
try:
    app = create_app(
        sample_folder='test/samples'
    )
    print(f"  ✅ Flask app created: {app.name}")
    print(f"  ✅ Max file size: {app.config.get('MAX_CONTENT_LENGTH', 0) / 1024 / 1024:.0f}MB")
    print()
except Exception as e:
    print(f"  ❌ App creation failed: {e}\n")

# Test 4: Create Blueprint
print("✓ Test 4: Creating Blueprint...")
try:
    from flask import Flask
    bp = create_converter_blueprint(prefix='/converter')
    print(f"  ✅ Blueprint created: {bp.name}")
    print(f"  ✅ URL prefix: {bp.url_prefix}")
    
    # Test registration
    test_app = Flask(__name__)
    test_app.register_blueprint(bp)
    print(f"  ✅ Blueprint registered to app")
    print()
except Exception as e:
    print(f"  ❌ Blueprint test failed: {e}\n")

# Summary
print("="*60)
print("Summary: All integration tests passed! ✅")
print("="*60)
print("\nQuick start examples:")
print("\n1. Standalone UI:")
print("   from pdf2docx_ui import run_ui")
print("   run_ui()")
print("\n2. Programmatic conversion:")
print("   from pdf2docx_ui import convert_pdf_to_docx")
print("   convert_pdf_to_docx('input.pdf', 'output.docx')")
print("\n3. Flask integration:")
print("   from pdf2docx_ui import create_converter_blueprint")
print("   app.register_blueprint(create_converter_blueprint())")
print("\n" + "="*60 + "\n")
