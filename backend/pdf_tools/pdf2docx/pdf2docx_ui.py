"""
PDF to DOCX Conversion Web UI Module
=====================================

This module provides a ready-to-use Flask web interface for PDF to DOCX conversion.
Can be easily integrated into any Python project with just a few lines of code.

Usage Examples:
---------------

1. Simple standalone usage:
    ```python
    from pdf2docx_ui import create_app, run_ui
    
    # Quick start
    run_ui()  # Starts server on http://127.0.0.1:5001
    ```

2. Custom configuration:
    ```python
    from pdf2docx_ui import create_app
    
    app = create_app(
        upload_folder='/path/to/uploads',
        output_folder='/path/to/outputs',
        sample_folder='/path/to/samples',
        max_file_size=100 * 1024 * 1024  # 100MB
    )
    app.run(host='0.0.0.0', port=8080)
    ```

3. Integration with existing Flask app:
    ```python
    from flask import Flask
    from pdf2docx_ui import create_converter_blueprint
    
    app = Flask(__name__)
    
    # Register the converter blueprint
    converter_bp = create_converter_blueprint(prefix='/converter')
    app.register_blueprint(converter_bp)
    
    app.run()
    # Now accessible at: http://localhost:5000/converter/
    ```

4. Programmatic conversion (no UI):
    ```python
    from pdf2docx_ui import convert_pdf_to_docx
    
    # Simple conversion
    convert_pdf_to_docx('input.pdf', 'output.docx')
    
    # Or with status callback
    def on_progress(message):
        print(f"Status: {message}")
    
    convert_pdf_to_docx('input.pdf', 'output.docx', callback=on_progress)
    ```
"""

from flask import Flask, render_template, request, send_file, jsonify, url_for, Blueprint
import os
import tempfile
from werkzeug.utils import secure_filename
from datetime import datetime
from typing import Optional, Callable

__version__ = '1.0.0'
__all__ = ['create_app', 'run_ui', 'create_converter_blueprint', 'convert_pdf_to_docx']

# Default configuration
DEFAULT_CONFIG = {
    'MAX_FILE_SIZE': 50 * 1024 * 1024,  # 50MB
    'ALLOWED_EXTENSIONS': {'pdf'},
    'HOST': '0.0.0.0',
    'PORT': 5001,
    'DEBUG': True
}


def convert_pdf_to_docx(
    pdf_path: str,
    docx_path: Optional[str] = None,
    callback: Optional[Callable[[str], None]] = None
) -> str:
    """
    Convert a PDF file to DOCX format programmatically.
    
    Args:
        pdf_path: Path to input PDF file
        docx_path: Path for output DOCX file (optional, auto-generates if None)
        callback: Optional callback function for progress updates
        
    Returns:
        Path to the generated DOCX file
        
    Raises:
        FileNotFoundError: If PDF file doesn't exist
        Exception: If conversion fails
        
    Example:
        >>> docx = convert_pdf_to_docx('document.pdf')
        >>> print(f"Converted to: {docx}")
    """
    from pdf2docx import Converter
    
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")
    
    # Generate output path if not provided
    if docx_path is None:
        docx_path = pdf_path.rsplit('.', 1)[0] + '.docx'
    
    if callback:
        callback(f"Starting conversion: {os.path.basename(pdf_path)}")
    
    try:
        cv = Converter(pdf_path)
        if callback:
            callback("Converting PDF to DOCX...")
        cv.convert(docx_path)
        cv.close()
        
        if callback:
            callback(f"Conversion complete: {os.path.basename(docx_path)}")
        
        return docx_path
    
    except Exception as e:
        if callback:
            callback(f"Conversion failed: {str(e)}")
        raise


