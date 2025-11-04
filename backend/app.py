"""
ImageAndPDF.com Backend
Flask server for PDF and Image processing
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pathlib import Path
import sys
import os
import uuid
import tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import io

# Add pdf2docx to path
PDF_TOOLS_DIR = Path(__file__).parent / 'pdf_tools' / 'pdf2docx'
sys.path.insert(0, str(PDF_TOOLS_DIR))

# Import pdf2docx
from pdf2docx import Converter

# Import video routes
from video_routes import add_video_routes

# Import PDF routes
from pdf_routes import add_pdf_routes

# Supported image formats
ALLOWED_IMAGE_FORMATS = {
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif',
    'webp', 'ico', 'heic', 'heif', 'svg'
}

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB
UPLOAD_FOLDER = Path(tempfile.gettempdir()) / 'imageandpdf_uploads'
OUTPUT_FOLDER = Path(tempfile.gettempdir()) / 'imageandpdf_outputs'
UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)

# Add video routes
add_video_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER)

# Add PDF routes
add_pdf_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/pdf/to-word', methods=['POST'])
def pdf_to_word():
    """Convert PDF to Word using pdf2docx"""
    try:
        # Validate file upload
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400
        
        # Save uploaded PDF
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        
        # Unique input filename
        input_filename = f"{uuid.uuid4().hex}.pdf"
        input_path = UPLOAD_FOLDER / input_filename
        file.save(str(input_path))
        
        # Output filename with website name prefix
        output_filename = f"imageandpdf_{original_name}.docx"
        output_path = OUTPUT_FOLDER / output_filename
        
        print(f"Converting: {input_path} -> {output_path}")
        
        # Convert PDF to Word using pdf2docx
        cv = Converter(str(input_path))
        cv.convert(str(output_path))
        cv.close()
        
        print(f"✅ Conversion successful: {output_path}")
        
        # Cleanup input file
        input_path.unlink()
        
        # Send the converted file
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

# ===================== IMAGE TOOLS =====================

def is_image_file(filename):
    """Check if file is a supported image format"""
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return ext in ALLOWED_IMAGE_FORMATS

@app.route('/api/image/compress', methods=['POST'])
def compress_image():
    """Compress image with quality control"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        quality = int(request.form.get('quality', 85))  # Default 85%
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        original_ext = original_filename.rsplit('.', 1)[1].lower()
        
        # Open image
        img = Image.open(file.stream)
        if img.mode in ('RGBA', 'LA', 'P'):
            if original_ext in ['jpg', 'jpeg']:
                img = img.convert('RGB')
        
        # Output
        output_filename = f"imageandpdf_{original_name}_compressed.{original_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        # Save with compression
        if original_ext in ['jpg', 'jpeg']:
            img.save(str(output_path), 'JPEG', quality=quality, optimize=True)
        elif original_ext == 'png':
            img.save(str(output_path), 'PNG', optimize=True, compress_level=9)
        elif original_ext == 'webp':
            img.save(str(output_path), 'WEBP', quality=quality)
        else:
            img.save(str(output_path), optimize=True)
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Compress error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/resize', methods=['POST'])
def resize_image():
    """Resize image to specified dimensions"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        width = request.form.get('width')
        height = request.form.get('height')
        percentage = request.form.get('percentage')
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        original_ext = original_filename.rsplit('.', 1)[1].lower()
        
        img = Image.open(file.stream)
        
        # Calculate new size
        if percentage:
            scale = float(percentage) / 100
            new_size = (int(img.width * scale), int(img.height * scale))
        elif width and height:
            new_size = (int(width), int(height))
        elif width:
            w = int(width)
            h = int(img.height * (w / img.width))
            new_size = (w, h)
        elif height:
            h = int(height)
            w = int(img.width * (h / img.height))
            new_size = (w, h)
        else:
            return jsonify({'error': 'Provide width, height, or percentage'}), 400
        
        # Resize
        resized = img.resize(new_size, Image.Resampling.LANCZOS)
        
        output_filename = f"imageandpdf_{original_name}_resized.{original_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        resized.save(str(output_path), optimize=True)
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Resize error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/crop', methods=['POST'])
def crop_image():
    """Crop image to specified area"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        x = int(request.form.get('x', 0))
        y = int(request.form.get('y', 0))
        width = int(request.form.get('width', 100))
        height = int(request.form.get('height', 100))
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        original_ext = original_filename.rsplit('.', 1)[1].lower()
        
        img = Image.open(file.stream)
        cropped = img.crop((x, y, x + width, y + height))
        
        output_filename = f"imageandpdf_{original_name}_cropped.{original_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        cropped.save(str(output_path), optimize=True)
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Crop error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/rotate', methods=['POST'])
def rotate_image():
    """Rotate image by specified angle"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        angle = float(request.form.get('angle', 90))
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        original_ext = original_filename.rsplit('.', 1)[1].lower()
        
        img = Image.open(file.stream)
        rotated = img.rotate(-angle, expand=True, resample=Image.Resampling.BICUBIC)
        
        output_filename = f"imageandpdf_{original_name}_rotated.{original_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        rotated.save(str(output_path), optimize=True)
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Rotate error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/flip', methods=['POST'])
def flip_image():
    """Flip image horizontally or vertically"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        direction = request.form.get('direction', 'horizontal')
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        original_ext = original_filename.rsplit('.', 1)[1].lower()
        
        img = Image.open(file.stream)
        
        if direction == 'horizontal':
            flipped = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        else:
            flipped = img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        
        output_filename = f"imageandpdf_{original_name}_flipped.{original_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        flipped.save(str(output_path), optimize=True)
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Flip error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/image/convert', methods=['POST'])
def convert_image():
    """Convert image to different format"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if not is_image_file(file.filename):
            return jsonify({'error': 'Invalid image format'}), 400
        
        target_format = request.form.get('format', 'png').lower()
        if target_format not in ALLOWED_IMAGE_FORMATS:
            return jsonify({'error': 'Invalid target format'}), 400
        
        original_filename = secure_filename(file.filename)
        original_name = original_filename.rsplit('.', 1)[0]
        
        img = Image.open(file.stream)
        
        # Handle transparency for formats that don't support it
        if target_format in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        
        output_filename = f"imageandpdf_{original_name}.{target_format}"
        output_path = OUTPUT_FOLDER / output_filename
        
        # Save with proper format
        if target_format in ['jpg', 'jpeg']:
            img.save(str(output_path), 'JPEG', quality=95, optimize=True)
        elif target_format == 'png':
            img.save(str(output_path), 'PNG', optimize=True)
        elif target_format == 'webp':
            img.save(str(output_path), 'WEBP', quality=95)
        elif target_format == 'gif':
            img.save(str(output_path), 'GIF', optimize=True)
        else:
            img.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Convert error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Watermark
@app.route('/api/image/watermark', methods=['POST'])
def watermark_image():
    """Add text or image watermark to an image"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get parameters
        watermark_text = request.form.get('text', 'WATERMARK')
        position = request.form.get('position', 'center')  # center, top-left, top-right, bottom-left, bottom-right
        opacity = int(request.form.get('opacity', 128))  # 0-255
        font_size = int(request.form.get('fontSize', 48))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path).convert('RGBA')
        
        # Create watermark layer
        watermark_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark_layer)
        
        # Try to use a nice font, fallback to default
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            font = ImageFont.load_default()
        
        # Calculate text position
        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        if position == 'center':
            x = (img.width - text_width) // 2
            y = (img.height - text_height) // 2
        elif position == 'top-left':
            x, y = 20, 20
        elif position == 'top-right':
            x = img.width - text_width - 20
            y = 20
        elif position == 'bottom-left':
            x, y = 20, img.height - text_height - 20
        elif position == 'bottom-right':
            x = img.width - text_width - 20
            y = img.height - text_height - 20
        else:
            x = (img.width - text_width) // 2
            y = (img.height - text_height) // 2
        
        # Draw text with opacity
        draw.text((x, y), watermark_text, fill=(255, 255, 255, opacity), font=font)
        
        # Composite watermark onto image
        watermarked = Image.alpha_composite(img, watermark_layer)
        
        # Convert back to RGB if output format doesn't support alpha
        if file_ext not in ['png', 'webp']:
            watermarked = watermarked.convert('RGB')
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            watermarked.save(str(output_path), 'JPEG', quality=95)
        else:
            watermarked.save(str(output_path), format=file_ext.upper())
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Watermark error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Meme Text
@app.route('/api/image/meme', methods=['POST'])
def meme_image():
    """Add meme-style text (top and bottom) to an image"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get parameters
        top_text = request.form.get('topText', '').upper()
        bottom_text = request.form.get('bottomText', '').upper()
        font_size = int(request.form.get('fontSize', 60))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path).convert('RGBA')
        draw = ImageDraw.Draw(img)
        
        # Try to use Impact font (classic meme font), fallback to Arial
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Impact.ttf", font_size)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
            except:
                font = ImageFont.load_default()
        
        # Draw top text
        if top_text:
            bbox = draw.textbbox((0, 0), top_text, font=font)
            text_width = bbox[2] - bbox[0]
            x = (img.width - text_width) // 2
            y = 10
            
            # Draw outline (black stroke)
            for offset_x in range(-3, 4):
                for offset_y in range(-3, 4):
                    if offset_x != 0 or offset_y != 0:
                        draw.text((x + offset_x, y + offset_y), top_text, fill='black', font=font)
            
            # Draw white text
            draw.text((x, y), top_text, fill='white', font=font)
        
        # Draw bottom text
        if bottom_text:
            bbox = draw.textbbox((0, 0), bottom_text, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            x = (img.width - text_width) // 2
            y = img.height - text_height - 10
            
            # Draw outline (black stroke)
            for offset_x in range(-3, 4):
                for offset_y in range(-3, 4):
                    if offset_x != 0 or offset_y != 0:
                        draw.text((x + offset_x, y + offset_y), bottom_text, fill='black', font=font)
            
            # Draw white text
            draw.text((x, y), bottom_text, fill='white', font=font)
        
        # Convert back to RGB if needed
        if file_ext not in ['png', 'webp']:
            img = img.convert('RGB')
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            img.save(str(output_path), 'JPEG', quality=95)
        else:
            img.save(str(output_path), format=file_ext.upper())
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Meme error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Grayscale
@app.route('/api/image/grayscale', methods=['POST'])
def grayscale_image():
    """Convert image to grayscale"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path)
        grayscale = img.convert('L')  # Convert to grayscale
        
        # Convert back to RGB for formats that don't support grayscale
        if file_ext in ['jpg', 'jpeg']:
            grayscale = grayscale.convert('RGB')
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            grayscale.save(str(output_path), 'JPEG', quality=95)
        else:
            grayscale.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Grayscale error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Blur
