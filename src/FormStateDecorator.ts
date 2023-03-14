import type { FormState } from 'final-form';

/**
 * Collect all form errors from validation error and submission error.
 *
 * @param state Form state.
 * @returns Form errors from `{ [FORM_ERROR]: errorList }`.
 */
export function formStateErrors<Data>(state: Readonly<FormState<Data>>): string[] {
	const errors: string[] = [];

	if (state.error instanceof Array) {
		errors.push(...state.error);
	}

	if (state.submitError instanceof Array) {
		errors.push(...state.submitError);
	}

	return errors;
}
