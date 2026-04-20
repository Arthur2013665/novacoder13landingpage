import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-dark-400">Last updated: January 1, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              By accessing or using Nova AI's services, website, or applications (collectively, the
              "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not
              agree to these Terms, you may not access or use the Services. These Terms constitute
              a legally binding agreement between you and Nova AI.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">2. Description of Services</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                Nova AI provides an AI-powered coding assistant that helps developers write,
                refactor, and understand code. Our Services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered code generation and completion</li>
                <li>Code refactoring and optimization suggestions</li>
                <li>Natural language to code translation</li>
                <li>Code explanation and documentation</li>
                <li>Integration with development tools and IDEs</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">3. Account Registration</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information as needed</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms
                or for any other reason at our sole discretion.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>You agree NOT to use the Services to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generate malicious code, malware, or security exploits</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to reverse engineer or extract our AI models</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Use automated systems to access the Services without permission</li>
                <li>Generate content that is illegal, harmful, or offensive</li>
              </ul>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                <strong className="text-white">Your Content:</strong> You retain all rights to the code and content
                you submit to our Services. By using our Services, you grant us a limited license
                to process your content solely for the purpose of providing the Services.
              </p>
              <p>
                <strong className="text-white">Generated Output:</strong> You own the code generated by Nova AI
                based on your inputs, subject to any applicable third-party licenses. However, similar
                outputs may be generated for other users based on similar inputs.
              </p>
              <p>
                <strong className="text-white">Our Services:</strong> Nova AI and its licensors retain all rights
                to the Services, including our AI models, algorithms, software, trademarks, and
                other intellectual property.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">6. Payment Terms</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                <strong className="text-white">Subscriptions:</strong> Some features require a paid subscription.
                You agree to pay all applicable fees as described at the time of purchase.
              </p>
              <p>
                <strong className="text-white">Billing:</strong> Subscriptions are billed in advance on a monthly
                or annual basis. Your subscription will automatically renew unless you cancel
                before the renewal date.
              </p>
              <p>
                <strong className="text-white">Refunds:</strong> Refunds are provided at our discretion. Annual
                subscriptions may be eligible for prorated refunds within 14 days of purchase.
              </p>
              <p>
                <strong className="text-white">Price Changes:</strong> We reserve the right to change our prices.
                We will provide notice of price changes before they take effect.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">7. Disclaimers</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p className="uppercase text-sm">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                <strong className="text-white">AI Limitations:</strong> AI-generated code may contain errors,
                bugs, or security vulnerabilities. You are solely responsible for reviewing,
                testing, and validating any code before use in production environments.
              </p>
              <p>
                <strong className="text-white">No Guarantee:</strong> We do not guarantee that the Services will
                be uninterrupted, error-free, or meet your specific requirements.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-dark-300 leading-relaxed uppercase text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NOVA AI SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR THE
              SERVICES, REGARDLESS OF THE THEORY OF LIABILITY. OUR TOTAL LIABILITY SHALL NOT
              EXCEED THE AMOUNTS PAID BY YOU TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">9. Indemnification</h2>
            <p className="text-dark-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Nova AI and its officers,
              directors, employees, and agents from any claims, damages, losses, and expenses
              (including reasonable attorneys' fees) arising out of your use of the Services,
              violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">10. Termination</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                We may suspend or terminate your access to the Services at any time, with or
                without cause, with or without notice. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your right to use the Services will immediately cease</li>
                <li>We may delete your account and associated data</li>
                <li>Provisions that should survive termination will remain in effect</li>
              </ul>
              <p>
                You may terminate your account at any time by contacting us or through your
                account settings.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p className="text-dark-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of California, without regard to its conflict of law provisions. Any disputes
              arising under these Terms shall be resolved exclusively in the state or federal
              courts located in San Francisco County, California.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
            <p className="text-dark-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of
              material changes by posting the updated Terms on our website and updating the "Last
              updated" date. Your continued use of the Services after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">13. Miscellaneous</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed">
              <p>
                <strong className="text-white">Entire Agreement:</strong> These Terms, along with our Privacy
                Policy, constitute the entire agreement between you and Nova AI.
              </p>
              <p>
                <strong className="text-white">Severability:</strong> If any provision is found unenforceable,
                the remaining provisions will continue in effect.
              </p>
              <p>
                <strong className="text-white">Waiver:</strong> Our failure to enforce any right does not
                constitute a waiver of that right.
              </p>
              <p>
                <strong className="text-white">Assignment:</strong> You may not assign these Terms without our
                consent. We may assign our rights and obligations freely.
              </p>
            </div>
          </section>

          <section className="glass rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">14. Contact Us</h2>
            <div className="text-dark-300 leading-relaxed">
              <p>If you have any questions about these Terms, please contact us:</p>
              <ul className="mt-4 space-y-2">
                <li>
                  Email:{' '}
                  <a href="mailto:legal@nova-ai.com" className="text-nova-400 hover:text-nova-300">
                    legal@nova-ai.com
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
            <Link to="/privacy" className="text-dark-400 hover:text-white transition-colors text-sm">Privacy</Link>
            <Link to="/terms" className="text-nova-400 text-sm">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
