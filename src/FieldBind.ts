import { FieldState } from 'final-form';
import { CoercedInputData, InputData, InputTransform } from 'Transform';

/**
 * FieldPropBind
 *
 * Value properties for binding into the input.
 */
export interface FieldPropBind {
	checked?: boolean;
	value?: string;
	invalid: boolean;
	name: string;
}

/**
 * FieldEventBind
 *
 * Event handlers that respond from the input events.
 */
export interface FieldEventBind {
	blur(): void;
	input(ev: Event): void;
	focus(): void;
}

export interface FieldBind {
	prop: FieldPropBind;
	event: FieldEventBind;
	errors: string[];
}

/**
 * Make a empty field bind.
 *
 * @returns a empty field binding
 */
export function emptyFieldBind(): FieldBind {
	const noop = () => { /* */ };
	const event: FieldEventBind = {
		blur: noop,
		focus: noop,
		input: noop as (ev: Event) => void,
	};
	const prop: FieldPropBind = {
		invalid: false,
		name: '',
	};

	return { errors: [], event, prop };
}

export function createFieldBind<Input extends InputData, FieldValue extends CoercedInputData>(
	state: FieldState<FieldValue>,
	transformer: InputTransform<Input, FieldValue>
): FieldBind {
	function handleInput(ev: Event): void {
		const target = ev.target as HTMLInputElement;
		state.change(transformer.parce(target));
	}

	const inputValue = transformer.display(state.value);

	const event: FieldEventBind = {
		blur: state.blur,
		input: handleInput,
		focus: state.focus,
	};

	const prop: FieldPropBind = {
		invalid: state.touched && state.invalid ? true : false,
		name: state.name,
	};

	if (typeof inputValue === 'boolean') {
		prop.checked = inputValue;
	}

	if (typeof inputValue === 'string') {
		prop.value = inputValue;
	}

	// Since there's no generic way to type the error, lets assume it's a list of messages `string[]`
	const errors: string[] = [];

	if (state.error instanceof Array) {
		errors.push(...state.error);
	}

	if (state.submitError instanceof Array) {
		errors.push(...state.submitError);
	}

	return { prop, event, errors };
}
