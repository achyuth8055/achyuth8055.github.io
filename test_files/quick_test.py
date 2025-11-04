#!/usr/bin/env python3
"""Quick test script for new PDF endpoints"""

import requests
import os
import sys

BASE_URL = "http://localhost:5001"
TEST_PDF = "test_sample.pdf"

def test_endpoint(name, endpoint, params=None, need_file=True):
    """Test a single endpoint"""
    try:
        if need_file:
            with open(TEST_PDF, 'rb') as f:
                response = requests.post(
                    f"{BASE_URL}{endpoint}",
                    files={"file": f},
                    data=params or {},
                    timeout=10
                )
        else:
            response = requests.post(
                f"{BASE_URL}{endpoint}",
                data=params or {},
                timeout=10
            )
        
        if response.status_code == 200:
            print(f"✅ {name}")
            return True
        else:
            print(f"❌ {name} - Status {response.status_code}: {response.text[:100]}")
            return False
    except Exception as e:
        print(f"❌ {name} - Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧪 Testing 8 New PDF Endpoints...")
    print(f"📁 Test file: {TEST_PDF}")
    print(f"🌐 Backend: {BASE_URL}\n")
    
    if not os.path.exists(TEST_PDF):
        print(f"❌ Test file {TEST_PDF} not found!")
        sys.exit(1)
    
    results = []
    
    # Test 1: Watermark
    results.append(test_endpoint(
        "1. Watermark PDF",
        "/api/pdf/watermark-pdf",
        {"text": "CONFIDENTIAL", "position": "center", "opacity": "0.3"}
    ))
    
    # Test 2: Organize
    results.append(test_endpoint(
        "2. Organize PDF",
        "/api/pdf/organize-pdf",
        {"pageOrder": "3,1,4,2"}
    ))
    
    # Test 3: Extract Pages
    results.append(test_endpoint(
        "3. Extract Pages",
        "/api/pdf/extract-pages",
        {"pages": "1,3"}
    ))
    
    # Test 4: Add Page Numbers
    results.append(test_endpoint(
        "4. Add Page Numbers",
        "/api/pdf/add-page-numbers",
        {"position": "bottom-center", "fontSize": "12"}
    ))
    
    # Test 5: HTML to PDF
    results.append(test_endpoint(
        "5. HTML to PDF",
        "/api/pdf/html-to-pdf",
        {"html": "<h1>Test</h1><p>HTML to PDF</p>"},
        need_file=False
    ))
    
    # Test 6: PDF to PDF/A
    results.append(test_endpoint(
        "6. PDF to PDF/A",
        "/api/pdf/pdf-to-pdfa"
    ))
    
    # Test 7: PDF to JPG
    results.append(test_endpoint(
        "7. PDF to JPG",
        "/api/pdf/to-jpg",
        {"dpi": "72", "quality": "50"}
    ))
    
    # Test 8: OCR (if tesseract available)
    try:
        import subprocess
        subprocess.run(["which", "tesseract"], check=True, capture_output=True)
        results.append(test_endpoint(
            "8. OCR PDF",
            "/api/pdf/ocr-pdf"
        ))
    except:
        print("⚠️  8. OCR PDF - Skipped (tesseract not installed)")
    
    # Summary
    passed = sum(results)
    total = len(results)
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        sys.exit(0)
    else:
        print(f"⚠️  {total - passed} test(s) failed")
        sys.exit(1)
