export type ValidationRule = {
  required?: boolean;
  message?: string;
};

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule;
};

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateForm<T extends Record<string, any>>(
  values: T,
  schema: ValidationSchema<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};

  for (const key in schema) {
    const rules = schema[key];
    const value = values[key];

    if (
      rules?.required &&
      (!value || String(value).trim() === "")
    ) {
      errors[key] = rules.message || "Trường này là bắt buộc";
    }
  }

  return errors;
}