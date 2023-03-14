/**
 * CoercedInputData
 *
 * Data retrieved from the HTMLElement.
 */
export type CoercedInputData = string | boolean | number | Date | null;

/**
 * InputData
 *
 * Data displayed by the HTMLElement.
 */
export type InputData = boolean | string;

/**
 * InputTransform
 *
 * Input value transformer.
 */
export interface InputTransform<
	out Input extends InputData,
	in out Output extends CoercedInputData
> {
	/**
	 * Parse the entire value from the InputEvent.
	 *
	 * @param event InputEvent
	 */
	parse(event: InputEvent): Output;

	/**
	 * Display the parsed value as a user readable InputData.
	 *
	 * @param coerced parsed value from the Input.
	 */
	display(coerced?: Output): Input;
}

/**
 * Text input transform.
 *
 * Transforms a non-empty input value.
 */
export const TextInputTransform: InputTransform<string, string> = {
	parse(event) {
		return getStringFromInput(event);
	},
	display(coerced) {
		return coerced ? coerced : '';
	},
};

/**
 * Verify if `HTMLInputElement` receives a boolean type as input. (e.g. from type radio or checkbox)
 */
export function isHTMLInputElementBooleanType(element: HTMLInputElement): boolean {
	return element.type === 'checkbox' || element.type === 'radio';
}

/**
 * Extract a string value of a `HTMLElement` from a `InputEvent`.
 *
 * @param ev InputEvent
 */
export function getStringFromInput(ev: InputEvent): string {
	const target = ev.target;

	if (target instanceof HTMLTextAreaElement) {
		return target.value;
	}

	if (target instanceof HTMLInputElement) {
		if (isHTMLInputElementBooleanType(target)) {
			console.error('Could not extract string from boolean input type ', target.type);
			return '';
		}

		return target.value;
	}

	console.error('Cloud not extract string from EventTarget', target);
	return '';
}
