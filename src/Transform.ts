/**
 * CoercedInputData
 *
 * Data retrieved from the HTMLInputElement.
 */
export type CoercedInputData = string | boolean | number | Date | null;

/**
 * InputData
 *
 * Data displayed by the HTMLInputElement.
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
	parce(input: Readonly<HTMLInputElement>): Output;
	display(coerced?: Output): Input;
}

/**
 * Text input transform.
 *
 * Transforms a non-empty input value.
 */
export const TextInputTransform: InputTransform<string, string> = {
	parce(input) {
		return input.value ? input.value : '';
	},
	display(coerced) {
		return coerced ? coerced : '';
	},
};
