import type { FieldState, FormApi, IsEqual } from 'final-form';
import { onUnmounted, reactive } from 'vue';

import type { DisplayData, InputTransform } from '@/Transform';
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
	out Display extends DisplayData,
	in out FieldValue extends Data[Field] | null
> {
	/** Field name */
	name: Field;
	/** Form api */
	formApi: FormApi<Data>;
	/** Field transformer */
	transformer: InputTransform<InputEvent, FieldValue, Display>;
	/**
	 * Default field value
	 *
	 * @default null
	 */
	defaultValue?: FieldValue | null;
	/**
	 * Create field subscription without notifying other subscribers
	 *
	 * @default false
	 */
	silent?: boolean;
	/**
	 * After submit callback
	 */
	afterSubmit?: () => void;
	/**
	 * Before submit callback
	 */
	beforeSubmit?: () => void | false;
	/**
	 * Equality verifier for this field.
	 *
	 * @default === // strict equal
	 */
	isEqual?: IsEqual;
}

export interface DecoratedFieldState<FieldValue> {
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
	Display extends DisplayData,
	FieldValue extends Data[Field] | null
>({
	name,
	formApi,
	transformer,
	defaultValue = null,
	silent = false,
	afterSubmit,
	beforeSubmit,
	isEqual,
}: UseFieldStateConfig<Data, Field, Display, FieldValue>): DecoratedFieldState<FieldValue> {
	const fieldState: DecoratedFieldState<FieldValue> = reactive({
		event: null as never,
		prop: null as never,
		state: null as never,
	});

	const unregister = formApi.registerField(
		name,
		state => {
			const fstate = state as FieldState<FieldValue>;
			fieldState.prop = fieldInputProp<FieldValue, Display>(fstate, transformer);
			fieldState.event = fieldInputEvent<FieldValue, Display>(fstate, transformer);
			fieldState.state = fstate;
		},
		DefaultFieldSubscription,
		{ silent, afterSubmit, beforeSubmit, isEqual, initialValue: defaultValue, defaultValue }
	);

	onUnmounted(unregister);

	return fieldState;
}
