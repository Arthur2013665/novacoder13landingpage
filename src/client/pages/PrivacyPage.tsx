import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-500 to-aurora-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white group-hover:text-gradient transition-all duration-300">
              Nova AI
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">
            Privacy Policy
          </h1>
          <p className="text-dark-400">Last updated: January 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-dark-300 leading-relaxed">
              Welcome to Nova AI ("we," "our," or "us"). We are committed to protecting your privacy
              and ensuring the security of your personal information. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our
              AI-powered coding assistant service.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p><strong className="text-white">Personal Information:</strong> When you create an account, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Profile information you choose to provide</li>
              </ul>
              <p><strong className="text-white">Usage Information:</strong> We automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and feature interactions</li>
                <li>Code snippets and prompts you submit (see Code Data section)</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">3. Code Data & AI Processing</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                <strong className="text-white">Your Code is Yours:</strong> We do not claim ownership of any code you
                submit to or generate using Nova AI. Your intellectual property remains your own.
              </p>
              <p>
                <strong className="text-white">Processing:</strong> Code snippets you submit are processed by our AI
                models to generate responses. By default, we do not store your code after processing
                is complete.
              </p>
              <p>
                <strong className="text-white">Optional Improvement:</strong> With your explicit consent, anonymized
                code patterns may be used to improve our AI models. You can opt out of this at any
                time in your account settings.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">4. How We Use Your Information</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                <li>Personalize and improve your experience</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">5. Information Sharing</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>We do not sell your personal information. We may share information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Service Providers:</strong> With vendors who assist in providing our services</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong className="text-white">With Consent:</strong> When you give us permission to share</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">6. Data Security</h2>
            <p className="text-dark-300 leading-relaxed">
              We implement industry-standard security measures to protect your information, including
              encryption in transit and at rest, regular security audits, and access controls.
              However, no method of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">7. Your Rights & Choices</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@nova-ai.com" className="text-nova-400 hover:text-nova-300">
                  privacy@nova-ai.com
                </a>
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">8. Cookies & Tracking</h2>
            <p className="text-dark-300 leading-relaxed">
              We use cookies and similar technologies to collect information about your browsing
              activities. You can control cookies through your browser settings. Some features of
              our service may not function properly if you disable cookies.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">9. International Transfers</h2>
            <p className="text-dark-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your
              own. We ensure appropriate safeguards are in place to protect your information in
              accordance with this Privacy Policy.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-dark-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian
              and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">11. Changes to This Policy</h2>
            <p className="text-dark-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Last
              updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <div className="text-dark-300 leading-relaxed">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="mt-4 space-y-2">
                <li>
                  Email:{' '}
                  <a href="mailto:privacy@nova-ai.com" className="text-nova-400 hover:text-nova-300">
                    privacy@nova-ai.com
                  </a>
                </li>
                <li>Address: 123 AI Street, San Francisco, CA 94105</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-nova-400 hover:text-nova-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">© 2026 Nova AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-nova-400 text-sm">Privacy</Link>
            <Link to="/terms" className="text-dark-400 hover:text-white transition-colors text-sm">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