@app.route('/api/image/blur', methods=['POST'])
def blur_image():
    """Apply blur effect to image"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get blur radius
        radius = float(request.form.get('radius', 5))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path)
        blurred = img.filter(ImageFilter.GaussianBlur(radius=radius))
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            blurred.save(str(output_path), 'JPEG', quality=95)
        else:
            blurred.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Blur error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Sharpen
@app.route('/api/image/sharpen', methods=['POST'])
def sharpen_image():
    """Apply sharpen effect to image"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get sharpen factor
        factor = float(request.form.get('factor', 2.0))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path)
        enhancer = ImageEnhance.Sharpness(img)
        sharpened = enhancer.enhance(factor)
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            sharpened.save(str(output_path), 'JPEG', quality=95)
        else:
            sharpened.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Sharpen error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Brightness
@app.route('/api/image/brightness', methods=['POST'])
def brightness_image():
    """Adjust image brightness"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get brightness factor (0.5 = darker, 1.0 = no change, 2.0 = brighter)
        brightness = float(request.form.get('brightness', 1.0))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path)
        enhancer = ImageEnhance.Brightness(img)
        adjusted = enhancer.enhance(brightness)
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            adjusted.save(str(output_path), 'JPEG', quality=95)
        else:
            adjusted.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Brightness error: {e}")
        return jsonify({'error': str(e)}), 500

# IMAGE TOOLS - Contrast
@app.route('/api/image/contrast', methods=['POST'])
def contrast_image():
    """Adjust image contrast"""
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get contrast factor (0.5 = less contrast, 1.0 = no change, 2.0 = more contrast)
        contrast = float(request.form.get('contrast', 1.0))
        
        original_filename = secure_filename(file.filename)
        file_ext = Path(original_filename).suffix[1:].lower() or 'png'
        
        # Save upload
        upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
        file.save(str(upload_path))
        
        # Process
        img = Image.open(upload_path)
        enhancer = ImageEnhance.Contrast(img)
        adjusted = enhancer.enhance(contrast)
        
        # Save output
        output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
        output_path = OUTPUT_FOLDER / output_filename
        
        if file_ext in ['jpg', 'jpeg']:
            adjusted.save(str(output_path), 'JPEG', quality=95)
        else:
            adjusted.save(str(output_path))
        
        return send_file(
            str(output_path),
            as_attachment=True,
            download_name=output_filename
        )
    except Exception as e:
        print(f"❌ Contrast error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 ImageAndPDF.com Backend Starting...")
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📁 Output folder: {OUTPUT_FOLDER}")
    print(f"📚 PDF Tools: {PDF_TOOLS_DIR}")
    print(f"🖼️  Supported image formats: {', '.join(sorted(ALLOWED_IMAGE_FORMATS))}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5001, debug=True)
