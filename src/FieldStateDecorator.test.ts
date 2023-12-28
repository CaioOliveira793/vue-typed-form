import { FieldState } from 'final-form';
import { describe, it, expect } from 'vitest';
import { fieldInputEvent, fieldInputProp, fieldStateVisibleError } from '@/FieldStateDecorator';
import { BooleanInputTransform, TextInputTransform } from '@/Transform';

type PartialFieldState<T> = Partial<FieldState<T>> & { name: string };

function initialFieldState<T>(state: PartialFieldState<T>): FieldState<T> {
	return {
		active: state.active ?? undefined,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		blur: state.blur ?? (() => {}),
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		change: state.change ?? (() => {}),
		data: state.data ?? undefined,
		dirty: state.dirty ?? undefined,
		dirtySinceLastSubmit: state.dirtySinceLastSubmit ?? undefined,
		error: state.error ?? undefined,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		focus: state.focus ?? (() => {}),
		initial: state.initial ?? undefined,
		invalid: state.invalid ?? undefined,
		length: state.length ?? undefined,
		modified: state.modified ?? undefined,
		modifiedSinceLastSubmit: state.modifiedSinceLastSubmit ?? undefined,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		name: state.name ?? '',
		pristine: state.pristine ?? undefined,
		submitError: state.submitError ?? undefined,
		submitFailed: state.submitFailed ?? undefined,
		submitSucceeded: state.submitSucceeded ?? undefined,
		submitting: state.submitting ?? undefined,
		touched: state.touched ?? undefined,
		valid: state.valid ?? undefined,
		validating: state.validating ?? undefined,
		value: state.value ?? undefined,
		visited: state.visited ?? undefined,
	};
}

describe('FieldStateDecorator fieldStateVisibleError', () => {
	it('return the errors in the state when a field is touched', () => {
		const state = initialFieldState({
			name: 'name',
			touched: true,
			error: ['invalid field'],
		});

		const { invalid, errors } = fieldStateVisibleError(state);

		expect(invalid).toStrictEqual(true);
		expect(errors).toStrictEqual(['invalid field']);
	});

	it('not return the errors in the state when a field is not touched', () => {
		const state = initialFieldState({
			name: 'name',
			touched: false,
			error: ['invalid field'],
		});

		const { invalid, errors } = fieldStateVisibleError(state);

		expect(invalid).toStrictEqual(false);
		expect(errors).toStrictEqual([]);
	});

	it('return the submitError in the state when a field is dirty since last submit', () => {
		const state = initialFieldState({
			name: 'name',
			touched: false,
			dirtySinceLastSubmit: false,
			submitError: ['invalid field on submit'],
		});

		const { invalid, errors } = fieldStateVisibleError(state);

		expect(invalid).toStrictEqual(true);
		expect(errors).toStrictEqual(['invalid field on submit']);
	});

	it('not return the submitError in the state when a field is not dirty since last submit', () => {
		const state = initialFieldState({
			name: 'name',
			touched: false,
			dirtySinceLastSubmit: true,
			submitError: ['invalid field on submit'],
		});

		const { invalid, errors } = fieldStateVisibleError(state);

		expect(invalid).toStrictEqual(false);
		expect(errors).toStrictEqual([]);
	});

	it('return the error and submitError in the state when a field is touched and dirty since last submit', () => {
		const state = initialFieldState({
			name: 'name',
			touched: true,
			dirtySinceLastSubmit: false,
			error: ['invalid field'],
			submitError: ['invalid field on submit'],
		});

		const { invalid, errors } = fieldStateVisibleError(state);

		expect(invalid).toStrictEqual(true);
		expect(errors).toStrictEqual(['invalid field', 'invalid field on submit']);
	});
});

describe('FieldStateDecorator fieldInputProp', () => {
	it('return checked prop when the field state value is a boolean', () => {
		{
			const state = initialFieldState<boolean | null>({
				name: 'name',
				value: false,
			});

			const props = fieldInputProp(state, BooleanInputTransform);

			expect(props.checked).toStrictEqual(false);
			expect(props.value).toStrictEqual(undefined);
			expect(props.name).toStrictEqual('name');
			expect(props.invalid).toStrictEqual(false);
			expect(props.errors).toStrictEqual([]);
		}
		{
			const state = initialFieldState<boolean | null>({
				name: 'name',
				value: true,
			});

			const props = fieldInputProp(state, BooleanInputTransform);

			expect(props.checked).toStrictEqual(true);
			expect(props.value).toStrictEqual(undefined);
			expect(props.name).toStrictEqual('name');
			expect(props.invalid).toStrictEqual(false);
			expect(props.errors).toStrictEqual([]);
		}
	});

	it('return value prop when the field state value is a string', () => {
		const state = initialFieldState<string | null>({
			name: 'name',
			value: 'test.23@email.com',
		});

		const props = fieldInputProp(state, TextInputTransform);

		expect(props.checked).toStrictEqual(undefined);
		expect(props.value).toStrictEqual('test.23@email.com');
		expect(props.name).toStrictEqual('name');
		expect(props.invalid).toStrictEqual(false);
		expect(props.errors).toStrictEqual([]);
	});

	it('return an invalid prop when the field state value has an error or a submitError', () => {
		{
			const state = initialFieldState<string | null>({
				name: 'name',
				error: ['validation error'],
				touched: true,
			});

			const props = fieldInputProp(state, TextInputTransform);

			expect(props.checked).toStrictEqual(undefined);
			expect(props.value).toStrictEqual('');
			expect(props.name).toStrictEqual('name');
			expect(props.invalid).toStrictEqual(true);
			expect(props.errors).toStrictEqual(['validation error']);
		}
		{
			const state = initialFieldState<string | null>({
				name: 'name',
				submitError: ['submit error'],
				dirtySinceLastSubmit: false,
			});

			const props = fieldInputProp(state, TextInputTransform);

			expect(props.checked).toStrictEqual(undefined);
			expect(props.value).toStrictEqual('');
			expect(props.name).toStrictEqual('name');
			expect(props.invalid).toStrictEqual(true);
			expect(props.errors).toStrictEqual(['submit error']);
		}
	});

	it('return an errors prop composed of the field state error and submitError', () => {
		const state = initialFieldState<string | null>({
			name: 'name',
			error: ['validation error'],
			submitError: ['submit error'],
			touched: true,
			dirtySinceLastSubmit: false,
		});

		const props = fieldInputProp(state, TextInputTransform);

		expect(props.checked).toStrictEqual(undefined);
		expect(props.value).toStrictEqual('');
		expect(props.name).toStrictEqual('name');
		expect(props.invalid).toStrictEqual(true);
		expect(props.errors).toStrictEqual(['validation error', 'submit error']);
	});
});

describe('FieldStateDecorator fieldInputEvent', () => {
	it('process the input event before propagating the result to the state "change" handler', () => {
		const parseIntHistory: Array<number | null | undefined> = [];
		function changeHandler(value: number | null | undefined): void {
			parseIntHistory.push(value);
		}
		const state = initialFieldState<number | null>({ name: 'name', change: changeHandler });

		function parseIntInputEvent(ev: InputEvent): number | null {
			return ev.data ? Number.parseInt(ev.data) : null;
		}
		function displayInt(num: number): string {
			return num.toString(10) ?? '';
		}

		const event = fieldInputEvent(state, { parse: parseIntInputEvent, display: displayInt });

		event.input({ data: '123' } as InputEvent);
		event.input({ data: null } as InputEvent);
		event.input({ data: '-973' } as InputEvent);

		expect(parseIntHistory).toStrictEqual([123, null, -973]);
	});
});
