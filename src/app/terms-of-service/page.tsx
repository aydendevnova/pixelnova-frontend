export default function TermsOfService() {
  return (
    <div className="mx-auto mt-20 max-w-4xl bg-white px-4 py-8 text-black">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>
      <h3>A product of PixelNova LLC</h3>

      <div className="space-y-6 text-gray-800">
        <p className="mb-8 text-sm text-gray-600">
          Effective Date: 15 of June, 2025
        </p>

        <p className="mb-8">
          These Terms of Service ("Terms") govern your access to and use of the
          Pixel Nova platform ("Service" or "Pixel Nova"), provided by PixelNova
          LLC, a company organized under the laws of Florida, United States
          ("Provider," "Company," "we," "us," or "our"). By accessing or using
          the Service, you agree to be bound by these Terms.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            1. Acceptance and Eligibility
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">1.1. Agreement to Terms</h3>
              <p>
                By creating an account, accessing, or using the Service, you
                acknowledge that you have read, understood, and agree to be
                bound by these Terms and our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                . If you do not agree to these Terms, you may not use the
                Service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">1.2. Age Requirements</h3>
              <p>
                You must be at least 13 years old to use Pixel Nova. Users
                between 13 and 18 years old must have parental or legal guardian
                consent. Users under 13 are strictly prohibited from using the
                Service in compliance with COPPA (Children's Online Privacy
                Protection Act).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">1.3. Legal Capacity</h3>
              <p>
                You represent that you have the legal authority to enter into
                these Terms. If you are using the Service on behalf of an
                organization, you represent that you have authority to bind that
                organization to these Terms.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            2. Account Registration and Security
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">2.1. Account Creation</h3>
              <p>
                Account registration is required to access AI generation
                features and certain functionality. You must provide accurate,
                complete, and current information during registration and
                maintain the accuracy of this information.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">2.2. Account Security</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials
                </li>
                <li>
                  You are fully responsible for all activities conducted through
                  your account
                </li>
                <li>
                  You must immediately notify us of any unauthorized use or
                  security breach
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts with
                  suspicious activity
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">2.3. Account Information</h3>
              <p>
                You agree not to create accounts using false information,
                impersonate others, or create multiple accounts to circumvent
                usage limits. Usernames and profile information must comply with
                our content policies.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. Service Description and Availability
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">3.1. Service Features</h3>
              <p>
                Pixel Nova provides AI-powered pixel art generation, image
                conversion tools, and related creative services. Features
                include but are not limited to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>AI-generated pixel art creation</li>
                <li>Image-to-pixel-art conversion</li>
                <li>Personal gallery and asset management</li>
                <li>Editor tools and canvas functionality</li>
                <li>Export and download capabilities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">3.2. Service Availability</h3>
              <p>
                We strive to maintain high service availability but do not
                guarantee uninterrupted access. The Service may be temporarily
                unavailable due to maintenance, updates, or circumstances beyond
                our control. We do not provide service level agreements (SLAs)
                for free tier users.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                3.3. Beta Features and Updates
              </h3>
              <p>
                We may offer beta or experimental features. These features are
                provided "as is" and may be modified or discontinued without
                notice. Pro users may receive early access to new features as
                part of their subscription benefits.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            4. Subscription Plans and Billing
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">4.1. Plan Types</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Free Tier:</strong> Limited generations and
                  conversions with basic support
                </li>
                <li>
                  <strong>Pro Subscription:</strong> Monthly recurring
                  subscription with increased limits and priority features
                </li>
                <li>
                  <strong>Buy-as-You-Go (Future):</strong> Pay-per-use model for
                  additional credits beyond subscription limits
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">4.2. Payment Processing</h3>
              <p>
                All payments are processed securely through Stripe, Inc. By
                subscribing, you authorize us to charge your chosen payment
                method for applicable fees. We do not store your payment
                information on our servers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">4.3. Billing and Renewals</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>Subscription fees are billed monthly in advance</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>
                  Usage limits reset at the beginning of each billing cycle
                </li>
                <li>
                  Price changes will be communicated with at least 30 days
                  notice
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                4.4. Cancellation and Refunds
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  You may cancel your subscription at any time through your
                  account settings
                </li>
                <li>
                  Cancellation takes effect at the end of the current billing
                  period
                </li>
                <li>
                  No refunds are provided for partial months except where
                  required by law
                </li>
                <li>
                  Refunds may be granted at our sole discretion for technical
                  issues or service failures
                </li>
                <li>Disputed charges should be reported within 60 days</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                4.5. Usage Limits and Overage
              </h3>
              <p>
                Each plan includes specific usage limits. Exceeding limits may
                result in service restrictions until the next billing cycle or
                require additional credit purchases when available.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            5. User Content and Intellectual Property
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">5.1. Content Ownership</h3>
              <p>
                You retain full ownership of all art and content you create
                using Pixel Nova, including AI-generated pixel art. This
                includes commercial rights to use, modify, distribute, and
                monetize your creations without restriction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">5.2. License to PixelNova</h3>
              <p>
                You grant us a non-exclusive, royalty-free, worldwide license
                to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Store, process, and display your content as necessary to
                  provide the Service
                </li>
                <li>
                  Use anonymized, aggregated data for service improvement and
                  analytics
                </li>
                <li>Perform automated content moderation and safety checks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                5.3. Public URLs and Accessibility
              </h3>
              <p>
                Generated images are stored with publicly accessible URLs by
                default. While these URLs are not indexed or easily
                discoverable, anyone with the URL can view the image. You can
                request removal of specific images through our support.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">5.4. Data Training Policy</h3>
              <p>
                Currently, user-submitted data and generated content are not
                used for AI model training. We reserve the right to change this
                policy with advance notice and Privacy Policy updates. Any
                future use will include opt-out mechanisms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">5.5. Copyright and DMCA</h3>
              <p>
                You are responsible for ensuring your content does not infringe
                third-party rights. We respond to valid DMCA takedown notices.
                Repeat infringers may have their accounts terminated.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Acceptable Use Policy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">6.1. Prohibited Content</h3>
              <p>
                You agree not to create, upload, or distribute content that is:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Illegal, obscene, pornographic, sexually explicit, violent, or
                  hateful
                </li>
                <li>Harassing, discriminatory, threatening, or defamatory</li>
                <li>Infringing on intellectual property rights of others</li>
                <li>Containing malicious code or security vulnerabilities</li>
                <li>Promoting illegal activities or substances</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                6.2. Strictly Prohibited Activities
              </h3>
              <div className="border-l-4 border-red-500 bg-red-50 p-4">
                <p className="font-bold text-red-700">
                  The following activities are strictly forbidden and violate US
                  federal law:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-red-700">
                  <li>
                    Generation of non-consensual intimate imagery (deepfakes)
                  </li>
                  <li>
                    Creation of sexually explicit content involving minors (real
                    or simulated)
                  </li>
                  <li>Any depiction of exploitation or abuse</li>
                  <li>
                    Content that violates our AI model providers' terms (OpenAI,
                    Hugging Face)
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                6.3. Technical Restrictions
              </h3>
              <p>You may not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Reverse-engineer, decompile, or extract source code or AI
                  models
                </li>
                <li>
                  Circumvent usage limits, security measures, or access controls
                </li>
                <li>Use automated systems to spam or flood the service</li>
                <li>
                  Attempt to gain unauthorized access to other users' accounts
                  or data
                </li>
                <li>Interfere with or disrupt the Service's infrastructure</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                6.4. Commercial Use Restrictions
              </h3>
              <p>While you own your generated content, you may not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Resell access to the Pixel Nova service itself</li>
                <li>
                  Create competing AI pixel art services using our outputs as
                  training data
                </li>
                <li>
                  Use the service for high-volume commercial generation without
                  appropriate plans
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            7. Content Moderation and Enforcement
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">7.1. Automated Moderation</h3>
              <p>
                We employ automated systems to detect prohibited content
                including:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Blacklisted words and phrases in prompts</li>
                <li>Content scanning for policy violations</li>
                <li>Usage pattern analysis for abuse detection</li>
                <li>Rate limiting and spam prevention</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">7.2. Enforcement Actions</h3>
              <p>Violations may result in:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Content removal or blocking</li>
                <li>Temporary account suspension</li>
                <li>Permanent account termination</li>
                <li>Reporting to appropriate legal authorities</li>
                <li>Forfeiture of remaining subscription benefits</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">7.3. Appeals Process</h3>
              <p>
                If you believe enforcement action was taken in error, you may
                appeal by contacting{" "}
                <a
                  href="mailto:support@pixelnova.app"
                  className="text-blue-600 hover:underline"
                >
                  support@pixelnova.app
                </a>{" "}
                within 30 days. We will review appeals in good faith but
                decisions are final.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            8. API Access and Developer Terms
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">8.1. Future API Access</h3>
              <p>
                API access may be offered in the future subject to separate
                terms and rate limits. Current rate limiting applies to web
                application usage.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">8.2. Rate Limits</h3>
              <p>Current rate limits apply:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>200 requests per 15 minutes for general API endpoints</li>
                <li>250 requests per hour for AI generation endpoints</li>
                <li>Additional limits based on subscription tier</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Data and Privacy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">9.1. Data Collection</h3>
              <p>
                Our data collection and use practices are governed by our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                , which is incorporated by reference into these Terms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">9.2. Data Export</h3>
              <p>
                You may request export of your personal data and generated
                content by contacting support. We will provide data in a
                commonly used, machine-readable format within 30 days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">9.3. Data Retention</h3>
              <p>
                We retain user data as outlined in our Privacy Policy. Upon
                account deletion, personal data is removed within 30 days,
                though generated images may remain publicly accessible unless
                specifically requested for removal.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Third-Party Services</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">10.1. Service Providers</h3>
              <p>Our service integrates with third-party providers:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Stripe:</strong> Payment processing and subscription
                  management
                </li>
                <li>
                  <strong>Supabase:</strong> Database and authentication
                  services
                </li>
                <li>
                  <strong>OpenAI & Hugging Face:</strong> AI model providers
                </li>
                <li>
                  <strong>Cloudflare:</strong> Content delivery and security
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">10.2. Third-Party Terms</h3>
              <p>
                Your use of integrated services is subject to their respective
                terms of service. We are not responsible for third-party service
                availability or policies.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            11. Disclaimers and Warranties
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">11.1. Service Disclaimer</h3>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL
                WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, NON-INFRINGEMENT, AND AVAILABILITY.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                11.2. AI-Generated Content
              </h3>
              <p>
                AI-generated content may be unpredictable. We do not guarantee
                the accuracy, quality, or appropriateness of generated outputs.
                Users are responsible for reviewing and validating all generated
                content.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">11.3. External Links</h3>
              <p>
                We are not responsible for the content or availability of
                external websites or services linked from our platform.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">12. Limitation of Liability</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">12.1. Liability Cap</h3>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR
                ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT
                EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS
                PRECEDING THE CLAIM.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">12.2. Excluded Damages</h3>
              <p>
                WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL,
                SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA,
                OR GOODWILL, EVEN IF ADVISED OF THEIR POSSIBILITY.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">12.3. Force Majeure</h3>
              <p>
                We are not liable for delays or failures due to circumstances
                beyond our reasonable control, including natural disasters,
                government actions, network failures, or third-party service
                outages.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">13. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless PixelNova LLC, its
            affiliates, officers, directors, employees, and agents from any
            claims, damages, losses, liabilities, and expenses (including
            reasonable attorneys' fees) arising from:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Your use of the Service or violation of these Terms</li>
            <li>Your content or any intellectual property infringement</li>
            <li>Your violation of any third-party rights</li>
            <li>
              Any misuse of generated content or our intellectual property
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">14. Termination</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">14.1. Termination by You</h3>
              <p>
                You may terminate your account at any time by contacting support
                or using account deletion features. Paid subscriptions will
                continue until the end of the current billing period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">14.2. Termination by Us</h3>
              <p>We may suspend or terminate your access immediately for:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Violation of these Terms or our policies</li>
                <li>Failure to pay subscription fees</li>
                <li>Illegal or harmful activities</li>
                <li>Extended periods of inactivity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                14.3. Effect of Termination
              </h3>
              <p>
                Upon termination, your right to use the Service ceases
                immediately. We may delete your account data subject to our
                Privacy Policy, though generated images with public URLs may
                remain accessible.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">15. Dispute Resolution</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">15.1. Governing Law</h3>
              <p>
                These Terms are governed by the laws of the State of Florida and
                the United States, without regard to conflict of law principles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">15.2. Arbitration</h3>
              <p>
                Any disputes arising under these Terms shall be resolved through
                binding arbitration in Florida, administered by the American
                Arbitration Association, except where prohibited by law or for
                claims under $10,000.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">15.3. Class Action Waiver</h3>
              <p>
                You agree to resolve disputes individually and waive any right
                to participate in class actions, except where prohibited by law.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            16. Export Control and International Use
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">16.1. Export Compliance</h3>
              <p>
                The Service may be subject to US export control laws. You agree
                to comply with all applicable export and import laws and
                regulations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">
                16.2. International Access
              </h3>
              <p>
                The Service is operated from the United States. Users accessing
                from other jurisdictions are responsible for compliance with
                local laws.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            17. Modifications and Updates
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">17.1. Terms Updates</h3>
              <p>
                We reserve the right to modify these Terms at any time. Material
                changes will be communicated via email or in-app notification at
                least 30 days before taking effect.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">17.2. Service Changes</h3>
              <p>
                We may modify, suspend, or discontinue any aspect of the Service
                with or without notice. We will provide reasonable notice for
                material changes affecting paid features.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">17.3. Continued Use</h3>
              <p>
                Your continued use of the Service after Terms modifications
                constitutes acceptance of the updated Terms. If you disagree
                with changes, you may terminate your account.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">18. General Provisions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">18.1. Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, constitute the
                entire agreement between you and PixelNova LLC regarding the
                Service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">18.2. Severability</h3>
              <p>
                If any provision of these Terms is found unenforceable, the
                remaining provisions will remain in full force and effect.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">18.3. Assignment</h3>
              <p>
                You may not assign or transfer your rights under these Terms. We
                may assign our rights and obligations to any party without
                restriction.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">18.4. Waiver</h3>
              <p>
                Our failure to enforce any provision of these Terms does not
                constitute a waiver of that provision or any other provision.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">18.5. Notices</h3>
              <p>
                Legal notices will be sent to the email address associated with
                your account. You are responsible for keeping your contact
                information current.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">19. Contact Information</h2>
          <p>For questions about these Terms or the Service, contact us at:</p>
          <div className="mt-4">
            <p>
              <strong>PixelNova LLC</strong>
              <br />
              Legal Department
              <br />
              Email:{" "}
              <a
                href="mailto:support@pixelnova.app"
                className="text-blue-600 hover:underline"
              >
                support@pixelnova.app
              </a>
              <br />
              Subject Line: "Terms of Service Inquiry"
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              For billing questions, use subject line "Billing Inquiry"
              <br />
              For DMCA notices, use subject line "DMCA Notice"
              <br />
              For abuse reports, use subject line "Abuse Report"
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
