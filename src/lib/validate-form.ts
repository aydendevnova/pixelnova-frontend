import { z } from "zod";

export type ValidationResult<T> = {
  success: boolean;
  errors?: Partial<Record<keyof T, string>>;
};

export function validateFormUtil<T extends Record<string, unknown>>(
  schema: z.ZodSchema,
  data: T,
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: Partial<Record<keyof T, string>> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path[0] as keyof T;
      // Use the validation error message if available, otherwise use the message
      errors[path] =
        issue.message === "Invalid"
          ? `Invalid ${String(path)
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}`
          : issue.message;
    });
    return { success: false, errors };
  }

  return { success: true };
}
