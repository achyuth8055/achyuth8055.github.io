/**
 * Dynamic Tool Configuration
 * Defines parameters and UI for each tool
 */

export interface ToolParameter {
  name: string;
  label: string;
  type: 'number' | 'select' | 'slider' | 'text' | 'color' | 'file';
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string | number; label: string }[];
  unit?: string;
  required?: boolean;
  description?: string;
}

export interface ToolConfig {
  id: string;
  endpoint: string;
  parameters: ToolParameter[];
  acceptedFormats?: string[];
  outputFormat?: string;
}

export // PDF TOOLS
const TOOL_CONFIGS: Record<string, ToolConfig> = {
  // PDF Tools - Convert to Word
  'pdf-to-word': {
    id: 'pdf-to-word',
    endpoint: '/api/pdf/to-word',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Merge
  'merge-pdf': {
    id: 'merge-pdf',
    endpoint: '/api/pdf/merge',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Split
  'split-pdf': {
    id: 'split-pdf',
    endpoint: '/api/pdf/split',
    parameters: [
      {
        name: 'mode',
        label: 'Split Mode',
        type: 'select',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Pages (individual files in ZIP)' }
        ]
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Rotate
  'rotate-pdf': {
    id: 'rotate-pdf',
    endpoint: '/api/pdf/rotate',
    parameters: [
      {
        name: 'angle',
        label: 'Rotation Angle',
        type: 'select',
        defaultValue: 90,
        options: [
          { value: 90, label: '90° Clockwise' },
          { value: 180, label: '180°' },
          { value: 270, label: '270° (90° Counter-clockwise)' }
        ]
      },
      {
        name: 'pages',
        label: 'Apply To',
        type: 'select',
        defaultValue: 'all',
        options: [
          { value: 'all', label: 'All Pages' }
        ]
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Compress
  'compress-pdf': {
    id: 'compress-pdf',
    endpoint: '/api/pdf/compress',
    parameters: [
      {
        name: 'quality',
        label: 'Compression Level',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'low', label: 'High Compression (smaller file)' },
          { value: 'medium', label: 'Medium Compression' },
          { value: 'high', label: 'Low Compression (better quality)' }
        ]
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - JPG to PDF
  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    endpoint: '/api/pdf/jpg-to-pdf',
    parameters: [],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // PDF Tools - Unlock
  'unlock-pdf': {
    id: 'unlock-pdf',
    endpoint: '/api/pdf/unlock',
    parameters: [
      {
        name: 'password',
        label: 'PDF Password',
        type: 'text',
        defaultValue: '',
        description: 'Enter the password to unlock the PDF'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Protect
  'protect-pdf': {
    id: 'protect-pdf',
    endpoint: '/api/pdf/protect',
    parameters: [
      {
        name: 'password',
        label: 'New Password',
        type: 'text',
        defaultValue: '',
        description: 'Enter a password to protect the PDF'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Word to PDF
  'word-to-pdf': {
    id: 'word-to-pdf',
    endpoint: '/api/pdf/word-to-pdf',
    parameters: [],
    acceptedFormats: ['doc', 'docx', 'odt', 'rtf']
  },

  // PDF Tools - Excel to PDF
  'excel-to-pdf': {
    id: 'excel-to-pdf',
    endpoint: '/api/pdf/excel-to-pdf',
    parameters: [],
    acceptedFormats: ['xls', 'xlsx', 'ods', 'csv']
  },

  // PDF Tools - PowerPoint to PDF
  'powerpoint-to-pdf': {
    id: 'powerpoint-to-pdf',
    endpoint: '/api/pdf/powerpoint-to-pdf',
    parameters: [],
    acceptedFormats: ['ppt', 'pptx', 'odp']
  },

  // PDF Tools - PDF to PowerPoint
  'pdf-to-powerpoint': {
    id: 'pdf-to-powerpoint',
    endpoint: '/api/pdf/pdf-to-powerpoint',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - PDF to Excel
  'pdf-to-excel': {
    id: 'pdf-to-excel',
    endpoint: '/api/pdf/pdf-to-excel',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - PDF to JPG
  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    endpoint: '/api/pdf/to-jpg',
    parameters: [
      {
        name: 'dpi',
        label: 'DPI (Resolution)',
        type: 'select',
        defaultValue: 150,
        options: [
          { value: 72, label: '72 DPI (Screen)' },
          { value: 150, label: '150 DPI (Standard)' },
          { value: 300, label: '300 DPI (High Quality)' },
          { value: 600, label: '600 DPI (Print)' }
        ]
      },
      {
        name: 'quality',
        label: 'JPG Quality',
        type: 'slider',
        defaultValue: 85,
        min: 10,
        max: 100,
        step: 5,
        unit: '%'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Watermark PDF
  'watermark': {
    id: 'watermark',
    endpoint: '/api/pdf/watermark-pdf',
    parameters: [
      {
        name: 'text',
        label: 'Watermark Text',
        type: 'text',
        defaultValue: 'CONFIDENTIAL',
        description: 'Text to display as watermark'
      },
      {
        name: 'position',
        label: 'Position',
        type: 'select',
        defaultValue: 'center',
        options: [
          { value: 'center', label: 'Center' },
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' }
        ]
      },
      {
        name: 'opacity',
        label: 'Opacity',
        type: 'slider',
        defaultValue: 0.3,
        min: 0.1,
        max: 1.0,
        step: 0.1,
        description: 'Watermark transparency'
      },
      {
        name: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        defaultValue: 40,
        min: 10,
        max: 100,
        step: 5,
        unit: 'pt'
      },
      {
        name: 'rotation',
        label: 'Rotation',
        type: 'slider',
        defaultValue: 45,
        min: -90,
        max: 90,
        step: 15,
        unit: '°'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Organize PDF
  'organize-pdf': {
    id: 'organize-pdf',
    endpoint: '/api/pdf/organize-pdf',
    parameters: [
      {
        name: 'pageOrder',
        label: 'Page Order',
        type: 'text',
        defaultValue: '1,2,3',
        description: 'Enter page order (e.g., "1,3,2,4" or "1-3,5,7-9")'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Extract Pages
  'extract-pages': {
    id: 'extract-pages',
    endpoint: '/api/pdf/extract-pages',
    parameters: [
      {
        name: 'pages',
        label: 'Pages to Extract',
        type: 'text',
        defaultValue: '1',
        description: 'Enter pages (e.g., "1,3,5" or "1-5,10-12")'
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - Page Numbers
  'page-numbers': {
    id: 'page-numbers',
    endpoint: '/api/pdf/add-page-numbers',
    parameters: [
      {
        name: 'position',
        label: 'Position',
        type: 'select',
        defaultValue: 'bottom-center',
        options: [
          { value: 'bottom-center', label: 'Bottom Center' },
          { value: 'bottom-right', label: 'Bottom Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'top-center', label: 'Top Center' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'top-left', label: 'Top Left' }
        ]
      },
      {
        name: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        defaultValue: 12,
        min: 8,
        max: 24,
        step: 2,
        unit: 'pt'
      },
      {
        name: 'startPage',
        label: 'Start Page Number',
        type: 'number',
        defaultValue: 1,
        min: 1
      },
      {
        name: 'format',
        label: 'Format',
        type: 'select',
        defaultValue: 'Page {n}',
        options: [
          { value: '{n}', label: '1, 2, 3...' },
          { value: 'Page {n}', label: 'Page 1, Page 2...' },
          { value: '{n} of {total}', label: '1 of 10, 2 of 10...' },
          { value: '- {n} -', label: '- 1 -, - 2 -...' }
        ]
      }
    ],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - HTML to PDF
  'html-to-pdf': {
    id: 'html-to-pdf',
    endpoint: '/api/pdf/html-to-pdf',
    parameters: [
      {
        name: 'url',
        label: 'Webpage URL',
        type: 'text',
        defaultValue: '',
        description: 'Enter URL to convert (e.g., https://example.com)'
      },
      {
        name: 'html',
        label: 'Or paste HTML',
        type: 'text',
        defaultValue: '',
        description: 'Paste HTML content directly'
      }
    ],
    acceptedFormats: []
  },

  // PDF Tools - OCR PDF
  'ocr-pdf': {
    id: 'ocr-pdf',
    endpoint: '/api/pdf/ocr-pdf',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // PDF Tools - PDF to PDF/A
  'pdf-to-pdfa': {
    id: 'pdf-to-pdfa',
    endpoint: '/api/pdf/pdf-to-pdfa',
    parameters: [],
    acceptedFormats: ['pdf']
  },

  // IMAGE TOOLS
  // Image Tools - Compress
  'compress-image': {
    id: 'compress-image',
    endpoint: '/api/image/compress',
    parameters: [
      {
        name: 'quality',
        label: 'Quality',
        type: 'slider',
        defaultValue: 85,
        min: 10,
        max: 100,
        step: 5,
        unit: '%',
        description: 'Higher quality = larger file size'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif']
  },

  // Image Tools - Resize
  'resize-image': {
    id: 'resize-image',
    endpoint: '/api/image/resize',
    parameters: [
      {
        name: 'resizeMode',
        label: 'Resize Mode',
        type: 'select',
        defaultValue: 'percentage',
        options: [
          { value: 'percentage', label: 'Percentage' },
          { value: 'dimensions', label: 'Custom Dimensions' },
          { value: 'width', label: 'Width Only' },
          { value: 'height', label: 'Height Only' }
        ],
        description: 'Choose how to resize'
      },
      {
        name: 'percentage',
        label: 'Scale',
        type: 'slider',
        defaultValue: 50,
        min: 10,
        max: 200,
        step: 10,
        unit: '%',
        description: 'Scale image by percentage'
      },
      {
        name: 'width',
        label: 'Width',
        type: 'number',
        defaultValue: 800,
        min: 10,
        max: 10000,
        unit: 'px',
        description: 'Target width in pixels'
      },
      {
        name: 'height',
        label: 'Height',
        type: 'number',
        defaultValue: 600,
        min: 10,
        max: 10000,
        unit: 'px',
        description: 'Target height in pixels'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
  },

  // Image Tools - Crop
  'crop-image': {
    id: 'crop-image',
    endpoint: '/api/image/crop',
    parameters: [
      {
        name: 'x',
        label: 'X Position',
        type: 'number',
        defaultValue: 0,
        min: 0,
        unit: 'px',
        description: 'Left edge position'
      },
      {
        name: 'y',
        label: 'Y Position',
        type: 'number',
        defaultValue: 0,
        min: 0,
        unit: 'px',
        description: 'Top edge position'
      },
      {
        name: 'width',
        label: 'Crop Width',
        type: 'number',
        defaultValue: 500,
        min: 10,
        max: 10000,
        unit: 'px',
        required: true
      },
      {
        name: 'height',
        label: 'Crop Height',
        type: 'number',
        defaultValue: 500,
        min: 10,
        max: 10000,
        unit: 'px',
        required: true
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
  },

  // Image Tools - Rotate
  'rotate-image': {
    id: 'rotate-image',
    endpoint: '/api/image/rotate',
    parameters: [
      {
        name: 'angle',
        label: 'Rotation Angle',
        type: 'select',
        defaultValue: 90,
        options: [
          { value: 90, label: '90° Clockwise' },
          { value: 180, label: '180°' },
          { value: 270, label: '270° (90° Counter-clockwise)' },
          { value: 'custom', label: 'Custom Angle' }
        ]
      },
      {
        name: 'customAngle',
        label: 'Custom Angle',
        type: 'slider',
        defaultValue: 45,
        min: -180,
        max: 180,
        step: 1,
        unit: '°',
        description: 'Any angle from -180° to 180°'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
  },

  // Image Tools - Flip
  'flip-image': {
    id: 'flip-image',
    endpoint: '/api/image/flip',
    parameters: [
      {
        name: 'direction',
        label: 'Flip Direction',
        type: 'select',
        defaultValue: 'horizontal',
        options: [
          { value: 'horizontal', label: 'Horizontal (Left ↔ Right)' },
          { value: 'vertical', label: 'Vertical (Top ↔ Bottom)' }
        ]
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
  },

  // Image Tools - Convert
  'image-to-jpg': {
    id: 'image-to-jpg',
    endpoint: '/api/image/convert',
    parameters: [
      {
        name: 'format',
        label: 'Target Format',
        type: 'select',
        defaultValue: 'jpg',
        options: [
          { value: 'jpg', label: 'JPG (Best for photos)' },
          { value: 'jpeg', label: 'JPEG (Same as JPG)' }
        ]
      },
      {
        name: 'quality',
        label: 'Quality',
        type: 'slider',
        defaultValue: 95,
        min: 60,
        max: 100,
        step: 5,
        unit: '%'
      }
    ],
    acceptedFormats: ['png', 'webp', 'gif', 'bmp', 'tiff'],
    outputFormat: 'jpg'
  },

  'jpg-to-png': {
    id: 'jpg-to-png',
    endpoint: '/api/image/convert',
    parameters: [
      {
        name: 'format',
        label: 'Target Format',
        type: 'select',
        defaultValue: 'png',
        options: [
          { value: 'png', label: 'PNG (Lossless, transparency)' },
          { value: 'webp', label: 'WebP (Modern, smaller size)' },
          { value: 'bmp', label: 'BMP (Uncompressed)' },
          { value: 'tiff', label: 'TIFF (High quality)' }
        ]
      }
    ],
    acceptedFormats: ['jpg', 'jpeg'],
    outputFormat: 'png'
  },

  // Image Tools - Watermark
  'watermark-image': {
    id: 'watermark-image',
    endpoint: '/api/image/watermark',
    parameters: [
      {
        name: 'text',
        label: 'Watermark Text',
        type: 'text',
        defaultValue: 'WATERMARK',
        description: 'Text to display as watermark'
      },
      {
        name: 'position',
        label: 'Position',
        type: 'select',
        defaultValue: 'center',
        options: [
          { value: 'center', label: 'Center' },
          { value: 'top-left', label: 'Top Left' },
          { value: 'top-right', label: 'Top Right' },
          { value: 'bottom-left', label: 'Bottom Left' },
          { value: 'bottom-right', label: 'Bottom Right' }
        ]
      },
      {
        name: 'opacity',
        label: 'Opacity',
        type: 'slider',
        defaultValue: 128,
        min: 50,
        max: 255,
        step: 10,
        description: 'Transparency (50 = very transparent, 255 = solid)'
      },
      {
        name: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        defaultValue: 48,
        min: 20,
        max: 120,
        step: 4,
        unit: 'px'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Image Tools - Meme Generator
  'meme-generator': {
    id: 'meme-generator',
    endpoint: '/api/image/meme',
    parameters: [
      {
        name: 'topText',
        label: 'Top Text',
        type: 'text',
        defaultValue: '',
        description: 'Text at the top of the image'
      },
      {
        name: 'bottomText',
        label: 'Bottom Text',
        type: 'text',
        defaultValue: '',
        description: 'Text at the bottom of the image'
      },
      {
        name: 'fontSize',
        label: 'Font Size',
        type: 'slider',
        defaultValue: 60,
        min: 30,
        max: 100,
        step: 5,
        unit: 'px'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Image Tools - Grayscale
  'grayscale-image': {
    id: 'grayscale-image',
    endpoint: '/api/image/grayscale',
    parameters: [],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif']
  },

  // Image Tools - Blur
  'blur-image': {
    id: 'blur-image',
    endpoint: '/api/image/blur',
    parameters: [
      {
        name: 'radius',
        label: 'Blur Radius',
        type: 'slider',
        defaultValue: 5,
        min: 1,
        max: 20,
        step: 1,
        unit: 'px',
        description: 'Higher values create more blur'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Image Tools - Sharpen
  'sharpen-image': {
    id: 'sharpen-image',
    endpoint: '/api/image/sharpen',
    parameters: [
      {
        name: 'factor',
        label: 'Sharpness Factor',
        type: 'slider',
        defaultValue: 2.0,
        min: 0.5,
        max: 5.0,
        step: 0.5,
        description: '0.5 = less sharp, 1.0 = no change, 5.0 = very sharp'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Image Tools - Brightness
  'brightness-image': {
    id: 'brightness-image',
    endpoint: '/api/image/brightness',
    parameters: [
      {
        name: 'brightness',
        label: 'Brightness',
        type: 'slider',
        defaultValue: 1.0,
        min: 0.3,
        max: 2.0,
        step: 0.1,
        description: '0.3 = very dark, 1.0 = no change, 2.0 = very bright'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // Image Tools - Contrast
  'contrast-image': {
    id: 'contrast-image',
    endpoint: '/api/image/contrast',
    parameters: [
      {
        name: 'contrast',
        label: 'Contrast',
        type: 'slider',
        defaultValue: 1.0,
        min: 0.3,
        max: 2.0,
        step: 0.1,
        description: '0.3 = low contrast, 1.0 = no change, 2.0 = high contrast'
      }
    ],
    acceptedFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp']
  },

  // VIDEO TOOLS
  // Video Tools - Compress
  'compress-video': {
    id: 'compress-video',
    endpoint: '/api/video/compress',
    parameters: [
      {
        name: 'quality',
        label: 'Compression Quality',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'high', label: 'High (larger file, better quality)' },
          { value: 'medium', label: 'Medium (balanced)' },
          { value: 'low', label: 'Low (smaller file, lower quality)' }
        ]
      }
    ],
    acceptedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv', 'm4v', 'vob']
  },

  // Video Tools - Convert to MP4
  'video-to-mp4': {
    id: 'video-to-mp4',
    endpoint: '/api/video/convert-to-mp4',
    parameters: [
      {
        name: 'quality',
        label: 'Output Quality',
        type: 'select',
        defaultValue: 'high',
        options: [
          { value: 'high', label: 'High (best quality)' },
          { value: 'medium', label: 'Medium (balanced)' },
          { value: 'low', label: 'Low (smallest size)' }
        ]
      }
    ],
    acceptedFormats: ['avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv']
  },

  // Video Tools - Convert Between Formats
  'convert-video': {
    id: 'convert-video',
    endpoint: '/api/video/convert',
    parameters: [
      {
        name: 'format',
        label: 'Output Format',
        type: 'select',
        defaultValue: 'mp4',
        options: [
          { value: 'mp4', label: 'MP4 (H.264, universal compatibility)' },
          { value: 'webm', label: 'WebM (VP9, web optimized)' },
          { value: 'avi', label: 'AVI (legacy support)' },
          { value: 'mov', label: 'MOV (QuickTime)' },
          { value: 'mkv', label: 'MKV (Matroska, high quality)' },
          { value: 'flv', label: 'FLV (Flash Video)' }
        ]
      },
      {
        name: 'quality',
        label: 'Output Quality',
        type: 'select',
        defaultValue: 'high',
        options: [
          { value: 'high', label: 'High (best quality)' },
          { value: 'medium', label: 'Medium (balanced)' },
          { value: 'low', label: 'Low (smallest size)' }
        ]
      }
    ],
    acceptedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv', 'm4v', 'vob']
  },

  // Video Tools - Trim
  'trim-video': {
    id: 'trim-video',
    endpoint: '/api/video/trim',
    parameters: [
      {
        name: 'startTime',
        label: 'Start Time',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 3600,
        step: 0.1,
        unit: 'seconds',
        description: 'When to start the trim'
      },
      {
        name: 'endTime',
        label: 'End Time',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 3600,
        step: 0.1,
        unit: 'seconds',
        description: 'When to end the trim'
      }
    ],
    acceptedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv', 'm4v', 'vob']
  },

  // Video Tools - Video to GIF
  'video-to-gif': {
    id: 'video-to-gif',
    endpoint: '/api/video/to-gif',
    parameters: [
      {
        name: 'fps',
        label: 'Frame Rate',
        type: 'slider',
        defaultValue: 10,
        min: 5,
        max: 30,
        step: 5,
        unit: 'fps',
        description: 'Frames per second (lower = smaller file)'
      },
      {
        name: 'width',
        label: 'Width',
        type: 'slider',
        defaultValue: 480,
        min: 240,
        max: 1280,
        step: 80,
        unit: 'px',
        description: 'Output width (height scales automatically)'
      }
    ],
    acceptedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv', 'm4v', 'vob']
  },

  // Video Tools - Extract Audio
  'extract-audio': {
    id: 'extract-audio',
    endpoint: '/api/video/extract-audio',
    parameters: [
      {
        name: 'format',
        label: 'Audio Format',
        type: 'select',
        defaultValue: 'mp3',
        options: [
          { value: 'mp3', label: 'MP3 (universal compatibility)' },
          { value: 'm4a', label: 'M4A (AAC, high quality)' }
        ]
      },
      {
        name: 'quality',
        label: 'Audio Quality',
        type: 'select',
        defaultValue: 'high',
        options: [
          { value: 'high', label: 'High (320kbps)' },
          { value: 'medium', label: 'Medium (192kbps)' },
          { value: 'low', label: 'Low (128kbps)' }
        ]
      }
    ],
    acceptedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mpeg', '3gp', 'ogv', 'm4v', 'vob']
  }
};

export const getToolConfig = (toolId: string): ToolConfig | null => {
  return TOOL_CONFIGS[toolId] || null;
};
