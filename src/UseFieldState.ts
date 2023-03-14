import type { FieldConfig, FieldState, FormApi } from 'final-form';
import { onUnmounted, reactive } from 'vue';

import type { InputData, CoercedInputData, InputTransform } from '@/Transform';
import { DefaultFieldSubscription } from '@/SubscriptionOptions';
import {
	fieldInputProp,
	fieldInputEvent,
	type FieldEvent,
	type FieldProp,
} from '@/FieldStateDecorator';

export interface UseFieldStateConfig<
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

export interface DecoratedFieldState<FieldValue extends CoercedInputData> {
	state: FieldState<FieldValue>;
	event: FieldEvent;
	prop: FieldProp;
}

/**
 * Create a reactive field state object with extended functionality.
 *
 * @param param Field bindind input.
 * @returns Reactive binding object.
 */
export function useFieldState<
	Data extends object,
	Field extends keyof Data,
	Input extends InputData,
	FieldValue extends Data[Field] & CoercedInputData
>({
	name,
	formApi,
	transformer,
	fieldConfig,
}: UseFieldStateConfig<Data, Field, Input, FieldValue>): DecoratedFieldState<FieldValue> {
	const fieldState: DecoratedFieldState<FieldValue> = reactive({
		event: null as never,
		prop: null as never,
		state: null as never,
	});

	const unregister = formApi.registerField(
		name,
		state => {
			const fstate = state as unknown as FieldState<FieldValue>;
			fieldState.prop = fieldInputProp<Input, FieldValue>(fstate, transformer);
			fieldState.event = fieldInputEvent<Input, FieldValue>(fstate, transformer);
			fieldState.state = fstate;
		},
		DefaultFieldSubscription,
		fieldConfig
	);

	onUnmounted(unregister);

	return fieldState;
}
