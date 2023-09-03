import { reactive } from 'vue';
import { createForm, type FORM_ERROR, type FormApi } from 'final-form';

import type { Value, FormPrimitive } from '@/Type';

export { DefaultFieldSubscription, DefaultFormSubscription } from '@/SubscriptionOptions';
export {
	fieldInputProp,
	fieldInputEvent,
	fieldStateVisibleError,
	type FieldEvent,
	type FieldProp,
	type FieldVisibleError,
} from '@/FieldStateDecorator';
export { formStateErrors } from '@/FormStateDecorator';
export { useFieldState, type UseFieldStateConfig, type DecoratedFieldState } from '@/UseFieldState';
export { useFormState, type UseFormStateConfig, type DecoratedFormState } from '@/UseFormState';
export { TextInputTransform, getStringFromInput, type InputTransform } from '@/Transform';
export type { Value, FormPrimitive, Path, PathWith, PathValue } from '@/Type';

export type ErrorValue = string[] | undefined;

export type ValidationError<T, Primitive = FormPrimitive> = Value<T, ErrorValue, Primitive> & {
	[FORM_ERROR]?: ErrorValue;
};

export type FinalSubmitHandler<Data> = (
	values: Data,
	form: FormApi<Data, Partial<Data>>
) => Promise<void | ValidationError<Data>>;

export type FinalValidate<Data extends object> = (
	values: Data
) => Promise<ValidationError<Data> | void>;

export interface UseFormInput<Data extends object> {
	submit: FinalSubmitHandler<Data>;
	validate?: FinalValidate<Data>;
	/**
	 * The initial values of your form. These will also be used to compare against the
	 * current values to calculate pristine and dirty.
	 */
	initialValues?: Partial<Data>;
	/**
	 * If true, validation will happen on blur. If false, validation will happen on change.
	 *
	 * @default true
	 */
	validateOnBlur?: boolean;
	/**
	 * If true, the value of a field will be destroyed when that field is unregistered.
	 *
	 * @default false
	 */
	destroyOnUnregister?: boolean;
	/**
	 * @default false
	 */
	keepDirtyOnReinitialize?: boolean;
}

async function noop(): Promise<void> {
	/* no-op */
}

/**
 * Create a form controller.
 *
 * @param config Form api configuration.
 * @returns Reactive form api.
 */
export function useForm<Data extends object>({
	submit,
	validate = noop,
	initialValues = {},
	validateOnBlur = false,
	destroyOnUnregister = true,
	keepDirtyOnReinitialize = false,
}: UseFormInput<Data>): FormApi<Data> {
	const formApi = reactive(
		createForm<Data>({
			onSubmit: submit,
			validate,
			initialValues,
			validateOnBlur,
			destroyOnUnregister,
			keepDirtyOnReinitialize,
		})
	);

	return formApi;
}
