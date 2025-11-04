# Integration Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     YOUR MAIN PROJECT                                │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  Option 1: Direct Function Call (Simplest)                   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │   │
│  │                                                               │   │
│  │  from pdf2docx_ui import convert_pdf_to_docx                 │   │
│  │  docx = convert_pdf_to_docx('input.pdf')                     │   │
│  │                                                               │   │
│  │  ✅ Use Case: Backend processing, automation                 │   │
│  │  ✅ Lines of Code: 2                                         │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  Option 2: Standalone UI (Quick Start)                       │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │   │
│  │                                                               │   │
│  │  from pdf2docx_ui import run_ui                              │   │
│  │  run_ui()                                                     │   │
│  │                                                               │   │
│  │  ✅ Use Case: Testing, standalone tool                       │   │
│  │  ✅ Lines of Code: 2                                         │   │
│  │  ✅ Result: Full web UI at http://127.0.0.1:5001            │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  Option 3: Flask Blueprint (Best for Integration)            │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │   │
│  │                                                               │   │
│  │  from flask import Flask                                     │   │
│  │  from pdf2docx_ui import create_converter_blueprint          │   │
│  │                                                               │   │
│  │  app = Flask(__name__)                                       │   │
│  │                                                               │   │
│  │  # Your routes                                               │   │
│  │  @app.route('/')                                             │   │
│  │  def home():                                                 │   │
│  │      return "Main App"                                       │   │
│  │                                                               │   │
│  │  # Add converter (2 lines)                                   │   │
│  │  converter = create_converter_blueprint(prefix='/converter') │   │
│  │  app.register_blueprint(converter)                           │   │
│  │                                                               │   │
│  │  ✅ Use Case: Add to existing Flask app                      │   │
│  │  ✅ Lines of Code: 2 (to add to existing app)               │   │
│  │  ✅ Result: PDF converter at /converter/                     │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  Option 4: Custom Flask App (Full Control)                   │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │   │
│  │                                                               │   │
│  │  from pdf2docx_ui import create_app                          │   │
│  │                                                               │   │
│  │  app = create_app(                                           │   │
│  │      upload_folder='./uploads',                              │   │
│  │      output_folder='./outputs',                              │   │
│  │      sample_folder='./samples',                              │   │
│  │      max_file_size=100 * 1024 * 1024                         │   │
│  │  )                                                            │   │
│  │                                                               │   │
│  │  # Add your middleware, auth, etc.                           │   │
│  │  @app.before_request                                         │   │
│  │  def check_auth():                                           │   │
│  │      # your auth logic                                       │   │
│  │      pass                                                     │   │
│  │                                                               │   │
│  │  app.run()                                                    │   │
│  │                                                               │   │
│  │  ✅ Use Case: Standalone service, full customization         │   │
│  │  ✅ Customization: Complete control                          │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                  ARCHITECTURE DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────┘

                        Your Application
                               │
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
            ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Function    │  │   Web UI     │  │  Blueprint   │
    │    Call      │  │  (Standalone)│  │  (Add to     │
    │              │  │              │  │  Flask App)  │
    └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
           │                 │                  │
           └─────────────────┼──────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │  pdf2docx_ui.py  │
                   │  (Integration    │
                   │   Module)        │
                   └─────────┬────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   pdf2docx       │
                   │   (Core Library) │
                   └─────────┬────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   PyMuPDF        │
                   │   (PDF Parser)   │
                   └──────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    COMPARISON TABLE                                   │
└─────────────────────────────────────────────────────────────────────┘

