import type { FieldState, FormApi } from 'final-form';
import { onUnmounted, reactive } from 'vue';

import type { InputTransform } from '@/Transform';
import { DefaultFieldSubscription } from '@/SubscriptionOptions';
import {
	fieldInputProp,
	fieldInputEvent,
	type FieldEvent,
	type FieldProp,
} from '@/FieldStateDecorator';
import type { FormPrimitive, Path, PathWith } from '@/Type';

export type EqualFn<L = unknown, R = unknown> = (lhs: L, rhs: R) => boolean;

export interface UseFieldStateConfig<
	in out Data extends object,
	in out FieldValue,
	in out Field extends Path<Data, Primitive> | PathWith<Data, FieldValue, Primitive>,
	out Display = string,
	in out Primitive = FormPrimitive
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
	equalFn?: EqualFn;
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
	FieldValue,
	Field extends Path<Data, Primitive> | PathWith<Data, FieldValue, Primitive>,
	Display = string,
	Primitive = FormPrimitive
>({
	name,
	formApi,
	transformer,
	defaultValue = null,
	silent = false,
	afterSubmit,
	beforeSubmit,
	equalFn,
}: UseFieldStateConfig<
	Data,
	FieldValue,
	Field,
	Display,
	Primitive
>): DecoratedFieldState<FieldValue> {
	const fieldState: DecoratedFieldState<FieldValue> = reactive({
		event: null as never,
		prop: null as never,
		state: null as never,
	});

	const unregister = formApi.registerField(
		name as keyof Data,
		state => {
			const fstate = state as FieldState<FieldValue>;
			fieldState.prop = fieldInputProp<FieldValue, Display>(fstate, transformer);
			fieldState.event = fieldInputEvent<FieldValue, Display>(fstate, transformer);
			fieldState.state = fstate;
		},
		DefaultFieldSubscription,
		{
			silent,
			afterSubmit,
			beforeSubmit,
			isEqual: equalFn,
			initialValue: defaultValue,
			defaultValue,
		}
	);

	onUnmounted(unregister);

	return fieldState;
}
