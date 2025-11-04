#!/usr/bin/env python3
"""
Simple command-line tool to test PDF to DOCX conversion.
Usage: python test_conversion.py [pdf_file] [output_docx]
"""

import sys
import os
from pdf2docx import Converter


def convert_pdf(pdf_file, docx_file=None):
    """Convert a PDF file to DOCX."""
    
    # Check if file exists
    if not os.path.exists(pdf_file):
        print(f"❌ Error: File '{pdf_file}' not found!")
        return False
    
    # Generate output filename if not provided
    if docx_file is None:
        docx_file = pdf_file.rsplit('.', 1)[0] + '.docx'
    
    print("\n" + "="*60)
    print("PDF to DOCX Converter - Command Line Test")
    print("="*60)
    print(f"\n📄 Input PDF:  {pdf_file}")
    print(f"📝 Output DOCX: {docx_file}")
    print("\n" + "="*60 + "\n")
    
    try:
        # Perform conversion
        cv = Converter(pdf_file)
        cv.convert(docx_file)
        cv.close()
        
        print("\n✅ Conversion successful!")
        print(f"📝 Output saved to: {docx_file}")
        print(f"📊 File size: {os.path.getsize(docx_file) / 1024:.2f} KB\n")
        return True
        
    except Exception as e:
        print(f"\n❌ Conversion failed: {str(e)}\n")
        return False


def list_samples():
    """List available sample PDF files."""
    sample_dir = os.path.join(os.path.dirname(__file__), 'test', 'samples')
    
    if not os.path.exists(sample_dir):
        print("❌ Sample directory not found!")
        return []
    
    samples = [f for f in os.listdir(sample_dir) if f.endswith('.pdf')]
    samples.sort()
    
    if not samples:
        print("❌ No sample files found!")
        return []
    
    print("\n📚 Available Sample PDF Files:")
    print("="*60)
    for i, sample in enumerate(samples, 1):
        print(f"{i:2d}. {sample}")
    print("="*60 + "\n")
    
    return samples


def main():
    """Main entry point."""
    
    # If no arguments, show help
    if len(sys.argv) == 1:
        print("\n" + "="*60)
        print("PDF to DOCX Converter - Command Line Test Tool")
        print("="*60)
        print("\nUsage:")
        print("  python test_conversion.py <pdf_file> [output_docx]")
        print("  python test_conversion.py --samples    # List sample files")
        print("  python test_conversion.py --test <n>   # Test with sample file #n")
        print("\nExamples:")
        print("  python test_conversion.py document.pdf")
        print("  python test_conversion.py document.pdf output.docx")
        print("  python test_conversion.py --samples")
        print("  python test_conversion.py --test 1")
        print("="*60 + "\n")
        return
    
    # List samples
    if sys.argv[1] == '--samples':
        list_samples()
        return
    
    # Test with sample file
    if sys.argv[1] == '--test':
        samples = list_samples()
        if not samples:
            return
        
        if len(sys.argv) < 3:
            print("❌ Please specify sample number!")
            return
        
        try:
            index = int(sys.argv[2]) - 1
            if 0 <= index < len(samples):
                sample_dir = os.path.join(os.path.dirname(__file__), 'test', 'samples')
                pdf_file = os.path.join(sample_dir, samples[index])
                output_file = os.path.join(os.getcwd(), samples[index].rsplit('.', 1)[0] + '.docx')
                convert_pdf(pdf_file, output_file)
            else:
                print(f"❌ Invalid sample number! Choose 1-{len(samples)}")
        except ValueError:
            print("❌ Invalid sample number!")
        return
    
    # Convert specific file
    pdf_file = sys.argv[1]
    docx_file = sys.argv[2] if len(sys.argv) > 2 else None
    convert_pdf(pdf_file, docx_file)


if __name__ == '__main__':
    main()