╔═══════════════╤═══════════╤══════════════╤═══════════════════════╗
║ Method        │ Lines     │ Complexity   │ Best For              ║
╠═══════════════╪═══════════╪══════════════╪═══════════════════════╣
║ Function Call │ 2         │ ⭐ Easy      │ Backend processing    ║
║               │           │              │ Automation scripts    ║
╟───────────────┼───────────┼──────────────┼───────────────────────╢
║ Standalone UI │ 2         │ ⭐ Easy      │ Quick testing         ║
║               │           │              │ Demo purposes         ║
╟───────────────┼───────────┼──────────────┼───────────────────────╢
║ Blueprint     │ 2         │ ⭐⭐ Medium  │ Existing Flask app    ║
║               │ (to add)  │              │ Modular integration   ║
╟───────────────┼───────────┼──────────────┼───────────────────────╢
║ Custom App    │ 10-20     │ ⭐⭐ Medium  │ Standalone service    ║
║               │           │              │ Full customization    ║
╚═══════════════╧═══════════╧══════════════╧═══════════════════════╝


┌─────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                          │
└─────────────────────────────────────────────────────────────────────┘

User/Code
   │
   │  PDF File
   ▼
┌─────────────────┐
│  Your Code      │──┐
│  or Web UI      │  │
└─────────────────┘  │
                     │
   ┌─────────────────┘
   │
   │  convert_pdf_to_docx(pdf_path)
   ▼
┌─────────────────────┐
│  pdf2docx_ui.py     │
│  - Validate input   │
│  - Handle errors    │
│  - Call converter   │
└──────────┬──────────┘
           │
           │  Converter(pdf_path).convert(docx_path)
           ▼
┌─────────────────────┐
│  pdf2docx library   │
│  - Parse PDF        │
│  - Extract content  │
│  - Generate DOCX    │
└──────────┬──────────┘
           │
           │  Read PDF structure
           ▼
┌─────────────────────┐
│  PyMuPDF            │
│  - Open PDF         │
│  - Extract text     │
│  - Get images       │
└──────────┬──────────┘
           │
           │  DOCX File
           ▼
User/Code receives
converted file


┌─────────────────────────────────────────────────────────────────────┐
│                  FILE STRUCTURE                                       │
└─────────────────────────────────────────────────────────────────────┘

your_project/
│
├── your_app.py                 ← Your main application
│
├── pdf2docx_ui.py             ← Copy this file (main module)
│
├── templates/                  ← Copy this folder (for web UI)
│   └── index.html
│
├── uploads/                    ← Created automatically
│   └── (uploaded PDFs)
│
├── outputs/                    ← Created automatically
│   └── (converted DOCX files)
│
└── samples/                    ← Optional
    └── (sample PDF files)


┌─────────────────────────────────────────────────────────────────────┐
│                  DEPLOYMENT OPTIONS                                   │
└─────────────────────────────────────────────────────────────────────┘

Development:
┌────────────────────────────────────────┐
│  python pdf2docx_ui.py                 │
│  Flask development server              │
└────────────────────────────────────────┘

Production:
┌────────────────────────────────────────┐
│  gunicorn -w 4 -b 0.0.0.0:8000 app:app │
│  WSGI server with multiple workers     │
└────────────────────────────────────────┘

With Nginx:
┌────────────────────────────────────────┐
│  nginx → gunicorn → Flask app          │
│  Reverse proxy + WSGI + Application    │
└────────────────────────────────────────┘

Docker:
┌────────────────────────────────────────┐
│  docker run -p 8000:8000 pdf-converter │
│  Containerized deployment              │
└────────────────────────────────────────┘

Cloud:
┌────────────────────────────────────────┐
│  Heroku / AWS / GCP / Azure            │
│  Platform as a Service                 │
└────────────────────────────────────────┘
```

## Summary

**4 Integration Methods:**

1. **Function Call** - Simplest, for backend use
2. **Standalone UI** - Quick start, for testing
3. **Flask Blueprint** - Best for adding to existing apps
4. **Custom App** - Full control and customization

**All methods are:**
- ✅ Simple (2-20 lines of code)
- ✅ Well documented
- ✅ Fully tested
- ✅ Production ready

**Choose based on your needs:**
- Need conversion in code? → **Function Call**
- Need quick demo? → **Standalone UI**
- Have Flask app? → **Blueprint**
- Need full control? → **Custom App**
