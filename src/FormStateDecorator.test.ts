import { describe, it, expect } from 'vitest';
import type { FormState } from 'final-form';
import { formStateErrors } from '@/FormStateDecorator';

function initialFormState<T extends object>(state: Partial<FormState<T>>): FormState<T> {
	return {
		active: state.active ?? undefined,
		dirty: state.dirty ?? false,
		dirtyFields: state.dirtyFields ?? {},
		dirtyFieldsSinceLastSubmit: state.dirtyFieldsSinceLastSubmit ?? {},
		dirtySinceLastSubmit: false,
		error: state.error ?? undefined,
		errors: state.errors ?? undefined,
		hasSubmitErrors: state.hasSubmitErrors ?? false,
		hasValidationErrors: state.hasValidationErrors ?? false,
		initialValues: state.initialValues ?? {},
		invalid: state.invalid ?? false,
		modified: state.modified ?? undefined,
		modifiedSinceLastSubmit: state.modifiedSinceLastSubmit ?? false,
		pristine: state.pristine ?? false,
		submitError: state.submitError ?? undefined,
		submitErrors: state.submitErrors ?? undefined,
		submitFailed: state.submitFailed ?? false,
		submitSucceeded: state.submitSucceeded ?? false,
		submitting: state.submitting ?? false,
		touched: state.touched ?? undefined,
		valid: state.valid ?? true,
		validating: state.validating ?? false,
		values: state.values ?? ({} as T),
		visited: state.visited ?? undefined,
	};
}

describe('FormStateDecorator formStateErrors', () => {
	it('return all errors in the state from error and submitError', () => {
		{
			const state = initialFormState({
				error: ['invalid form'],
				submitError: ['invalid form on submit', 'on submit error'],
			});

			const errors = formStateErrors(state);

			expect(errors).toStrictEqual(['invalid form', 'invalid form on submit', 'on submit error']);
		}
		{
			const state = initialFormState({
				submitError: ['invalid form on submit', 'on submit error'],
			});

			const errors = formStateErrors(state);

			expect(errors).toStrictEqual(['invalid form on submit', 'on submit error']);
		}
		{
			const state = initialFormState({
				error: ['invalid form', 'validation error'],
			});

			const errors = formStateErrors(state);

			expect(errors).toStrictEqual(['invalid form', 'validation error']);
		}
		{
			const state = initialFormState({});

			const errors = formStateErrors(state);

			expect(errors).toStrictEqual([]);
		}
	});
});
