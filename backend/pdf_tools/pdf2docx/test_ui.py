"""
Flask-based Web UI for PDF to DOCX Conversion Testing
This provides a modern, easy-to-use interface for testing pdf2docx functionality.
"""

from flask import Flask, render_template, request, send_file, jsonify, url_for
import os
import tempfile
from werkzeug.utils import secure_filename
from pdf2docx import Converter
import shutil
from datetime import datetime

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()
app.config['OUTPUT_FOLDER'] = tempfile.mkdtemp()

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Main page with file upload interface."""
    # Get list of sample PDFs
    sample_dir = os.path.join(os.path.dirname(__file__), 'test', 'samples')
    sample_files = []
    if os.path.exists(sample_dir):
        sample_files = [f for f in os.listdir(sample_dir) if f.endswith('.pdf')]
        sample_files.sort()
    
    return render_template('index.html', sample_files=sample_files)

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and conversion."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only PDF files are allowed'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{timestamp}_{filename}")
        file.save(pdf_path)
        
        # Convert to DOCX
        docx_filename = filename.rsplit('.', 1)[0] + '.docx'
        docx_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{timestamp}_{docx_filename}")
        
        # Perform conversion
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        # Return download link
        return jsonify({
            'success': True,
            'message': 'Conversion successful!',
            'download_url': url_for('download_file', filename=os.path.basename(docx_path)),
            'original_filename': filename,
            'output_filename': docx_filename
        })
    
    except Exception as e:
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

@app.route('/convert-sample/<filename>')
def convert_sample(filename):
    """Convert a sample PDF file."""
    try:
        sample_dir = os.path.join(os.path.dirname(__file__), 'test', 'samples')
        pdf_path = os.path.join(sample_dir, filename)
        
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'Sample file not found'}), 404
        
        # Convert to DOCX
        docx_filename = filename.rsplit('.', 1)[0] + '.docx'
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        docx_path = os.path.join(app.config['OUTPUT_FOLDER'], f"{timestamp}_{docx_filename}")
        
        # Perform conversion
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
        
        # Return download link
        return jsonify({
            'success': True,
            'message': 'Conversion successful!',
            'download_url': url_for('download_file', filename=os.path.basename(docx_path)),
            'original_filename': filename,
            'output_filename': docx_filename
        })
    
    except Exception as e:
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Download the converted DOCX file."""
    try:
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        if not os.path.exists(file_path):
            return "File not found", 404
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=filename.split('_', 1)[1] if '_' in filename else filename
        )
    except Exception as e:
        return f"Error downloading file: {str(e)}", 500

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Clean up temporary files."""
    try:
        # Clean upload folder
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        
        # Clean output folder
        for filename in os.listdir(app.config['OUTPUT_FOLDER']):
            file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        
        return jsonify({'success': True, 'message': 'Temporary files cleaned up'})
    except Exception as e:
        return jsonify({'error': f'Cleanup failed: {str(e)}'}), 500

if __name__ == '__main__':
    # Create templates directory
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    os.makedirs(templates_dir, exist_ok=True)
    
    print("\n" + "="*60)
    print("PDF to DOCX Converter - Web UI")
    print("="*60)
    print(f"\n📂 Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"📂 Output folder: {app.config['OUTPUT_FOLDER']}")
    print(f"\n🌐 Starting server at: http://127.0.0.1:5000")
    print("\nPress Ctrl+C to stop the server\n")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
