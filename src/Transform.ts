/**
 * InputData
 *
 * Data displayed by the HTMLElement.
 */
export type DisplayData = string | boolean | number | Date | null | object | unknown;

/**
 * InputTransform
 *
 * Input value transformer.
 */
export interface InputTransform<
	Input = InputEvent,
	in out Output = unknown,
	out Display extends DisplayData = unknown
> {
	/**
	 * Parse the entire value from the InputEvent.
	 *
	 * @param event InputEvent
	 */
	parse(event: Input): Output | null;

	/**
	 * Display the parsed value as a displayable field  InputData.
	 *
	 * @param out parsed value from the Input.
	 */
	display(out: Output | null): Display;
}

/**
 * Text input transform.
 *
 * Transforms a non-empty input value.
 */
export const TextInputTransform: InputTransform<InputEvent, string, string | null> = {
	parse: getStringFromInput,
	display: displayInputValue,
};

export function displayInputValue(coerced?: string | null): string {
	return coerced ? coerced : '';
}

/**
 * Extract a string value of a `HTMLElement` from a `InputEvent`.
 *
 * @param ev InputEvent
 */
export function getStringFromInput(ev: InputEvent): string | null {
	const target = ev.target;

	if (
		target instanceof HTMLTextAreaElement ||
		target instanceof HTMLInputElement ||
		target instanceof HTMLSelectElement
	) {
		return target.value ? target.value : null;
	}

	return null;
}
