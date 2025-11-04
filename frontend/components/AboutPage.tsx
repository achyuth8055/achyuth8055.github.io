import React from 'react';

const AboutPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About <span className="text-red-500">image</span>and<span className="text-red-500">pdf</span></h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-6">
            Welcome to <strong className="text-red-500">imageandpdf</strong>, your one-stop solution for all document and image processing needs. 
            We believe that powerful tools should be accessible to everyone, which is why we've created a platform that's 
            completely free, easy to use, and requires no registration.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our mission is to provide fast, reliable, and secure tools that help people work more efficiently with their 
            documents and images. Whether you're a student, professional, or small business owner, we're here to make 
            your digital workflow smoother.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-600 mb-3">📄 PDF Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Merge multiple PDFs</li>
                <li>• Split PDF into pages</li>
                <li>• Compress PDF files</li>
                <li>• Convert PDF to Word, Excel, PPT</li>
                <li>• Convert documents to PDF</li>
                <li>• Rotate and watermark PDFs</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-600 mb-3">🖼️ Image Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Resize images</li>
                <li>• Compress images</li>
                <li>• Convert image formats</li>
                <li>• Crop images</li>
                <li>• Rotate and flip images</li>
                <li>• Batch processing</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-6 my-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-bold text-gray-800 mb-2">100% Secure</h4>
              <p className="text-sm text-gray-600">Your files are processed securely and deleted immediately after</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-gray-800 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600">Advanced algorithms ensure quick processing times</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🆓</div>
              <h4 className="font-bold text-gray-800 mb-2">Completely Free</h4>
              <p className="text-sm text-gray-600">No hidden fees, no subscriptions, no watermarks</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Our Commitment</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We are committed to maintaining the highest standards of quality and security. Your privacy is our priority, 
            and we never store your files longer than necessary. All uploads are automatically deleted after processing.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Join Our Community</h3>
            <p className="text-gray-600 mb-4">
              Join over 500,000+ users who trust imageandpdf for their document and image processing needs. 
              We're constantly improving and adding new features based on user feedback.
            </p>
            <div className="flex gap-4 items-center justify-center mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">10M+</p>
                <p className="text-sm text-gray-600">Files Processed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">500K+</p>
                <p className="text-sm text-gray-600">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-500">25+</p>
                <p className="text-sm text-gray-600">Free Tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
