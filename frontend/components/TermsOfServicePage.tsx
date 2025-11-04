import React from 'react';

const TermsOfServicePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
        <p className="text-gray-500 mb-8">Last Updated: November 4, 2025</p>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using <span className="font-semibold text-red-500">imageandpdf</span>, you accept and 
              agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, 
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              imageandpdf provides free online tools for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>PDF processing (merge, split, compress, convert, etc.)</li>
              <li>Image processing (resize, compress, convert, crop, etc.)</li>
              <li>Document conversion between various formats</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Our services are provided "as is" and we reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">3. User Responsibilities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use the service only for lawful purposes</li>
              <li>Not upload files containing viruses or malicious code</li>
              <li>Not upload copyrighted material without permission</li>
              <li>Not upload illegal, offensive, or harmful content</li>
              <li>Not attempt to hack, damage, or disrupt the service</li>
              <li>Not use the service to spam or distribute unsolicited content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">4. File Upload and Processing</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-800 font-semibold">📁 File Handling</p>
              <ul className="text-blue-700 mt-2 space-y-1">
                <li>• Maximum file size: 50MB per file</li>
                <li>• Files are automatically deleted after 1 hour</li>
                <li>• We do not store or access your file contents</li>
                <li>• You retain all rights to your uploaded files</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on imageandpdf, including but not limited to text, graphics, logos, and software, is the 
              property of imageandpdf or its licensors and is protected by copyright and intellectual property laws. 
              You may not copy, modify, or distribute any content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">6. User Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You retain all rights to files you upload to our service. By uploading files, you grant us a temporary 
              license to process them as requested. We will not use your files for any other purpose and will delete 
              them according to our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The service is provided "as is" and "as available" without warranties of any kind, either express or 
              implied. We do not guarantee that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
              <li>The service will be uninterrupted or error-free</li>
              <li>The results will meet your requirements</li>
              <li>All errors will be corrected</li>
              <li>The service is free of viruses or harmful components</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              imageandpdf shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use or inability to use the service. This includes, but is not limited to, damages 
              for loss of data, business interruption, or loss of profits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Indemnification</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify and hold harmless imageandpdf and its affiliates from any claims, damages, losses, 
              or expenses arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">10. Prohibited Activities</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You may not:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Use automated systems to access the service excessively</li>
              <li>Attempt to reverse engineer or decompile the service</li>
              <li>Upload files to circumvent file size limits</li>
              <li>Use the service for commercial purposes without permission</li>
              <li>Resell or redistribute our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">11. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, 
              for any reason, including breach of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">13. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms shall be governed by and construed in accordance with applicable laws, without regard to 
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">14. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@imageandpdf.com<br />
                <strong>Website:</strong> www.imageandpdf.com
              </p>
            </div>
          </section>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Important Notice</h3>
            <p className="text-yellow-700 text-sm">
              By using imageandpdf, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms of Service. If you do not agree, please discontinue use immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
