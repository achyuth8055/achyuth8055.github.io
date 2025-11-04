#!/usr/bin/env python3
"""
Script to fix all get_area() method calls in pdf2docx to be compatible with newer PyMuPDF.
"""

import os
import re

# Files to fix
files_to_fix = [
    'pdf2docx/shape/Shapes.py',
    'pdf2docx/shape/Shape.py',
    'pdf2docx/shape/Path.py',
    'pdf2docx/layout/Blocks.py',
    'pdf2docx/image/ImagesExtractor.py',
    'pdf2docx/common/Element.py',
    'pdf2docx/common/Collection.py',
    'pdf2docx/table/TablesConstructor.py',
]

def fix_get_area(content):
    """Replace .get_area() with proper area calculation."""
    # Pattern to match: something.get_area()
    # We want to replace with: (something.width * something.height)
    
    # This regex captures the object/variable before .get_area()
    pattern = r'(\w+(?:\.\w+)*)\.get_area\(\)'
    
    def replacer(match):
        obj = match.group(1)
        return f'({obj}.width * {obj}.height)'
    
    return re.sub(pattern, replacer, content)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    for file_path in files_to_fix:
        full_path = os.path.join(script_dir, file_path)
        
        if not os.path.exists(full_path):
            print(f"⚠️  File not found: {file_path}")
            continue
        
        print(f"Processing: {file_path}")
        
        # Read the file
        with open(full_path, 'r') as f:
            content = f.read()
        
        # Fix get_area() calls
        fixed_content = fix_get_area(content)
        
        # Write back
        with open(full_path, 'w') as f:
            f.write(fixed_content)
        
        print(f"✅ Fixed: {file_path}")
    
    print("\n✅ All files processed successfully!")

if __name__ == '__main__':
    main()
