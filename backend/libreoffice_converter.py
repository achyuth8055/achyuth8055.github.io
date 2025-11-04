"""
LibreOffice Headless Converter
Production-quality document conversion utility using LibreOffice in headless mode.

Supports:
- Word (DOC, DOCX) ↔ PDF
- Excel (XLS, XLSX) ↔ PDF  
- PowerPoint (PPT, PPTX) ↔ PDF
- And many more formats!

This is the industry-standard approach used by professional conversion services.
"""

import os
import subprocess
import platform
import tempfile
from pathlib import Path
from typing import Optional, Tuple

class LibreOfficeConverter:
    """
    Production-quality document converter using LibreOffice in headless mode.
    """
    
    def __init__(self):
        """Initialize converter and find LibreOffice executable."""
        self.soffice_path = self._find_libreoffice()
        if not self.soffice_path:
            raise RuntimeError("LibreOffice not found. Please install LibreOffice.")
    
    def _find_libreoffice(self) -> Optional[str]:
        """
        Find LibreOffice soffice executable based on platform.
        
        Returns:
            Path to soffice executable or None if not found
        """
        system = platform.system()
        
        # Common paths for different operating systems
        search_paths = []
        
        if system == "Darwin":  # macOS
            search_paths = [
                "/Applications/LibreOffice.app/Contents/MacOS/soffice",
                "/usr/local/bin/soffice",
                "/opt/homebrew/bin/soffice"
            ]
        elif system == "Linux":
            search_paths = [
                "/usr/bin/soffice",
                "/usr/bin/libreoffice",
                "/snap/bin/libreoffice",
                "/usr/local/bin/soffice"
            ]
        elif system == "Windows":
            search_paths = [
                r"C:\Program Files\LibreOffice\program\soffice.exe",
                r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"
            ]
        
        # Check each path
        for path in search_paths:
            if os.path.isfile(path):
                return path
        
        # Try to find via 'which' command (Unix-like systems)
        if system in ["Darwin", "Linux"]:
            try:
                result = subprocess.run(
                    ["which", "soffice"],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                if result.returncode == 0 and result.stdout.strip():
                    return result.stdout.strip()
            except:
                pass
        
        return None
    
    def convert_to_pdf(
        self, 
        input_path: str, 
        output_dir: Optional[str] = None
    ) -> Tuple[bool, str]:
        """
        Convert any LibreOffice-supported format to PDF.
        
        Supported input formats:
        - Word: doc, docx, rtf, odt
        - Excel: xls, xlsx, ods, csv
        - PowerPoint: ppt, pptx, odp
        - And many more!
        
        Args:
            input_path: Path to input file
            output_dir: Directory for output PDF (default: same as input)
        
        Returns:
            Tuple of (success: bool, output_path_or_error: str)
        
        Example:
            >>> converter = LibreOfficeConverter()
            >>> success, output = converter.convert_to_pdf("document.docx")
            >>> if success:
            >>>     print(f"PDF created: {output}")
        """
        input_path = Path(input_path).resolve()
        
        # Validate input file exists
        if not input_path.exists():
            return False, f"Input file not found: {input_path}"
        
        # Determine output directory
        if output_dir is None:
            output_dir = input_path.parent
        else:
            output_dir = Path(output_dir).resolve()
            output_dir.mkdir(parents=True, exist_ok=True)
        
        # Expected output filename (LibreOffice replaces extension with .pdf)
        output_filename = input_path.stem + ".pdf"
        output_path = output_dir / output_filename
        
        # Remove existing output file if present
        if output_path.exists():
            output_path.unlink()
        
        try:
            # Build LibreOffice conversion command
            # --headless: Run without GUI
            # --convert-to pdf: Convert to PDF format
            # --outdir: Specify output directory
            cmd = [
                str(self.soffice_path),
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                str(output_dir),
                str(input_path)
            ]
            
            # Execute conversion
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60  # 60 second timeout
            )
            
            # Check if conversion was successful
            if result.returncode == 0 and output_path.exists():
                return True, str(output_path)
            else:
                error_msg = result.stderr if result.stderr else "Conversion failed"
                return False, f"LibreOffice error: {error_msg}"
        
        except subprocess.TimeoutExpired:
            return False, "Conversion timed out (60 seconds)"
        
        except Exception as e:
            return False, f"Conversion error: {str(e)}"
    
    def convert_from_pdf(
        self,
        input_pdf: str,
        output_format: str,
        output_dir: Optional[str] = None
    ) -> Tuple[bool, str]:
        """
        Convert PDF to other formats.
        
        Note: PDF to Office conversions are less reliable than Office to PDF.
        Quality depends on PDF complexity.
        
        Supported output formats:
        - docx: Microsoft Word
        - xlsx: Microsoft Excel (if PDF contains tables)
        - pptx: Microsoft PowerPoint (if PDF is slides)
        - odt: OpenDocument Text
        - ods: OpenDocument Spreadsheet
        - odp: OpenDocument Presentation
        
        Args:
            input_pdf: Path to PDF file
            output_format: Desired format (docx, xlsx, pptx, etc.)
            output_dir: Output directory (default: same as input)
        
        Returns:
            Tuple of (success: bool, output_path_or_error: str)
        """
        input_pdf = Path(input_pdf).resolve()
        
        if not input_pdf.exists():
            return False, f"Input PDF not found: {input_pdf}"
        
        if output_dir is None:
            output_dir = input_pdf.parent
        else:
            output_dir = Path(output_dir).resolve()
            output_dir.mkdir(parents=True, exist_ok=True)
        
        # Expected output filename
        output_filename = input_pdf.stem + f".{output_format}"
        output_path = output_dir / output_filename
        
        if output_path.exists():
            output_path.unlink()
        
        try:
            cmd = [
                str(self.soffice_path),
                "--headless",
                "--convert-to",
                output_format,
                "--outdir",
                str(output_dir),
                str(input_pdf)
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0 and output_path.exists():
                return True, str(output_path)
            else:
                error_msg = result.stderr if result.stderr else "Conversion failed"
                return False, f"LibreOffice error: {error_msg}"
        
        except subprocess.TimeoutExpired:
            return False, "Conversion timed out (60 seconds)"
        
        except Exception as e:
            return False, f"Conversion error: {str(e)}"
    
    def batch_convert_to_pdf(
        self,
        input_files: list,
        output_dir: str
    ) -> dict:
        """
        Convert multiple files to PDF in batch.
        
        Args:
            input_files: List of file paths
            output_dir: Output directory for all PDFs
        
        Returns:
            Dictionary with results for each file
        """
        results = {}
        output_dir = Path(output_dir).resolve()
        output_dir.mkdir(parents=True, exist_ok=True)
        
        for input_file in input_files:
            success, output = self.convert_to_pdf(input_file, output_dir)
            results[input_file] = {
                'success': success,
                'output': output
            }
        
        return results
    
    def get_supported_formats(self) -> dict:
        """
        Get list of supported formats for conversion.
        
        Returns:
            Dictionary of format categories and their extensions
        """
        return {
            'word': ['doc', 'docx', 'rtf', 'odt', 'txt'],
            'excel': ['xls', 'xlsx', 'ods', 'csv'],
            'powerpoint': ['ppt', 'pptx', 'odp'],
            'pdf': ['pdf'],
            'other': ['html', 'xml', 'fodt', 'fods', 'fodp']
        }
    
    def is_format_supported(self, filename: str) -> bool:
        """
        Check if file format is supported.
        
        Args:
            filename: Name of file to check
        
        Returns:
            True if format is supported
        """
        ext = Path(filename).suffix.lower().lstrip('.')
        supported = self.get_supported_formats()
        
        for formats in supported.values():
            if ext in formats:
                return True
        
        return False


# Convenience functions for direct use
def convert_word_to_pdf(docx_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert Word document to PDF."""
    converter = LibreOfficeConverter()
    return converter.convert_to_pdf(docx_path, output_dir)


def convert_excel_to_pdf(xlsx_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert Excel spreadsheet to PDF."""
    converter = LibreOfficeConverter()
    return converter.convert_to_pdf(xlsx_path, output_dir)


def convert_powerpoint_to_pdf(pptx_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert PowerPoint presentation to PDF."""
    converter = LibreOfficeConverter()
    return converter.convert_to_pdf(pptx_path, output_dir)


def convert_pdf_to_word(pdf_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert PDF to Word document."""
    converter = LibreOfficeConverter()
    return converter.convert_from_pdf(pdf_path, 'docx', output_dir)


def convert_pdf_to_excel(pdf_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert PDF to Excel spreadsheet."""
    converter = LibreOfficeConverter()
    return converter.convert_from_pdf(pdf_path, 'xlsx', output_dir)


def convert_pdf_to_powerpoint(pdf_path: str, output_dir: Optional[str] = None) -> Tuple[bool, str]:
    """Convert PDF to PowerPoint presentation."""
    converter = LibreOfficeConverter()
    return converter.convert_from_pdf(pdf_path, 'pptx', output_dir)


if __name__ == "__main__":
    # Test the converter
    print("LibreOffice Converter - Production Quality")
    print("=" * 50)
    
    try:
        converter = LibreOfficeConverter()
        print(f"✅ LibreOffice found: {converter.soffice_path}")
        print(f"\n📋 Supported formats:")
        for category, formats in converter.get_supported_formats().items():
            print(f"  {category}: {', '.join(formats)}")
        
        print("\n🎯 Ready for production use!")
        print("\nExample usage:")
        print("  from libreoffice_converter import convert_word_to_pdf")
        print("  success, output = convert_word_to_pdf('document.docx')")
        
    except RuntimeError as e:
        print(f"❌ Error: {e}")
        print("\n💡 Install LibreOffice:")
        print("  macOS: brew install libreoffice")
        print("  Ubuntu: sudo apt-get install libreoffice")
        print("  Windows: Download from https://www.libreoffice.org/")
