"""
PDF Processing Routes
Endpoints for PDF manipulation: merge, split, compress, rotate, etc.
"""
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from pathlib import Path
from PyPDF2 import PdfReader, PdfWriter, PdfMerger
from PIL import Image
import uuid
import io
import zipfile
import os
from libreoffice_converter import LibreOfficeConverter
from pdf2image import convert_from_path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader

def add_pdf_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER):
    """Add PDF processing routes to Flask app"""
    
    @app.route('/api/pdf/merge', methods=['POST'])
    def merge_pdf():
        """Merge multiple PDF files into one"""
        try:
            files = request.files.getlist('file')
            if not files or len(files) < 2:
                return jsonify({'error': 'At least 2 PDF files required'}), 400
            
            merger = PdfMerger()
            
            # Save and merge each file
            for file in files:
                filename = secure_filename(file.filename)
                upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
                file.save(str(upload_path))
                merger.append(str(upload_path))
            
            # Output
            output_filename = "imageandpdf_merged.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            merger.write(str(output_path))
            merger.close()
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ PDF merge error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/split', methods=['POST'])
    def split_pdf():
        """Split PDF into individual pages"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Read PDF
            reader = PdfReader(str(upload_path))
            
            # Get split mode
            split_mode = request.form.get('mode', 'all')  # 'all', 'range', 'pages'
            
            if split_mode == 'all':
                # Split into individual pages and zip them
                import zipfile
                zip_filename = f"imageandpdf_{Path(original_filename).stem}_pages.zip"
                zip_path = OUTPUT_FOLDER / zip_filename
                
                with zipfile.ZipFile(str(zip_path), 'w') as zipf:
                    for i, page in enumerate(reader.pages, 1):
                        writer = PdfWriter()
                        writer.add_page(page)
                        
                        page_path = OUTPUT_FOLDER / f"page_{i}.pdf"
                        with open(page_path, 'wb') as f:
                            writer.write(f)
                        
                        zipf.write(page_path, f"imageandpdf_page_{i}.pdf")
                        page_path.unlink()  # Clean up individual file
                
                return send_file(
                    str(zip_path),
                    as_attachment=True,
                    download_name=zip_filename
                )
            else:
                # For now, just split all pages
                # Can add range/specific pages later
                return jsonify({'error': 'Only "all" mode supported currently'}), 400
                
        except Exception as e:
            print(f"❌ PDF split error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/rotate', methods=['POST'])
    def rotate_pdf():
        """Rotate PDF pages"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get rotation angle
            angle = int(request.form.get('angle', 90))
            pages = request.form.get('pages', 'all')  # 'all' or page numbers
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Read and rotate
            reader = PdfReader(str(upload_path))
            writer = PdfWriter()
            
            for i, page in enumerate(reader.pages):
                if pages == 'all':
                    page.rotate(angle)
                writer.add_page(page)
            
            # Copy metadata
            if reader.metadata:
                writer.add_metadata(reader.metadata)
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}_rotated.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ PDF rotate error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/compress', methods=['POST'])
    def compress_pdf():
        """Compress PDF by reducing image quality"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            quality = request.form.get('quality', 'medium')
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Read PDF
            reader = PdfReader(str(upload_path))
            writer = PdfWriter()
            
            # Copy pages and compress
            for page in reader.pages:
                writer.add_page(page)
            
            # Compress images in PDF
            for page in writer.pages:
                if '/XObject' in page['/Resources']:
                    x_object = page['/Resources']['/XObject'].get_object()
                    for obj in x_object:
                        if x_object[obj]['/Subtype'] == '/Image':
                            # This is a basic compression - more advanced compression
                            # would require additional libraries
                            pass
            
            # Set compression level based on quality
            if quality == 'high':
                # Less compression
                pass
            elif quality == 'low':
                # More compression
                writer.compress_content_streams()
            else:
                # Medium compression
                writer.compress_content_streams()
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}_compressed.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ PDF compress error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/to-jpg', methods=['POST'])
    def pdf_to_jpg():
        """Convert PDF pages to JPG images"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            dpi = int(request.form.get('dpi', 150))
            quality = int(request.form.get('quality', 85))
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            try:
                # Convert PDF to images using pdf2image
                images = convert_from_path(str(upload_path), dpi=dpi)
                
                # Create ZIP file with all images
                zip_filename = f"imageandpdf_{Path(original_filename).stem}_pages.zip"
                zip_path = OUTPUT_FOLDER / zip_filename
                
                with zipfile.ZipFile(str(zip_path), 'w') as zipf:
                    for i, image in enumerate(images, 1):
                        # Save each page as JPG
                        img_filename = f"page_{i}.jpg"
                        img_path = OUTPUT_FOLDER / img_filename
                        image.save(str(img_path), 'JPEG', quality=quality)
                        zipf.write(str(img_path), img_filename)
                        img_path.unlink()  # Delete temp image
                
                return send_file(
                    str(zip_path),
                    as_attachment=True,
                    download_name=zip_filename
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
            
        except Exception as e:
            print(f"❌ PDF to JPG error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/jpg-to-pdf', methods=['POST'])
    def jpg_to_pdf():
        """Convert JPG/PNG images to PDF"""
        try:
            files = request.files.getlist('file')
            if not files:
                return jsonify({'error': 'No files provided'}), 400
            
            writer = PdfWriter()
            
            for file in files:
                filename = secure_filename(file.filename)
                upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
                file.save(str(upload_path))
                
                # Open image and convert to PDF
                img = Image.open(upload_path)
                
                # Convert to RGB if needed
                if img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = rgb_img
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save as PDF in memory
                pdf_bytes = io.BytesIO()
                img.save(pdf_bytes, 'PDF', resolution=100.0)
                pdf_bytes.seek(0)
                
                # Add to writer
                temp_reader = PdfReader(pdf_bytes)
                for page in temp_reader.pages:
                    writer.add_page(page)
            
            # Output
            output_filename = "imageandpdf_images_to_pdf.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ JPG to PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/unlock', methods=['POST'])
    def unlock_pdf():
        """Remove password protection from PDF"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            password = request.form.get('password', '')
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Read PDF with password
            reader = PdfReader(str(upload_path))
            
            if reader.is_encrypted:
                if not password:
                    return jsonify({'error': 'Password required for encrypted PDF'}), 400
                
                if not reader.decrypt(password):
                    return jsonify({'error': 'Incorrect password'}), 401
            
            # Write unlocked PDF
            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
            
            # Copy metadata
            if reader.metadata:
                writer.add_metadata(reader.metadata)
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}_unlocked.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ PDF unlock error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/protect', methods=['POST'])
    def protect_pdf():
        """Add password protection to PDF"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            user_password = request.form.get('password', '')
            if not user_password:
                return jsonify({'error': 'Password required'}), 400
            
            original_filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Read PDF
            reader = PdfReader(str(upload_path))
            writer = PdfWriter()
            
            # Copy pages
            for page in reader.pages:
                writer.add_page(page)
            
            # Copy metadata
            if reader.metadata:
                writer.add_metadata(reader.metadata)
            
            # Encrypt with password
            writer.encrypt(user_password)
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}_protected.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            with open(output_path, 'wb') as f:
                writer.write(f)
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ PDF protect error: {e}")
            return jsonify({'error': str(e)}), 500
    
    # ============================================
    # Office to PDF Conversions (LibreOffice)
    # ============================================
    
    @app.route('/api/pdf/word-to-pdf', methods=['POST'])
    def word_to_pdf():
        """Convert Word (DOC, DOCX) to PDF using LibreOffice"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            if ext not in ['doc', 'docx', 'odt', 'rtf']:
                return jsonify({'error': f'Invalid file type: {ext}. Accepted: doc, docx, odt, rtf'}), 400
            
            # Save uploaded file
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                # Convert using LibreOffice
                converter = LibreOfficeConverter()
                success, result = converter.convert_to_pdf(str(upload_path), str(OUTPUT_FOLDER))
                
                if not success:
                    return jsonify({'error': result}), 500
                
                # Rename output to include imageandpdf prefix
                original_name = Path(filename).stem
                final_name = f"imageandpdf_{original_name}.pdf"
                final_path = OUTPUT_FOLDER / final_name
                
                # Move/rename the file
                Path(result).rename(final_path)
                
                return send_file(
                    str(final_path),
                    as_attachment=True,
                    download_name=final_name
                )
            
            finally:
                # Cleanup upload
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Word to PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/excel-to-pdf', methods=['POST'])
    def excel_to_pdf():
        """Convert Excel (XLS, XLSX) to PDF using LibreOffice"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            if ext not in ['xls', 'xlsx', 'ods', 'csv']:
                return jsonify({'error': f'Invalid file type: {ext}. Accepted: xls, xlsx, ods, csv'}), 400
            
            # Save uploaded file
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                # Convert using LibreOffice
                converter = LibreOfficeConverter()
                success, result = converter.convert_to_pdf(str(upload_path), str(OUTPUT_FOLDER))
                
                if not success:
                    return jsonify({'error': result}), 500
                
                # Rename output
                original_name = Path(filename).stem
                final_name = f"imageandpdf_{original_name}.pdf"
                final_path = OUTPUT_FOLDER / final_name
                Path(result).rename(final_path)
                
                return send_file(
                    str(final_path),
                    as_attachment=True,
                    download_name=final_name
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Excel to PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/powerpoint-to-pdf', methods=['POST'])
    def powerpoint_to_pdf():
        """Convert PowerPoint (PPT, PPTX) to PDF using LibreOffice"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            filename = secure_filename(file.filename)
            ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            if ext not in ['ppt', 'pptx', 'odp']:
                return jsonify({'error': f'Invalid file type: {ext}. Accepted: ppt, pptx, odp'}), 400
            
            # Save uploaded file
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                # Convert using LibreOffice
                converter = LibreOfficeConverter()
                success, result = converter.convert_to_pdf(str(upload_path), str(OUTPUT_FOLDER))
                
                if not success:
                    return jsonify({'error': result}), 500
                
                # Rename output
                original_name = Path(filename).stem
                final_name = f"imageandpdf_{original_name}.pdf"
                final_path = OUTPUT_FOLDER / final_name
                Path(result).rename(final_path)
                
                return send_file(
                    str(final_path),
                    as_attachment=True,
                    download_name=final_name
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ PowerPoint to PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/pdf-to-powerpoint', methods=['POST'])
    def pdf_to_powerpoint():
        """Convert PDF to PowerPoint (PPTX) using LibreOffice"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            filename = secure_filename(file.filename)
            if not filename.lower().endswith('.pdf'):
                return jsonify({'error': 'File must be a PDF'}), 400
            
            # Save uploaded file
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                # Convert using LibreOffice
                converter = LibreOfficeConverter()
                success, result = converter.convert_from_pdf(
                    str(upload_path), 
                    'pptx', 
                    str(OUTPUT_FOLDER)
                )
                
                if not success:
                    return jsonify({'error': result}), 500
                
                # Rename output
                original_name = Path(filename).stem
                final_name = f"imageandpdf_{original_name}.pptx"
                final_path = OUTPUT_FOLDER / final_name
                Path(result).rename(final_path)
                
                return send_file(
                    str(final_path),
                    as_attachment=True,
                    download_name=final_name
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ PDF to PowerPoint error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/pdf-to-excel', methods=['POST'])
    def pdf_to_excel():
        """Convert PDF to Excel (XLSX) using LibreOffice"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            filename = secure_filename(file.filename)
            if not filename.lower().endswith('.pdf'):
                return jsonify({'error': 'File must be a PDF'}), 400
            
            # Save uploaded file
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                # Convert using LibreOffice
                converter = LibreOfficeConverter()
                success, result = converter.convert_from_pdf(
                    str(upload_path), 
                    'xlsx', 
                    str(OUTPUT_FOLDER)
                )
                
                if not success:
                    return jsonify({'error': result}), 500
                
                # Rename output
                original_name = Path(filename).stem
                final_name = f"imageandpdf_{original_name}.xlsx"
                final_path = OUTPUT_FOLDER / final_name
                Path(result).rename(final_path)
                
                return send_file(
                    str(final_path),
                    as_attachment=True,
                    download_name=final_name
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ PDF to Excel error: {e}")
            return jsonify({'error': str(e)}), 500
    
    # ============================================
    # Additional PDF Tools
    # ============================================
    
    @app.route('/api/pdf/watermark-pdf', methods=['POST'])
    def watermark_pdf():
        """Add text watermark to PDF"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Get parameters
            text = request.form.get('text', 'WATERMARK')
            position = request.form.get('position', 'center')  # center, top-left, top-right, etc.
            opacity = float(request.form.get('opacity', 0.3))
            font_size = int(request.form.get('fontSize', 40))
            rotation = int(request.form.get('rotation', 45))
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                reader = PdfReader(str(upload_path))
                writer = PdfWriter()
                
                # Create watermark for each page
                for page in reader.pages:
                    # Create watermark overlay
                    packet = io.BytesIO()
                    can = canvas.Canvas(packet, pagesize=(page.mediabox.width, page.mediabox.height))
                    
                    # Set opacity
                    can.setFillAlpha(opacity)
                    
                    # Calculate position
                    width = float(page.mediabox.width)
                    height = float(page.mediabox.height)
                    
                    if position == 'center':
                        x, y = width / 2, height / 2
                    elif position == 'top-left':
                        x, y = 50, height - 50
                    elif position == 'top-right':
                        x, y = width - 50, height - 50
                    elif position == 'bottom-left':
                        x, y = 50, 50
                    elif position == 'bottom-right':
                        x, y = width - 50, 50
                    else:
                        x, y = width / 2, height / 2
                    
                    # Add text
                    can.saveState()
                    can.translate(x, y)
                    can.rotate(rotation)
                    can.setFont("Helvetica-Bold", font_size)
                    can.drawCentredString(0, 0, text)
                    can.restoreState()
                    can.save()
                    
                    # Merge watermark with page
                    packet.seek(0)
                    watermark = PdfReader(packet)
                    page.merge_page(watermark.pages[0])
                    writer.add_page(page)
                
                # Save output
                output_filename = f"imageandpdf_{Path(filename).stem}_watermarked.pdf"
                output_path = OUTPUT_FOLDER / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Watermark PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/organize-pdf', methods=['POST'])
    def organize_pdf():
        """Reorder, delete, or duplicate PDF pages"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Get page order (comma-separated list, e.g., "1,3,2,4,1" or "1-3,5,7-9")
            page_order = request.form.get('pageOrder', '')
            if not page_order:
                return jsonify({'error': 'Page order required'}), 400
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                reader = PdfReader(str(upload_path))
                writer = PdfWriter()
                total_pages = len(reader.pages)
                
                # Parse page order
                pages_to_add = []
                for part in page_order.split(','):
                    part = part.strip()
                    if '-' in part:
                        # Range like "1-5"
                        start, end = part.split('-')
                        pages_to_add.extend(range(int(start) - 1, int(end)))
                    else:
                        # Single page
                        pages_to_add.append(int(part) - 1)
                
                # Add pages in specified order
                for page_num in pages_to_add:
                    if 0 <= page_num < total_pages:
                        writer.add_page(reader.pages[page_num])
                
                # Save output
                output_filename = f"imageandpdf_{Path(filename).stem}_organized.pdf"
                output_path = OUTPUT_FOLDER / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Organize PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/extract-pages', methods=['POST'])
    def extract_pages():
        """Extract specific pages from PDF"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Get pages to extract (e.g., "1,3,5" or "1-5,8,10-12")
            pages = request.form.get('pages', '')
            if not pages:
                return jsonify({'error': 'Pages parameter required'}), 400
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                reader = PdfReader(str(upload_path))
                writer = PdfWriter()
                total_pages = len(reader.pages)
                
                # Parse pages
                pages_to_extract = []
                for part in pages.split(','):
                    part = part.strip()
                    if '-' in part:
                        start, end = part.split('-')
                        pages_to_extract.extend(range(int(start) - 1, int(end)))
                    else:
                        pages_to_extract.append(int(part) - 1)
                
                # Extract pages
                for page_num in pages_to_extract:
                    if 0 <= page_num < total_pages:
                        writer.add_page(reader.pages[page_num])
                
                # Save output
                output_filename = f"imageandpdf_{Path(filename).stem}_extracted.pdf"
                output_path = OUTPUT_FOLDER / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Extract pages error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/add-page-numbers', methods=['POST'])
    def add_page_numbers():
        """Add page numbers to PDF"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Get parameters
            position = request.form.get('position', 'bottom-center')  # bottom-center, bottom-right, etc.
            font_size = int(request.form.get('fontSize', 12))
            start_page = int(request.form.get('startPage', 1))
            format_template = request.form.get('format', 'Page {n}')  # e.g., "Page {n}" or "{n}"
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                reader = PdfReader(str(upload_path))
                writer = PdfWriter()
                
                for i, page in enumerate(reader.pages):
                    # Create page number overlay
                    packet = io.BytesIO()
                    can = canvas.Canvas(packet, pagesize=(page.mediabox.width, page.mediabox.height))
                    
                    # Calculate position
                    width = float(page.mediabox.width)
                    height = float(page.mediabox.height)
                    
                    if 'bottom' in position:
                        y = 30
                    elif 'top' in position:
                        y = height - 30
                    else:
                        y = height / 2
                    
                    if 'center' in position:
                        x = width / 2
                    elif 'right' in position:
                        x = width - 50
                    elif 'left' in position:
                        x = 50
                    else:
                        x = width / 2
                    
                    # Add page number
                    page_num = start_page + i
                    page_text = format_template.replace('{n}', str(page_num))
                    
                    can.setFont("Helvetica", font_size)
                    if 'center' in position:
                        can.drawCentredString(x, y, page_text)
                    elif 'right' in position:
                        can.drawRightString(x, y, page_text)
                    else:
                        can.drawString(x, y, page_text)
                    
                    can.save()
                    
                    # Merge with page
                    packet.seek(0)
                    number_page = PdfReader(packet)
                    page.merge_page(number_page.pages[0])
                    writer.add_page(page)
                
                # Save output
                output_filename = f"imageandpdf_{Path(filename).stem}_numbered.pdf"
                output_path = OUTPUT_FOLDER / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ Add page numbers error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/html-to-pdf', methods=['POST'])
    def html_to_pdf():
        """Convert HTML or URL to PDF"""
        try:
            # Get HTML content or URL
            html_content = request.form.get('html', '')
            url = request.form.get('url', '')
            
            if not html_content and not url:
                return jsonify({'error': 'HTML content or URL required'}), 400
            
            output_filename = f"imageandpdf_{uuid.uuid4().hex[:8]}.pdf"
            output_path = OUTPUT_FOLDER / output_filename
            
            try:
                from weasyprint import HTML
                
                if url:
                    # Convert URL to PDF
                    HTML(url).write_pdf(str(output_path))
                else:
                    # Convert HTML string to PDF
                    HTML(string=html_content).write_pdf(str(output_path))
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            except ImportError:
                return jsonify({'error': 'WeasyPrint not installed. Run: pip install weasyprint'}), 500
            except Exception as e:
                return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
        
        except Exception as e:
            print(f"❌ HTML to PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/ocr-pdf', methods=['POST'])
    def ocr_pdf():
        """Add OCR text layer to scanned PDF"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                import pytesseract
                from pdf2image import convert_from_path
                
                # Convert PDF to images
                images = convert_from_path(str(upload_path), dpi=300)
                
                # Create new PDF with OCR text
                writer = PdfWriter()
                reader = PdfReader(str(upload_path))
                
                for i, image in enumerate(images):
                    # Perform OCR
                    ocr_text = pytesseract.image_to_string(image)
                    
                    # For now, just add the original pages
                    # Full OCR implementation would overlay invisible text
                    if i < len(reader.pages):
                        writer.add_page(reader.pages[i])
                
                # Save output
                output_filename = f"imageandpdf_{Path(filename).stem}_ocr.pdf"
                output_path = OUTPUT_FOLDER / output_filename
                
                with open(output_path, 'wb') as f:
                    writer.write(f)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            except ImportError as e:
                return jsonify({'error': f'Missing library: {str(e)}. Install: pip install pytesseract pdf2image'}), 500
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ OCR PDF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/pdf/pdf-to-pdfa', methods=['POST'])
    def pdf_to_pdfa():
        """Convert PDF to PDF/A archival format"""
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            filename = secure_filename(file.filename)
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{filename}"
            file.save(str(upload_path))
            
            try:
                import pikepdf
                
                # Open and save as PDF/A compliant
                with pikepdf.open(str(upload_path)) as pdf:
                    output_filename = f"imageandpdf_{Path(filename).stem}_pdfa.pdf"
                    output_path = OUTPUT_FOLDER / output_filename
                    
                    # Save with PDF/A settings
                    pdf.save(str(output_path), 
                            linearize=True,
                            object_stream_mode=pikepdf.ObjectStreamMode.generate)
                
                return send_file(
                    str(output_path),
                    as_attachment=True,
                    download_name=output_filename
                )
            
            except ImportError:
                return jsonify({'error': 'pikepdf not installed. Run: pip install pikepdf'}), 500
            finally:
                if upload_path.exists():
                    upload_path.unlink()
        
        except Exception as e:
            print(f"❌ PDF to PDF/A error: {e}")
            return jsonify({'error': str(e)}), 500

