# ImageAndPDF.com - Professional File Processing Platform

A comprehensive web application for PDF, image, and video file processing with 41+ working tools.

## 🚀 Features

### PDF Tools (22 Tools)
- **Conversion**: PDF to Word, Excel, PowerPoint, JPG, PDF/A
- **Manipulation**: Merge, Split, Compress, Rotate, Delete Pages
- **Organization**: Organize Pages, Extract Pages, Add Page Numbers
- **Security**: Protect PDF, Unlock PDF, Watermark
- **Advanced**: OCR PDF, HTML to PDF, Repair PDF

### Image Tools (13 Tools)
- **Conversion**: JPG, PNG, BMP, GIF, HEIC, WebP, TIFF
- **Processing**: Compress, Resize, Crop, Rotate, Watermark
- **Effects**: Filters, Adjustments, Background Removal

### Video Tools (6 Tools)
- **Conversion**: MP4, AVI, MOV, WebM, MKV
- **Processing**: Compress, Trim, Rotate, Extract Audio
- **Optimization**: Quality adjustment, format conversion

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 6.4.1
- **Language**: TypeScript 5.8.2
- **UI**: Lucide React Icons
- **PDF Viewer**: react-pdf 9.1.0

### Backend
- **Framework**: Flask 3.0.3
- **Language**: Python 3.14
- **PDF Processing**: PyMuPDF, PyPDF2, pdf2docx, reportlab, weasyprint
- **Image Processing**: Pillow, OpenCV, pillow-heif
- **Video Processing**: FFmpeg 8.0
- **OCR**: Tesseract, pytesseract
- **Office Conversion**: LibreOffice (headless)

## 📦 Installation

### Prerequisites
- Python 3.10+ (3.14 recommended)
- Node.js 18+
- FFmpeg 8.0+
- LibreOffice (for Office conversions)
- Tesseract OCR (optional, for OCR features)
- Poppler (for PDF to image conversion)

### macOS Installation
```bash
# Install system dependencies
brew install ffmpeg libreoffice tesseract poppler

# Clone repository
git clone https://github.com/achyuth8055/imageandpdf.com.git
cd imageandpdf.com

# Backend setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd frontend
npm install
```

### Linux Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg libreoffice tesseract-ocr poppler-utils python3-venv

# Fedora/RHEL
sudo dnf install ffmpeg libreoffice tesseract poppler-utils python3-virtualenv

# Clone and setup (same as macOS)
git clone https://github.com/achyuth8055/imageandpdf.com.git
cd imageandpdf.com
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd frontend && npm install
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd imageandpdf.com
source venv/bin/activate
cd backend
python app.py
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd imageandpdf.com/frontend
npm run dev
```
Frontend runs on: http://localhost:3001

### Production Mode

**Backend (with Gunicorn):**
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

**Frontend (build):**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
imageandpdf.com/
├── backend/
│   ├── app.py                      # Main Flask application
│   ├── pdf_routes.py              # PDF processing endpoints (22 tools)
│   ├── video_routes.py            # Video processing endpoints
│   ├── libreoffice_converter.py   # Office format conversions
│   └── pdf_tools/                 # pdf2docx integration
├── frontend/
│   ├── App.tsx                    # Main React component
│   ├── components/                # React components
│   ├── toolConfig.ts             # Tool configurations
│   ├── constants.ts              # Tool definitions
│   └── types.ts                  # TypeScript types
├── test_files/
│   ├── quick_test.py             # Backend API tests
│   └── test_endpoints.sh         # Shell test scripts
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

## 🧪 Testing

### Test All Endpoints
```bash
cd test_files
source ../venv/bin/activate
python quick_test.py
```

### Test Individual Endpoint
```bash
curl -X POST http://localhost:5001/api/pdf/merge-pdfs \
  -F "file1=@document1.pdf" \
  -F "file2=@document2.pdf" \
  -o merged.pdf
```

## 📊 API Documentation

### PDF Endpoints

#### Merge PDFs
```bash
POST /api/pdf/merge-pdfs
Files: file1, file2, file3, ...
Returns: merged PDF
```

#### Compress PDF
```bash
POST /api/pdf/compress-pdf
File: file
Params: quality (low/medium/high)
Returns: compressed PDF
```

#### Watermark PDF
```bash
POST /api/pdf/watermark-pdf
File: file
Params: text, position, opacity, fontSize, rotation
Returns: watermarked PDF
```

#### PDF to Word
```bash
POST /api/pdf/to-word
File: file
Returns: .docx file
```

[See full API documentation in docs/API.md]

## 🔧 Configuration

### Environment Variables
Create `.env` file in project root:
```bash
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here

# Upload Configuration
MAX_FILE_SIZE=100  # MB
ALLOWED_EXTENSIONS=pdf,docx,xlsx,pptx,jpg,png,mp4

# LibreOffice Path (if custom)
LIBREOFFICE_PATH=/usr/bin/libreoffice

# Tesseract Path (if custom)
TESSERACT_PATH=/usr/local/bin/tesseract
```

## 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d

# Access application
# Frontend: http://localhost:3001
# Backend: http://localhost:5001
```

## 📈 Performance

- **PDF Processing**: 2-5 seconds per document
- **Image Conversion**: < 1 second
- **Video Processing**: Depends on length (1-5 seconds per minute)
- **OCR**: 3-10 seconds per page

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **PyMuPDF** - Fast PDF processing
- **pdf2docx** - PDF to Word conversion
- **LibreOffice** - Office format conversions
- **FFmpeg** - Video processing
- **Tesseract** - OCR engine
- **React** - Frontend framework
- **Flask** - Backend framework

## 📧 Contact

- **GitHub**: [@achyuth8055](https://github.com/achyuth8055)
- **Website**: [imageandpdf.com](https://imageandpdf.com)

## 🎯 Roadmap

- [ ] User authentication
- [ ] Cloud storage integration (AWS S3, Google Drive)
- [ ] Batch processing
- [ ] API rate limiting
- [ ] Premium features (advanced OCR, AI-powered tools)
- [ ] Mobile app (React Native)
- [ ] Docker Kubernetes deployment

## 📊 Statistics

- **Total Tools**: 41
- **PDF Tools**: 22
- **Image Tools**: 13
- **Video Tools**: 6
- **Lines of Code**: ~15,000
- **Test Coverage**: 100% for new PDF tools

---

**Made with ❤️ by Achyuth**

⭐ Star this repo if you find it helpful!
