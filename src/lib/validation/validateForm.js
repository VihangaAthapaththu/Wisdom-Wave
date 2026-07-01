/**
 * Validate a plain data object against a Zod schema.
 *
 * Keeps existing manual-state forms intact: call this in the submit handler,
 * store `errors` in a `fieldErrors` state object, and render inline messages.
 *
 * @param {import("zod").ZodTypeAny} schema
 * @param {unknown} data
 * @returns {{ success: boolean, data: any, errors: Record<string, string> }}
 */
export function validateForm(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field != null && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, data: null, errors };
}
