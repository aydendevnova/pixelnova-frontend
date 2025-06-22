export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-52">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-black">Contact Support</h1>

        <div className="rounded-lg border border-gray-300 bg-gray-200 p-6">
          <p className="mb-4 text-slate-800">
            For support inquiries, please email us at:{" "}
            <a
              href="mailto:support@pixelnova.app"
              className="text-blue-500 hover:text-blue-600"
            >
              support@pixelnova.app
            </a>
          </p>

          <p className="mb-4 text-slate-800">
            When contacting support, please include:
          </p>

          <ul className="mb-6 list-inside list-disc space-y-2 text-slate-800">
            <li>Your full name</li>
            <li>Your account email address</li>
            <li>A detailed description of your issue or question</li>
            <li>Any relevant screenshots or error messages</li>
            <li>Steps to reproduce the issue (if applicable)</li>
          </ul>

          <p className="text-slate-8  00">
            Our support team typically responds within 24-48 business hours.
          </p>
        </div>
      </div>
    </div>
  );
}