def _allowed_file(filename: str, allowed_extensions: set) -> bool:
    """Check if file has allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions


def create_converter_blueprint(
    upload_folder: Optional[str] = None,
    output_folder: Optional[str] = None,
    sample_folder: Optional[str] = None,
    max_file_size: int = DEFAULT_CONFIG['MAX_FILE_SIZE'],
    allowed_extensions: set = DEFAULT_CONFIG['ALLOWED_EXTENSIONS'],
    prefix: str = ''
) -> Blueprint:
    """
    Create a Flask Blueprint for PDF to DOCX conversion.
    Can be registered to an existing Flask application.
    
    Args:
        upload_folder: Folder for uploaded files (temp folder if None)
        output_folder: Folder for converted files (temp folder if None)
        sample_folder: Folder with sample PDF files (None to disable)
        max_file_size: Maximum upload size in bytes
        allowed_extensions: Set of allowed file extensions
        prefix: URL prefix for the blueprint (e.g., '/converter')
        
    Returns:
        Flask Blueprint ready to be registered
        
    Example:
        >>> from flask import Flask
        >>> from pdf2docx_ui import create_converter_blueprint
        >>> 
        >>> app = Flask(__name__)
        >>> bp = create_converter_blueprint(prefix='/pdf-converter')
        >>> app.register_blueprint(bp)
    """
    bp = Blueprint('pdf_converter', __name__, url_prefix=prefix,
                   template_folder='templates', static_folder='static')
    
    # Initialize folders
    upload_folder = upload_folder or tempfile.mkdtemp()
    output_folder = output_folder or tempfile.mkdtemp()
    
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(output_folder, exist_ok=True)
    
    @bp.route('/')
    def index():
        """Main page with file upload interface."""
        sample_files = []
        if sample_folder and os.path.exists(sample_folder):
            sample_files = [f for f in os.listdir(sample_folder) if f.endswith('.pdf')]
            sample_files.sort()
        
        return render_template('index.html', sample_files=sample_files)
    
    @bp.route('/upload', methods=['POST'])
    def upload_file():
        """Handle file upload and conversion."""
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not _allowed_file(file.filename, allowed_extensions):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        try:
            from pdf2docx import Converter
            
            # Save uploaded file
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            pdf_path = os.path.join(upload_folder, f"{timestamp}_{filename}")
            file.save(pdf_path)
            
            # Convert to DOCX
            docx_filename = filename.rsplit('.', 1)[0] + '.docx'
            docx_path = os.path.join(output_folder, f"{timestamp}_{docx_filename}")
            
            # Perform conversion
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()
            
            return jsonify({
                'success': True,
                'message': 'Conversion successful!',
                'download_url': url_for('pdf_converter.download_file', 
                                       filename=os.path.basename(docx_path)),
                'original_filename': filename,
                'output_filename': docx_filename
            })
        
        except Exception as e:
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
    
    @bp.route('/convert-sample/<filename>')
    def convert_sample(filename):
        """Convert a sample PDF file."""
        try:
            from pdf2docx import Converter
            
            if not sample_folder:
                return jsonify({'error': 'Sample folder not configured'}), 404
            
            pdf_path = os.path.join(sample_folder, filename)
            
            if not os.path.exists(pdf_path):
                return jsonify({'error': 'Sample file not found'}), 404
            
            # Convert to DOCX
            docx_filename = filename.rsplit('.', 1)[0] + '.docx'
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            docx_path = os.path.join(output_folder, f"{timestamp}_{docx_filename}")
            
            # Perform conversion
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()
            
            return jsonify({
                'success': True,
                'message': 'Conversion successful!',
                'download_url': url_for('pdf_converter.download_file', 
                                       filename=os.path.basename(docx_path)),
                'original_filename': filename,
                'output_filename': docx_filename
            })
        
        except Exception as e:
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
    
    @bp.route('/download/<filename>')
    def download_file(filename):
        """Download the converted DOCX file."""
        try:
            file_path = os.path.join(output_folder, filename)
            if not os.path.exists(file_path):
                return "File not found", 404
            
            return send_file(
                file_path,
                as_attachment=True,
                download_name=filename.split('_', 1)[1] if '_' in filename else filename
            )
        except Exception as e:
            return f"Error downloading file: {str(e)}", 500
    
    @bp.route('/cleanup', methods=['POST'])
    def cleanup():
        """Clean up temporary files."""
        try:
            for filename in os.listdir(upload_folder):
                file_path = os.path.join(upload_folder, filename)
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            
            for filename in os.listdir(output_folder):
                file_path = os.path.join(output_folder, filename)
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            
            return jsonify({'success': True, 'message': 'Temporary files cleaned up'})
        except Exception as e:
            return jsonify({'error': f'Cleanup failed: {str(e)}'}), 500
    
    return bp


def create_app(
    upload_folder: Optional[str] = None,
    output_folder: Optional[str] = None,
    sample_folder: Optional[str] = None,
    max_file_size: int = DEFAULT_CONFIG['MAX_FILE_SIZE'],
    allowed_extensions: set = DEFAULT_CONFIG['ALLOWED_EXTENSIONS']
) -> Flask:
    """
    Create a standalone Flask application for PDF to DOCX conversion.
    
    Args:
        upload_folder: Folder for uploaded files (temp folder if None)
        output_folder: Folder for converted files (temp folder if None)
        sample_folder: Folder with sample PDF files (auto-detect if None)
        max_file_size: Maximum upload size in bytes
        allowed_extensions: Set of allowed file extensions
        
    Returns:
        Configured Flask application ready to run
        
    Example:
        >>> app = create_app(sample_folder='/path/to/samples')
        >>> app.run(host='0.0.0.0', port=8080)
    """
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config['MAX_CONTENT_LENGTH'] = max_file_size
    
    # Auto-detect sample folder if not provided
    if sample_folder is None:
        potential_sample = os.path.join(os.path.dirname(__file__), 'test', 'samples')
        if os.path.exists(potential_sample):
            sample_folder = potential_sample
    
    # Create and register blueprint
    bp = create_converter_blueprint(
        upload_folder=upload_folder,
        output_folder=output_folder,
        sample_folder=sample_folder,
        max_file_size=max_file_size,
        allowed_extensions=allowed_extensions
    )
    
    app.register_blueprint(bp)
    
    return app


def run_ui(
    host: str = DEFAULT_CONFIG['HOST'],
    port: int = DEFAULT_CONFIG['PORT'],
    debug: bool = DEFAULT_CONFIG['DEBUG'],
    **kwargs
):
    """
    Quick start method to run the PDF to DOCX converter UI.
    
    Args:
        host: Host to bind to (default: '0.0.0.0')
        port: Port to run on (default: 5001)
        debug: Enable debug mode (default: True)
        **kwargs: Additional arguments passed to create_app()
        
    Example:
        >>> from pdf2docx_ui import run_ui
        >>> run_ui(port=8080)
    """
    app = create_app(**kwargs)
    
    print("\n" + "="*60)
    print("PDF to DOCX Converter - Web UI")
    print("="*60)
    print(f"\n🌐 Starting server at: http://127.0.0.1:{port}")
    print("\nPress Ctrl+C to stop the server\n")
    print("="*60 + "\n")
    
    app.run(host=host, port=port, debug=debug)


# CLI entry point
if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--port':
        port = int(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_CONFIG['PORT']
        run_ui(port=port)
    else:
        run_ui()
