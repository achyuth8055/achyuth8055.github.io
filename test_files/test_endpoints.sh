#!/bin/bash

echo "🧪 Testing 8 New PDF Endpoints..."
echo ""

cd "$(dirname "$0")"

# Test 1: Watermark
echo -n "1. Watermark PDF... "
if curl -s -X POST http://localhost:5001/api/pdf/watermark-pdf \
  -F "file=@test_sample.pdf" \
  -F "text=CONFIDENTIAL" \
  -F "position=center" \
  -F "opacity=0.3" \
  -o test_watermark.pdf 2>/dev/null && [ -f test_watermark.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 2: Organize PDF
echo -n "2. Organize PDF... "
if curl -s -X POST http://localhost:5001/api/pdf/organize-pdf \
  -F "file=@test_sample.pdf" \
  -F "pageOrder=3,1,4,2" \
  -o test_organized.pdf 2>/dev/null && [ -f test_organized.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 3: Extract Pages
echo -n "3. Extract Pages... "
if curl -s -X POST http://localhost:5001/api/pdf/extract-pages \
  -F "file=@test_sample.pdf" \
  -F "pages=1,3" \
  -o test_extracted.pdf 2>/dev/null && [ -f test_extracted.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 4: Add Page Numbers
echo -n "4. Add Page Numbers... "
if curl -s -X POST http://localhost:5001/api/pdf/add-page-numbers \
  -F "file=@test_sample.pdf" \
  -F "position=bottom-center" \
  -F "fontSize=12" \
  -o test_numbered.pdf 2>/dev/null && [ -f test_numbered.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 5: HTML to PDF
echo -n "5. HTML to PDF... "
if curl -s -X POST http://localhost:5001/api/pdf/html-to-pdf \
  -F "html=<h1>Test HTML</h1><p>This is a test</p>" \
  -o test_html.pdf 2>/dev/null && [ -f test_html.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 6: PDF to PDF/A
echo -n "6. PDF to PDF/A... "
if curl -s -X POST http://localhost:5001/api/pdf/pdf-to-pdfa \
  -F "file=@test_sample.pdf" \
  -o test_pdfa.pdf 2>/dev/null && [ -f test_pdfa.pdf ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 7: PDF to JPG (smaller DPI for speed)
echo -n "7. PDF to JPG... "
if curl -s -X POST http://localhost:5001/api/pdf/to-jpg \
  -F "file=@test_sample.pdf" \
  -F "dpi=72" \
  -F "quality=50" \
  -o test_jpg.zip 2>/dev/null && [ -f test_jpg.zip ]; then
  echo "✅ Success"
else
  echo "❌ Failed"
fi

# Test 8: OCR PDF (skip if tesseract not installed)
echo -n "8. OCR PDF... "
if which tesseract >/dev/null 2>&1; then
  if curl -s -X POST http://localhost:5001/api/pdf/ocr-pdf \
    -F "file=@test_sample.pdf" \
    -o test_ocr.pdf 2>/dev/null && [ -f test_ocr.pdf ]; then
    echo "✅ Success"
  else
    echo "❌ Failed"
  fi
else
  echo "⚠️  Skipped (tesseract not installed)"
fi

echo ""
echo "📊 Generated test files:"
ls -lh test_*.pdf test_*.zip 2>/dev/null | awk '{print "  " $9, "-", $5}'

echo ""
echo "✅ Testing complete!"
