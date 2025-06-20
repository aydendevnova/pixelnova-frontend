"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorViewProps {
  error: Error;
  reset?: () => void;
}

export default function ErrorView({ error, reset }: ErrorViewProps) {
  const handleContactSupport = () => {
    window.location.href =
      "mailto:support@pixelnova.app?subject=Error Report&body=" +
      encodeURIComponent(`
Error Details:
${error.message}
${error.stack}
    `);
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-semibold">
              Oops! Something went wrong
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We apologize for the inconvenience. Our team has been notified and
            is working to fix this issue.
          </p>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-medium">Error details:</p>
            <p className="mt-1 break-words text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {reset && (
            <Button variant="outline" onClick={reset}>
              Try Again
            </Button>
          )}
          <Button onClick={handleContactSupport}>Contact Support</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
