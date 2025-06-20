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
          LLC, located in the United States, Florida ("Provider," "we," "us," or
          "our"). By using the Service, you agree to be bound by these Terms.
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Eligibility</h2>
          <p>
            You must be at least 13 years old to use Pixel Nova. By creating an
            account, you represent that you meet this eligibility requirement.
            If you are under 18, you represent that you have the consent of a
            parent or legal guardian.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Accounts</h2>
          <p>
            Account registration is required to access AI features and certain
            other functionality. You agree to provide accurate and complete
            information during registration and to maintain the security of your
            account credentials. You are responsible for all activity conducted
            through your account. See the{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            3. Subscriptions and Payments
          </h2>
          <p>
            Certain features of the Service require a paid subscription, managed
            through Stripe. By subscribing, you authorize us to charge the
            applicable subscription fees to your chosen payment method. Fees are
            non-refundable except where required by law. Subscription plans,
            pricing, and billing cycles are displayed at the point of purchase
            and may be updated periodically. You may cancel your subscription at
            any time through your account settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
          <p>
            You agree not to use the Service for any unlawful, harmful, or
            abusive purposes. Specifically, you may not:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Upload, create, or distribute content that is illegal, obscene,
              pornographic, sexually explicit, violent, hateful, harassing,
              discriminatory, or otherwise offensive.
            </li>
            <li className="font-bold text-red-500">
              Generate or attempt to generate non-consensual intimate imagery,
              sexually explicit content, or sexually explicit involving minors
              (real or simulated), or any depiction of exploitation. Doing so
              violates United States federal laws and violates licenses of our
              model providers from HuggingFace and OpenAI.
            </li>
            <li>
              Use the Service to harass, threaten, defame, or infringe upon the
              rights of others.
            </li>
            <li>
              Spam, flood, or abuse the system with automated requests,
              excessive API calls, or similar disruptive activities.
            </li>
            <li>
              Reverse-engineer, decompile, or attempt to extract the source code
              or underlying models of the Service.
            </li>
            <li>
              Use the Service in violation of any applicable laws or
              regulations.
            </li>
          </ul>
          <p className="mt-4">
            Violation of these terms may result in suspension or termination of
            your account, and may be reported to appropriate legal authorities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Ownership and License</h2>
          <p>
            Subject to these Terms, you retain full ownership of all art and
            content you create using Pixel Nova, including AI-generated pixel
            art. You are granted unrestricted rights to use, modify, distribute,
            and commercialize your creations. You grant us a non-exclusive,
            royalty-free license to use your content solely as necessary to
            operate and improve the Service. This includes processing,
            displaying, and storing your content in connection with your use of
            the platform.
          </p>
          <p className="mt-4">
            We do not claim ownership over your content. Currently,
            user-submitted data is not used for AI model training, however, we
            reserve the right to change this policy at any time without notice.
            If this policy changes, the Privacy Policy will be updated
            accordingly. See the{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            for more information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            6. Monitoring and Enforcement
          </h2>
          <p>
            We reserve the right to monitor activity on the platform and to
            implement automated scanning tools to detect violations of these
            Terms. However, we are not obligated to actively monitor all
            content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will
            be effective upon posting to the Service. Your continued use of
            Pixel Nova constitutes acceptance of any modifications.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service at any time
            for violation of these Terms or for operational or legal reasons.
            Upon termination, your right to access the Service and any
            associated licenses will cease immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without
            warranties of any kind, express or implied. We disclaim all
            warranties, including but not limited to merchantability, fitness
            for a particular purpose, non-infringement, and availability.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, we shall not be liable for
            any indirect, incidental, consequential, special, or punitive
            damages, including loss of profits, data, or goodwill, arising out
            of or related to your use of the Service. Our total liability for
            any claim shall not exceed the amount you paid to us for the Service
            in the preceding twelve (12) months.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Pixel Nova, its
            affiliates, and personnel from any claims, damages, liabilities, or
            expenses arising from your use of the Service, your violation of
            these Terms, or your infringement of any third-party rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            12. Governing Law and Dispute Resolution
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the United States and the State of Florida. Any disputes
            arising under these Terms shall be resolved through binding
            arbitration in Florida, unless otherwise required by applicable law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">13. Contact</h2>
          <p>
            For questions or concerns regarding these Terms, contact us at:{" "}
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
