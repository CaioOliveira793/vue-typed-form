import { onUnmounted, reactive } from 'vue';
import type { InputData, CoercedInputData, InputTransform } from 'Transform';
import { createFieldBind, emptyFieldBind, FieldBind } from 'FieldBind';
import { DefaultFieldSubscription } from 'SubscriptionOptions';
import { FieldConfig, FieldState, FormApi } from 'final-form';

export interface UseFieldBinding<
	in out Data extends object,
	Field extends keyof Data,
	out Input extends InputData,
	in out FieldValue extends Data[Field] & CoercedInputData
> {
	/** Field name */
	name: Field;

	/** Form api */
	formApi: FormApi<Data>;

	/** Field transformer */
	transformer: InputTransform<Input, FieldValue>;

	/** Field Config */
	fieldConfig?: FieldConfig<Data[Field]>;
}

/**
 * Create a bind object for a input.
 *
 * @param param Field bindind input.
 * @returns Reactive binding object.
 */
export function useFieldBind<
	Data extends object,
	Field extends keyof Data,
	Input extends InputData,
	FieldValue extends Data[Field] & CoercedInputData
>({
	name,
	formApi,
	transformer,
	fieldConfig,
}: UseFieldBinding<Data, Field, Input, FieldValue>): FieldBind {
	const binding = reactive<FieldBind>(emptyFieldBind());

	const unregister = formApi.registerField(
		name,
		state => {
			const { event, prop, errors } = createFieldBind<Input, FieldValue>(
				state as unknown as FieldState<FieldValue>,
				transformer
			);
			binding.event = event;
			binding.prop = prop;
			binding.errors = errors;
		},
		DefaultFieldSubscription,
		fieldConfig
	);

	onUnmounted(unregister);

	return binding;
}
