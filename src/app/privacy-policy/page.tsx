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
            <h3 className="text-lg font-medium">2.2. Usage Data</h3>
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
            <h3 className="text-lg font-medium">2.3. Analytics Data</h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Aggregated usage metrics</li>
              <li>Behavioral data for platform improvement</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Note: Google Analytics or similar services may be added in the
              future; data collected for analytics purposes will be restricted
              to activity within Pixel Nova and will not involve cross-site
              tracking.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.4. Moderation and Logging</h3>
            <p>
              Logs of user activity for abuse prevention, moderation, and
              security monitoring
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">2.5. AI Processing Data</h3>
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
          <h2 className="text-xl font-semibold">7. User Rights</h2>
          <p>
            Users have the following rights with respect to their personal data:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Access:</strong> You may request a copy of your personal
              data.
            </li>
            <li>
              <strong>Correction:</strong> You may request correction of
              inaccurate or incomplete data.
            </li>
            <li>
              <strong>Deletion:</strong> You may request deletion of your data.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>{" "}
            with the subject line "DATA DELETION REQUESTED" or specify the
            applicable request type. You must include your registered email and
            third-party provider (if applicable).
          </p>
          <p className="mt-4">
            We may take reasonable steps to verify your identity before
            processing such requests.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
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
            9. Future Use for Model Training
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
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time. Any
            changes will be posted on this page with an updated effective date.
            Continued use of the Service constitutes acceptance of the revised
            policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Contact Information</h2>
          <p>For any questions regarding this Privacy Policy, contact:</p>
          <p className="mt-2">
            Pixel Nova LLC
            <br />
            Email:{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-600 hover:underline"
            >
              support@pixelnova.app
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
