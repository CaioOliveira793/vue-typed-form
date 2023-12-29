/**
 * InputTransform
 *
 * Input value transformer.
 */
export interface InputTransform<Input = InputEvent, in out Output = unknown, out Display = string> {
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
export const TextInputTransform: InputTransform<InputEvent, string | null, string> = {
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
		return target.value ?? null;
	}

	return null;
}

/**
 * Boolean input transform.
 *
 * Extracts a boolean from the checked property of a `checkbox` or a `radio` input.
 */
export const BooleanInputTransform: InputTransform<InputEvent, boolean | null, boolean> = {
	parse: getBooleanFromInput,
	display: displayBooleanValue,
};

export function getBooleanFromInput(ev: InputEvent): boolean | null {
	const target = ev.target;

	if (
		target instanceof HTMLInputElement &&
		(target.type === 'checkbox' || target.type === 'radio')
	) {
		return target.checked ?? null;
	}

	return null;
}

export function displayBooleanValue(bool: boolean | null): boolean {
	return bool ?? false;
}
