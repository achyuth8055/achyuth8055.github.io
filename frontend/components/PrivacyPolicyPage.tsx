import React from 'react';

const PrivacyPolicyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 text-red-500 hover:text-red-600 font-medium flex items-center gap-2"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 mb-8">Last Updated: November 4, 2025</p>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to <span className="font-semibold text-red-500">imageandpdf</span>. We respect your privacy and are 
              committed to protecting your personal data. This privacy policy will inform you about how we handle your data 
              when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We collect minimal information to provide our services:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Files you upload:</strong> Temporarily stored for processing only</li>
              <li><strong>Usage data:</strong> Anonymous analytics to improve our services</li>
              <li><strong>Technical data:</strong> IP address, browser type, and device information</li>
              <li><strong>Cookies:</strong> Essential cookies for website functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Your information is used solely for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Processing your files (PDF/Image conversions, compressions, etc.)</li>
              <li>Improving our website and services</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Ensuring security and preventing abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">4. File Storage and Deletion</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-green-800 font-semibold">🔒 Your Privacy is Our Priority</p>
              <p className="text-green-700 mt-2">
                All uploaded files are automatically deleted from our servers within 1 hour of upload or immediately 
                after processing, whichever comes first. We do not store, share, or use your files for any purpose 
                other than the service you requested.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">5. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure server infrastructure</li>
              <li>Regular security audits and updates</li>
              <li>Automatic file deletion after processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">6. Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use third-party services to enhance our website functionality and support our operations. 
              These services have their own privacy policies, and we encourage you to review them.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <h3 className="font-bold text-blue-800 mb-2">🔹 Google AdSense</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                We partner with <strong>Google AdSense</strong> to display advertisements on our website. Google AdSense 
                uses cookies and similar technologies to serve ads based on your prior visits to our website or other websites. 
                Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to 
                our site and/or other sites on the Internet.
              </p>
              <p className="text-blue-700 text-sm leading-relaxed mt-2">
                You may opt out of personalized advertising by visiting 
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" 
                   className="underline hover:text-blue-900 font-medium"> Google Ads Settings</a> or by visiting 
                <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" 
                   className="underline hover:text-blue-900 font-medium"> www.aboutads.info</a>.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
              <h3 className="font-bold text-purple-800 mb-2">📊 Google Analytics</h3>
              <p className="text-purple-700 text-sm leading-relaxed">
                We use <strong>Google Analytics</strong> to analyze website traffic and usage patterns. Google Analytics 
                uses cookies to collect anonymous information about how visitors interact with our site. This data helps 
                us improve our services and user experience. The information collected includes your IP address, browser 
                type, referring pages, and pages visited.
              </p>
              <p className="text-purple-700 text-sm leading-relaxed mt-2">
                You can opt out of Google Analytics by installing the 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                   className="underline hover:text-purple-900 font-medium"> Google Analytics Opt-out Browser Add-on</a>.
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Important:</strong> We do not share your uploaded files with any third parties. Third-party services 
              only have access to anonymized usage data and advertising-related information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your experience on our website. 
              Below is a detailed breakdown of the types of cookies we use:
            </p>
            
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🔹 Essential Cookies (Required)</h4>
                <p className="text-gray-600 text-sm">
                  These cookies are necessary for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility. These cookies do not store any personally 
                  identifiable information and cannot be disabled.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Purpose:</strong> Session management, security, load balancing
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">📊 Analytics Cookies (Optional)</h4>
                <p className="text-gray-600 text-sm">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. We use Google Analytics to track page views, session duration, bounce rates, 
                  and traffic sources. This data helps us improve our services.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Provider:</strong> Google Analytics | <strong>Duration:</strong> Up to 2 years
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">🎯 Advertising Cookies (Optional)</h4>
                <p className="text-gray-600 text-sm">
                  These cookies are used by Google AdSense to display relevant advertisements. They may track your 
                  browsing activity across different websites to show personalized ads. These cookies help us generate 
                  revenue to keep our services free.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Provider:</strong> Google AdSense | <strong>Duration:</strong> Up to 2 years
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-2">⚙️ Preference Cookies (Optional)</h4>
                <p className="text-gray-600 text-sm">
                  These cookies remember your preferences and choices (such as language, region, or cookie consent) 
                  to provide a more personalized experience. They do not track your browsing activity.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  <strong>Duration:</strong> Up to 1 year
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <h4 className="font-bold text-yellow-800 mb-2">🍪 Managing Your Cookie Preferences</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                You can manage your cookie preferences through our cookie consent banner (displayed on your first visit) 
                or through your browser settings. Note that disabling certain cookies may affect website functionality.
              </p>
              <p className="text-yellow-700 text-sm leading-relaxed mt-2">
                Most web browsers allow you to control cookies through their settings. Learn more about cookie management:
              </p>
              <ul className="list-disc list-inside text-yellow-700 text-sm mt-2 ml-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" 
                       className="underline hover:text-yellow-900">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" 
                       target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" 
                       rel="noopener noreferrer" className="underline hover:text-yellow-900">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                       target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">Edge</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">8. Data Collection and Processing</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              We are committed to transparency about what data we collect and how we use it:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Data Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Uploaded Files (PDF/Images)</td>
                    <td className="px-4 py-3 text-gray-600">File processing and conversion</td>
                    <td className="px-4 py-3 text-gray-600">Max 1 hour, deleted after processing</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">IP Address</td>
                    <td className="px-4 py-3 text-gray-600">Security, abuse prevention, analytics</td>
                    <td className="px-4 py-3 text-gray-600">Up to 90 days (anonymized)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Browser & Device Info</td>
                    <td className="px-4 py-3 text-gray-600">Compatibility and optimization</td>
                    <td className="px-4 py-3 text-gray-600">Session duration only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Usage Statistics</td>
                    <td className="px-4 py-3 text-gray-600">Service improvement and analytics</td>
                    <td className="px-4 py-3 text-gray-600">Up to 2 years (anonymized)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700">Cookie Preferences</td>
                    <td className="px-4 py-3 text-gray-600">Remember your consent choices</td>
                    <td className="px-4 py-3 text-gray-600">Up to 1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">9. Your Rights (GDPR & CCPA Compliance)</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Depending on your location, you have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal data ("Right to be Forgotten")</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data for certain purposes</li>
              <li><strong>Right to Restrict Processing:</strong> Request restriction of processing under certain circumstances</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time for cookies and tracking</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at <strong>privacy@imageandpdf.com</strong>. 
              We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">10. International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. When we transfer your data internationally, 
              we ensure appropriate safeguards are in place to protect your information in accordance with applicable 
              data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">11. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our service is not directed to children under 13 years of age (or 16 in the European Union). 
              We do not knowingly collect personal information from children. If you are a parent or guardian and 
              believe your child has provided us with personal information, please contact us immediately, and we 
              will take steps to remove that information from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">12. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this privacy policy from time to time to reflect changes in our practices, technology, 
              legal requirements, or other factors. Any changes will be posted on this page with an updated revision 
              date at the top. We encourage you to review this policy periodically. If we make material changes, 
              we will provide notice through our website or other means.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">13. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions, concerns, or requests regarding this privacy policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@imageandpdf.com<br />
                <strong>Website:</strong> www.imageandpdf.com<br />
                <strong>Response Time:</strong> Within 48-72 hours
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">
              For GDPR-related inquiries (EU residents), please include "GDPR Request" in your email subject line. 
              For CCPA-related inquiries (California residents), please include "CCPA Request" in your subject line.
            </p>
          </section>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-red-800 mb-2">📌 Summary</h3>
            <p className="text-red-700 text-sm">
              We collect minimal data, delete your files immediately after processing, and never share your information 
              with third parties. Your privacy and security are our top priorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
