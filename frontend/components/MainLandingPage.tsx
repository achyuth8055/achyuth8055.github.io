import React from 'react';
import SEO from './SEO';

interface MainLandingPageProps {
  onSelectSection: (section: 'pdf' | 'image' | 'video') => void;
}

const MainLandingPage: React.FC<MainLandingPageProps> = ({ onSelectSection }) => {
  return (
    <>
      <SEO 
        title="ImageAndPDF - Free Online PDF & Image Tools | Convert, Compress, Edit"
        description="Free professional-grade tools for PDF and image processing. Convert PDF to Word, compress images, merge PDFs, resize photos, and more. 100% free, secure, and fast."
        keywords="PDF tools, image tools, convert PDF to Word, compress PDF, merge PDF, split PDF, resize image, compress image, convert image, PDF editor, online PDF tools"
        canonicalUrl="https://imageandpdf.com/"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12 md:mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-red-600">imageandpdf</span>
              <span className="text-gray-800">.com</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-700 mb-4 font-medium animate-slide-in-left animate-delay-100">
              Your Complete File Processing Solution
            </p>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-in-right animate-delay-200">
              Professional-grade tools for all your PDF and Image processing needs. 
              <br className="hidden md:block" />
              <span className="font-semibold text-gray-700">100% Free</span> • <span className="font-semibold text-gray-700">Lightning Fast</span> • <span className="font-semibold text-gray-700">Secure & Private</span>
            </p>
          </div>

          {/* Main Tool Sections */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mb-16 md:mb-24">
          {/* PDF Tools Section */}
          <div 
            onClick={() => onSelectSection('pdf')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group animate-scale-in animate-delay-200"
          >
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-8 md:p-10 text-white">
              {/* PDF Icon */}
              <svg className="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">PDF Tools</h2>
              <p className="text-red-100 text-lg">
                Complete PDF processing suite
              </p>
            </div>
            <div className="p-8 md:p-10">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Merge, Split & Organize PDFs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Compress & Optimize file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Convert to/from Word, Excel, PowerPoint</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Edit, Rotate & Add watermarks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Password protect & Unlock PDFs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>OCR & Extract text from scans</span>
                </li>
              </ul>
              <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Explore PDF Tools →
              </button>
            </div>
          </div>

          {/* Image Tools Section */}
          <div 
            onClick={() => onSelectSection('image')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group animate-scale-in animate-delay-300"
          >
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 md:p-10 text-white">
              {/* Image Icon */}
              <svg className="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Image Tools</h2>
              <p className="text-purple-100 text-lg">
                Professional image editing suite
              </p>
            </div>
            <div className="p-8 md:p-10">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Compress, Resize & Crop images</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Convert between JPG, PNG, WEBP</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Rotate, Flip & Transform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Add watermarks & text overlays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Remove backgrounds automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Upscale images with AI</span>
                </li>
              </ul>
              <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Explore Image Tools →
              </button>
            </div>
          </div>

          {/* Video Tools Section */}
          <div 
            onClick={() => onSelectSection('video')}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden group animate-scale-in animate-delay-400"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 md:p-10 text-white">
              {/* Video Icon */}
              <svg className="w-16 h-16 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Video Tools</h2>
              <p className="text-blue-100 text-lg">
                Professional video processing suite
              </p>
            </div>
            <div className="p-8 md:p-10">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Convert between MP4, AVI, MOV, MKV, WEBM, FLV</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Compress videos & reduce file size</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Trim & cut video clips</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Convert video to animated GIF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Extract audio from videos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Support for 13+ video formats</span>
                </li>
              </ul>
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Explore Video Tools →
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-200 group-hover:rotate-6">
                <span className="text-4xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-blue-600">Secure & Private</h4>
              <p className="text-gray-600">
                Your files are processed securely and deleted immediately after processing
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200 group-hover:rotate-6">
                <span className="text-4xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-green-600">Lightning Fast</h4>
              <p className="text-gray-600">
                Process your files in seconds with our optimized infrastructure
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-200 group-hover:rotate-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-purple-600">Easy to Use</h4>
              <p className="text-gray-600">
                No installation required. Upload, process, and download - that's it!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-red-600 mb-2 animate-count">30+</div>
              <div className="text-gray-600">Tools Available</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Free to Use</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-blue-600 mb-2">Fast</div>
              <div className="text-gray-600">Processing Speed</div>
            </div>
            <div className="transform transition-all duration-300 hover:scale-110">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Available</div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💾</div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">No Installation Needed</h4>
                  <p className="text-gray-600 text-sm">
                    Works directly in your browser. No software to download or install.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🌐</div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Works on All Devices</h4>
                  <p className="text-gray-600 text-sm">
                    Use on Windows, Mac, Linux, iOS, or Android - works everywhere.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎨</div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Professional Quality</h4>
                  <p className="text-gray-600 text-sm">
                    High-quality output with advanced algorithms for best results.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="text-3xl">♾️</div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Unlimited Usage</h4>
                  <p className="text-gray-600 text-sm">
                    Process as many files as you need. No limits, no restrictions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default MainLandingPage;
