export default function PrivacyPolicy() {
  return (
    <div className="mx-auto mt-20 max-w-4xl bg-white px-4 py-8 text-black">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

      <div className="space-y-6 text-gray-800">
        <p className="mb-8 text-sm text-gray-600">
          Effective Date: 15 of June, 2025
        </p>

        <p className="mb-8">
          PixelNova LLC ("Pixel Nova," "we," "us," or "our"), located in
          Florida, United States, respects your privacy and is committed to
          protecting your personal information. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you use
          our services.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Scope</h2>
          <p>
            This Privacy Policy applies to all users of the Pixel Nova platform,
            including but not limited to the website, applications, and related
            services provided by Pixel Nova LLC.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <p>We collect the following categories of information:</p>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.1. Account Information</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Email address</li>
              <li>Username</li>
              <li>
                Third-party provider information (if applicable; e.g. Google,
                GitHub)
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.2. Google User Data</h3>
            <p>When you sign in with Google, we may collect:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Google account email address</li>
              <li>Google profile information (name, profile picture)</li>
              <li>Google OAuth tokens for authentication</li>
            </ul>

            <div className="mt-4 border-l-4 border-blue-200  p-4">
              <h4 className="mb-2 font-semibold">
                Google API Services User Data Policy Compliance
              </h4>
              <p className="mb-2 text-sm">
                Our use of Google user data strictly adheres to Google's API
                Terms of Service, API Services User Data Policy, and Limited Use
                requirements. Specifically:
              </p>

              <p className="mb-1 text-sm font-medium">
                How We Access Google User Data:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>
                  We request minimal necessary scopes for authentication and
                  profile access only
                </li>
                <li>
                  OAuth consent is obtained before accessing any Google user
                  data
                </li>
                <li>
                  Access is limited to profile information and email for account
                  creation/login
                </li>
              </ul>

              <p className="mb-1 mt-3 text-sm font-medium">
                How We Use Google User Data:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>Authenticate your identity and provide secure login</li>
                <li>Create and maintain your Pixel Nova account</li>
                <li>
                  Provide user-facing features prominent in our app interface
                </li>
                <li>Maintain security and prevent abuse</li>
              </ul>

              <p className="mb-1 mt-3 text-sm font-medium">
                How We Store Google User Data:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>
                  Stored securely in our Supabase database with encryption
                </li>
                <li>
                  Retained only as long as necessary for service provision
                </li>
                <li>
                  No storage of sensitive Google data beyond basic profile
                  information
                </li>
              </ul>

              <p className="mb-1 mt-3 text-sm font-medium">
                How We Share Google User Data:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>
                  We do NOT sell, lease, or license Google user data to third
                  parties
                </li>
                <li>
                  We do NOT transfer Google user data to advertising platforms
                  or data brokers
                </li>
                <li>
                  We do NOT use Google user data for advertising, retargeting,
                  or credit decisions
                </li>
                <li>
                  Limited sharing only for: security purposes, legal compliance,
                  or with explicit user consent
                </li>
              </ul>

              <p className="mb-1 mt-3 text-sm font-medium">
                Limited Use Compliance:
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>
                  Google user data is used solely for features visible in Pixel
                  Nova's interface
                </li>
                <li>
                  No human reading of data except for security, legal
                  compliance, or with explicit consent
                </li>
                <li>
                  Data is not used for AI model training without explicit user
                  consent
                </li>
                <li>
                  All employees and contractors comply with Google's User Data
                  Policy
                </li>
              </ul>

              <p className="mb-1 mt-3 text-sm font-medium">User Control:</p>
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>
                  You can revoke Pixel Nova's access through your Google Account
                  settings at any time
                </li>
                <li>
                  You can request deletion of your Google user data through our{" "}
                  <a href="/support" className="text-blue-800 hover:underline">
                    support
                  </a>
                  .
                </li>
                <li>
                  Transparent consent process with clear scope explanations
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.3. Usage Data</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Prompts and inputs provided when generating content</li>
              <li>
                AI generation outputs (pixel art images), which are stored in
                publicly accessible URLs
              </li>
              <li>
                IP address, browser type, device information, operating system,
                and usage logs
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.4. Analytics Data</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Aggregated usage metrics</li>
              <li>Behavioral data for platform improvement</li>
              <li>Website performance and user interaction data</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              We use Umami Analytics and Cloudflare Analytics to collect
              anonymous usage data. These privacy-focused analytics platforms
              help us understand how users interact with our service while
              respecting user privacy:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-sm text-gray-600">
              <li>
                Umami Analytics: Collects basic metrics like page views and
                events without using cookies or collecting personal information
              </li>
              <li>
                Cloudflare Analytics: Provides web analytics without storing
                personal data or using cookies, focusing on aggregated
                performance and security metrics
              </li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Both analytics services are configured to respect Do Not Track
              (DNT) browser settings and do not perform cross-site tracking.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.5. Moderation and Logging</h3>
            <p>
              Logs of user activity for abuse prevention, moderation, and
              security monitoring
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.6. AI Processing Data</h3>
            <p>
              Prompts and related data are shared with model providers,
              including OpenAI and Hugging Face, for the purpose of generating
              content.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Use of Information</h2>
          <p>We use the collected data to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide, operate, and improve the Service</li>
            <li>Process user requests and generate AI-driven pixel art</li>
            <li>
              Perform security monitoring, abuse detection, and moderation
            </li>
            <li>Conduct internal analytics and research</li>
            <li>Facilitate customer support and respond to user inquiries</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3.1. Cookies and Local Storage
          </h2>
          <p>
            We use cookies and similar technologies to enhance your experience,
            provide functionality, and analyze usage patterns:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Essential Cookies:</strong> Required for authentication,
              security, and basic functionality
            </li>
            <li>
              <strong>Functional Cookies:</strong> Store user preferences and
              settings
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Used by Umami and Cloudflare
              Analytics for anonymous usage tracking
            </li>
            <li>
              <strong>Local Storage:</strong> Stores temporary data like canvas
              states and user preferences in your browser
            </li>
          </ul>
          <p className="mt-4">
            You can control cookie settings through your browser preferences.
            Disabling essential cookies may impact service functionality.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            4. Disclosure of Information
          </h2>
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>AI Model Providers:</strong> Prompts and related data are
              transmitted to third-party model providers such as OpenAI and
              Hugging Face.
            </li>
            <li>
              <strong>Cloud Storage Providers:</strong> User data, including
              generated images, is stored via Supabase providers and associated
              cloud infrastructure.
            </li>
            <li>
              <strong>Google User Data:</strong> Google user data is handled in
              accordance with Google's Limited Use requirements and is not
              shared with third parties except as necessary to provide our
              service or comply with applicable law.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information
              if required to do so by law, subpoena, or other legal process.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger,
              acquisition, or sale of assets, user information may be
              transferred.
            </li>
          </ul>
          <p className="mt-4">
            We do not sell, lease, or license personal data to third parties for
            marketing or advertising purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            5. Data Storage and Retention
          </h2>
          <p>
            User data is stored on cloud infrastructure provided by Supabase and
            may reside in the United States or other jurisdictions. Publicly
            generated images are stored with publicly accessible URLs.
          </p>
          <p className="mt-4">
            We retain user data as long as necessary for the purposes described
            in this Privacy Policy unless a longer retention period is required
            by law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p>
            We implement reasonable technical and organizational measures to
            protect your personal data, including:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Secure access controls</li>
            <li>Encrypted storage for sensitive data</li>
            <li>Activity logging and monitoring</li>
          </ul>
          <p className="mt-4">
            However, no system can guarantee absolute security. Users are
            responsible for safeguarding their account credentials.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6.1. Payment Processing</h2>
          <p>
            Payment transactions are processed by Stripe, Inc. ("Stripe"). When
            you make a purchase:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Payment information is collected and processed directly by Stripe
            </li>
            <li>
              We receive transaction confirmations and subscription status
              updates
            </li>
            <li>No credit card information is stored on our servers</li>
            <li>
              Stripe's privacy policy governs how your payment data is handled
            </li>
          </ul>
          <p className="mt-4">
            For billing inquiries, contact us at support@pixelnova.app. For
            payment security questions, refer to Stripe's privacy policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            6.2. International Data Transfers
          </h2>
          <p>
            Your personal data may be transferred to, stored, and processed in
            countries other than your country of residence, including the United
            States. We ensure appropriate safeguards are in place:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Standard contractual clauses for data transfers outside the EU/EEA
            </li>
            <li>
              Adequacy decisions by the European Commission where applicable
            </li>
            <li>Compliance with applicable data protection laws</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            6.3. Content Ownership and Generated Images
          </h2>
          <p>Regarding content generated through our service:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>You retain ownership of prompts and inputs you provide</li>
            <li>
              Generated pixel art images are owned by you, subject to our Terms
              of Service
            </li>
            <li>Images are stored with publicly accessible URLs by default</li>
            <li>
              We reserve the right to use anonymized, aggregated data for
              service improvement
            </li>
            <li>Content that violates our terms may be removed or blocked</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            6.4. Automated Decision Making and AI Processing
          </h2>
          <p>Our service uses automated systems and AI models for:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Content generation based on your prompts</li>
            <li>Content moderation and safety filtering</li>
            <li>Usage pattern analysis for service improvement</li>
            <li>Abuse detection and prevention</li>
          </ul>
          <p className="mt-4">
            You have the right to request human review of automated decisions
            that significantly affect you.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Enhanced User Rights</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">7.1. General Rights</h3>
            <p>All users have the following rights:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your data
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a structured
                format
              </li>
              <li>
                <strong>Objection:</strong> Object to processing for certain
                purposes
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              7.2. California Residents (CCPA)
            </h3>
            <p>
              California residents have additional rights under the California
              Consumer Privacy Act:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Know:</strong> Right to know what personal information
                is collected and how it's used
              </li>
              <li>
                <strong>Delete:</strong> Right to delete personal information
              </li>
              <li>
                <strong>Opt-Out:</strong> Right to opt-out of the sale of
                personal information (we don't sell data)
              </li>
              <li>
                <strong>Non-Discrimination:</strong> Right not to be
                discriminated against for exercising privacy rights
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              7.3. EU/EEA Residents (GDPR)
            </h3>
            <p>
              EU/EEA residents have rights under the General Data Protection
              Regulation:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Lawful Basis:</strong> We process data based on
                legitimate interests, consent, or contract performance
              </li>
              <li>
                <strong>Restriction:</strong> Right to restrict processing in
                certain circumstances
              </li>
              <li>
                <strong>Complaint:</strong> Right to lodge a complaint with your
                local data protection authority
              </li>
              <li>
                <strong>Withdraw Consent:</strong> Right to withdraw consent
                where processing is based on consent
              </li>
            </ul>
          </div>

          <p className="mt-4">
            To exercise rights, email{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>{" "}
            with "PRIVACY REQUEST" in the subject line. Include your registered
            email and specify your request type.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            8. Google OAuth Verification Compliance
          </h2>

          <div className="border-l-4 border-green-200 p-4">
            <h3 className="mb-3 text-lg font-medium">
              Google OAuth Verification Compliance
            </h3>
            <p className="text-sm">
              Pixel Nova fully complies with Google's OAuth verification
              requirements, including:
            </p>
            <ul className="list-disc space-y-2 pl-4 text-sm">
              <li>
                <a
                  href="https://support.google.com/cloud/answer/9110914"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline"
                >
                  Brand Verification Requirements
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline"
                >
                  API Services User Data Policy
                </a>
              </li>
              <li>
                <a
                  href="https://developers.google.com/identity/branding-guidelines"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline"
                >
                  Google Sign-In Branding Guidelines
                </a>
              </li>
            </ul>
            <p className="mt-4 text-sm">
              For details on how we handle Google user data specifically, please
              see section 2.2 above.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Third-Party Services</h2>
          <p>
            Our service integrates with various third-party providers. Each has
            their own privacy practices:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Supabase:</strong> Database and authentication services
            </li>
            <li>
              <strong>OpenAI:</strong> AI model processing for content
              generation
            </li>
            <li>
              <strong>Hugging Face:</strong> AI model processing and hosting
            </li>
            <li>
              <strong>Stripe:</strong> Payment processing and subscription
              management
            </li>
            <li>
              <strong>Google OAuth:</strong> Third-party authentication
            </li>
            <li>
              <strong>GitHub OAuth:</strong> Third-party authentication
            </li>
            <li>
              <strong>Cloudflare:</strong> CDN, security, and analytics
            </li>
            <li>
              <strong>Umami:</strong> Privacy-focused analytics
            </li>
          </ul>
          <p className="mt-4">
            We recommend reviewing the privacy policies of these services for
            complete information about their data practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            10. Data Breach Notification
          </h2>
          <p>
            In the event of a data breach that poses a risk to your rights and
            freedoms:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              We will notify relevant authorities within 72 hours where required
              by law
            </li>
            <li>Affected users will be notified without undue delay</li>
            <li>
              We will provide information about the nature of the breach and
              steps being taken
            </li>
            <li>
              Recommendations for protecting yourself will be included in
              notifications
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            11. Marketing Communications
          </h2>
          <p>
            We may send you service-related communications and promotional
            materials:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Service Communications:</strong> Essential notifications
              about your account and service updates
            </li>
            <li>
              <strong>Promotional Emails:</strong> Information about new
              features, tips, and offers (with consent)
            </li>
            <li>
              <strong>Opt-Out:</strong> You can unsubscribe from promotional
              emails at any time
            </li>
          </ul>
          <p className="mt-4">
            Essential service communications cannot be opted out of while you
            maintain an active account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            12. Account Deactivation and Data Retention
          </h2>
          <p>When you deactivate your account:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Account access is immediately disabled</li>
            <li>Personal data is anonymized or deleted within 30 days</li>
            <li>
              Generated images may remain publicly accessible unless
              specifically requested for removal
            </li>
            <li>
              Some data may be retained for legal, security, or fraud prevention
              purposes
            </li>
            <li>
              Backup systems may retain data for up to 90 days before complete
              removal
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">13. Children's Privacy</h2>
          <p>
            The Service is not directed to individuals under the age of 13. We
            do not knowingly collect personal information from children under
            13. If you believe that a child under 13 has provided us with
            personal information, contact us immediately at{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>{" "}
            for removal.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            14. Future Use for Model Training
          </h2>
          <p>
            Currently, user data is not used to train machine learning models.
            Pixel Nova reserves the right to update this policy and begin using
            submitted data for model training in the future. If this occurs,
            users will be notified in advance, and the Privacy Policy will be
            updated accordingly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            15. Changes to This Privacy Policy
          </h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time. When
            we make material changes:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>We will update the effective date at the top of this policy</li>
            <li>
              Significant changes will be announced via email or in-app
              notification
            </li>
            <li>
              Continued use of the service constitutes acceptance of changes
            </li>
            <li>
              You may close your account if you disagree with policy changes
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">16. Contact Information</h2>
          <p>For any questions regarding this Privacy Policy, contact:</p>
          <p className="mt-2">
            <strong>PixelNova LLC</strong>
            <br />
            Data Protection Officer
            <br />
            Email:{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>
            <br />
            Subject Line: "Privacy Policy Inquiry"
          </p>
          <p className="mt-4">
            <strong>EU Representative:</strong> If you are in the EU/EEA and
            wish to contact our EU representative, please email the above
            address with "EU Privacy Inquiry" in the subject line.
          </p>
        </section>
      </div>
    </div>
  );
}
