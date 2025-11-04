"""
Video Processing Routes
Endpoints for video compression, conversion, trimming, etc.
"""
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from pathlib import Path
import subprocess
import uuid
import os

def add_video_routes(app, UPLOAD_FOLDER, OUTPUT_FOLDER):
    """Add video processing routes to Flask app"""
    
    @app.route('/api/video/compress', methods=['POST'])
    def compress_video():
        """Compress video file"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            quality = request.form.get('quality', 'medium')  # low, medium, high
            
            original_filename = secure_filename(file.filename)
            file_ext = Path(original_filename).suffix[1:].lower() or 'mp4'
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Set CRF based on quality (lower = better quality)
            crf_map = {'high': 18, 'medium': 23, 'low': 28}
            crf = crf_map.get(quality, 23)
            
            # Compress using ffmpeg
            cmd = [
                'ffmpeg', '-i', str(upload_path),
                '-c:v', 'libx264', '-crf', str(crf),
                '-preset', 'medium',
                '-c:a', 'aac', '-b:a', '128k',
                '-y', str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Video compress error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/video/convert-to-mp4', methods=['POST'])
    def convert_to_mp4():
        """Convert video to MP4 format"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            quality = request.form.get('quality', 'high')
            
            original_filename = secure_filename(file.filename)
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.mp4"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Set quality
            crf_map = {'high': 18, 'medium': 23, 'low': 28}
            crf = crf_map.get(quality, 18)
            
            # Convert to MP4
            cmd = [
                'ffmpeg', '-i', str(upload_path),
                '-c:v', 'libx264', '-crf', str(crf),
                '-preset', 'medium',
                '-c:a', 'aac', '-b:a', '192k',
                '-movflags', '+faststart',
                '-y', str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Video convert error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/video/convert', methods=['POST'])
    def convert_video():
        """Convert video between different formats"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            output_format = request.form.get('format', 'mp4').lower()
            quality = request.form.get('quality', 'high')
            
            original_filename = secure_filename(file.filename)
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.{output_format}"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Set quality
            crf_map = {'high': 18, 'medium': 23, 'low': 28}
            crf = crf_map.get(quality, 23)
            
            # Format-specific encoding settings
            if output_format == 'mp4':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-preset', 'medium',
                    '-c:a', 'aac', '-b:a', '192k',
                    '-movflags', '+faststart',
                    '-y', str(output_path)
                ]
            elif output_format == 'webm':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libvpx-vp9', '-crf', str(crf),
                    '-c:a', 'libopus', '-b:a', '128k',
                    '-y', str(output_path)
                ]
            elif output_format == 'avi':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-c:a', 'mp3', '-b:a', '192k',
                    '-y', str(output_path)
                ]
            elif output_format == 'mov':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-c:a', 'aac', '-b:a', '192k',
                    '-y', str(output_path)
                ]
            elif output_format == 'mkv':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-c:a', 'aac', '-b:a', '192k',
                    '-y', str(output_path)
                ]
            elif output_format == 'flv':
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-c:a', 'aac', '-b:a', '128k',
                    '-y', str(output_path)
                ]
            else:
                # Default to MP4 for unknown formats
                cmd = [
                    'ffmpeg', '-i', str(upload_path),
                    '-c:v', 'libx264', '-crf', str(crf),
                    '-c:a', 'aac', '-b:a', '192k',
                    '-y', str(output_path)
                ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Video convert error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/video/trim', methods=['POST'])
    def trim_video():
        """Trim video to specified start and end times"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters (in seconds)
            start_time = float(request.form.get('startTime', 0))
            end_time = float(request.form.get('endTime', 10))
            
            original_filename = secure_filename(file.filename)
            file_ext = Path(original_filename).suffix[1:].lower() or 'mp4'
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.{file_ext}"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Calculate duration
            duration = end_time - start_time
            
            # Trim video
            cmd = [
                'ffmpeg', '-i', str(upload_path),
                '-ss', str(start_time),
                '-t', str(duration),
                '-c', 'copy',
                '-y', str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Video trim error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/video/to-gif', methods=['POST'])
    def video_to_gif():
        """Convert video to animated GIF"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            fps = int(request.form.get('fps', 10))
            width = int(request.form.get('width', 480))
            
            original_filename = secure_filename(file.filename)
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.gif"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Convert to GIF with palette for better quality
            palette_path = OUTPUT_FOLDER / f"palette_{uuid.uuid4()}.png"
            
            # Generate palette
            cmd_palette = [
                'ffmpeg', '-i', str(upload_path),
                '-vf', f'fps={fps},scale={width}:-1:flags=lanczos,palettegen',
                '-y', str(palette_path)
            ]
            subprocess.run(cmd_palette, capture_output=True)
            
            # Create GIF using palette
            cmd_gif = [
                'ffmpeg', '-i', str(upload_path),
                '-i', str(palette_path),
                '-filter_complex', f'fps={fps},scale={width}:-1:flags=lanczos[x];[x][1:v]paletteuse',
                '-y', str(output_path)
            ]
            
            result = subprocess.run(cmd_gif, capture_output=True, text=True)
            
            # Clean up palette
            if palette_path.exists():
                palette_path.unlink()
            
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Video to GIF error: {e}")
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/video/extract-audio', methods=['POST'])
    def extract_audio():
        """Extract audio from video"""
        try:
            file = request.files.get('file')
            if not file:
                return jsonify({'error': 'No file provided'}), 400
            
            # Get parameters
            audio_format = request.form.get('format', 'mp3')
            quality = request.form.get('quality', 'high')
            
            original_filename = secure_filename(file.filename)
            
            # Save upload
            upload_path = UPLOAD_FOLDER / f"{uuid.uuid4()}_{original_filename}"
            file.save(str(upload_path))
            
            # Output
            output_filename = f"imageandpdf_{Path(original_filename).stem}.{audio_format}"
            output_path = OUTPUT_FOLDER / output_filename
            
            # Set bitrate based on quality
            bitrate_map = {'high': '320k', 'medium': '192k', 'low': '128k'}
            bitrate = bitrate_map.get(quality, '192k')
            
            # Extract audio
            cmd = [
                'ffmpeg', '-i', str(upload_path),
                '-vn',  # No video
                '-acodec', 'libmp3lame' if audio_format == 'mp3' else 'aac',
                '-b:a', bitrate,
                '-y', str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                return jsonify({'error': f'FFmpeg error: {result.stderr}'}), 500
            
            return send_file(
                str(output_path),
                as_attachment=True,
                download_name=output_filename
            )
        except Exception as e:
            print(f"❌ Extract audio error: {e}")
            return jsonify({'error': str(e)}), 500
