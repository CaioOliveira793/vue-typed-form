import { FieldSubscription, FormSubscription } from 'final-form';

/**
 * DefaultFormSubstription
 *
 * All enabled form subscription options.
 */
export const DefaultFormSubscription: Readonly<FormSubscription> = Object.freeze({
	active: true,
	dirty: true,
	dirtyFields: true,
	dirtyFieldsSinceLastSubmit: true,
	dirtySinceLastSubmit: true,
	modifiedSinceLastSubmit: true,
	error: true,
	errors: true,
	hasSubmitErrors: true,
	hasValidationErrors: true,
	initialValues: true,
	invalid: true,
	modified: true,
	pristine: true,
	submitError: true,
	submitErrors: true,
	submitFailed: true,
	submitting: true,
	submitSucceeded: true,
	touched: true,
	valid: true,
	validating: true,
	values: true,
	visited: true,
});

/**
 * DefaultFieldSubstription
 *
 * All enabled field subscription options.
 */
export const DefaultFieldSubscription: Readonly<FieldSubscription> = Object.freeze({
	active: true,
	data: true,
	dirty: true,
	dirtySinceLastSubmit: true,
	error: true,
	initial: true,
	invalid: true,
	length: true,
	modified: true,
	pristine: true,
	submitError: true,
	submitFailed: true,
	submitSucceeded: true,
	submitting: true,
	touched: true,
	valid: true,
	validating: true,
	value: true,
	visited: true,
});
