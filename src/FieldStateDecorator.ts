import type { FieldState } from 'final-form';

import type { InputTransform } from '@/Transform';

/**
 * Field error collection that should be visible to the user.
 *
 * The field errors are collected based on the user actions in the input.
 */
export interface FieldVisibleError {
	/**
	 * Specify if the field has a validation error or a submission error that a user should see.
	 *
	 * @default false;
	 */
	invalid: boolean;

	/**
	 * Field errors collected from validation error and submission error.
	 *
	 * @default [];
	 */
	errors: string[];
}

export function fieldStateVisibleError<FieldValue>(
	state: Readonly<FieldState<FieldValue>>
): FieldVisibleError {
	let invalid = false;
	const errors: string[] = [];

	if (state.touched && state.error instanceof Array) {
		errors.push(...state.error);
		invalid = true;
	}

	if (!state.dirtySinceLastSubmit && state.submitError instanceof Array) {
		errors.push(...state.submitError);
		invalid = true;
	}

	return { invalid, errors };
}

export interface FieldProp {
	checked?: boolean;
	value?: string;
	invalid: boolean;
	name: string;
	errors: string[];
}

export function fieldInputProp<FieldValue, Display = string>(
	state: FieldState<FieldValue>,
	transformer: InputTransform<InputEvent, FieldValue, Display>
): FieldProp {
	const inputValue = transformer.display(state.value ?? null);
	const { errors, invalid } = fieldStateVisibleError(state);

	const prop: FieldProp = {
		name: state.name,
		invalid,
		errors,
	};

	if (typeof inputValue === 'boolean') {
		prop.checked = inputValue;
	}

	if (typeof inputValue === 'string') {
		prop.value = inputValue;
	}

	return prop;
}

export interface FieldEvent {
	blur(): void;
	input(ev: InputEvent): void;
	focus(): void;
}

export function fieldInputEvent<FieldValue, Display = string>(
	state: FieldState<FieldValue>,
	transformer: InputTransform<InputEvent, FieldValue, Display>
): FieldEvent {
	function handleInput(ev: InputEvent): void {
		// Instead of `FieldValue | undefined`, take
		// `FieldValue | null`, beeing null the default value
		state.change(transformer.parse(ev) as FieldValue);
	}

	return {
		blur: state.blur,
		input: handleInput,
		focus: state.focus,
	};
}
