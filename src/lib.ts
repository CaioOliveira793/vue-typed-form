import {
	createForm,
	FORM_ERROR,
	type FormApi,
} from 'final-form';
import { reactive } from 'vue';

import { createFieldBind, emptyFieldBind, FieldBind, FieldEventBind, FieldPropBind } from 'FieldBind';
import { CoercedInputData, InputData, InputTransform, TextInputTransform } from 'Transform';
import { DefaultFieldSubscription, DefaultFormSubscription } from 'SubscriptionOptions';

export { createFieldBind, emptyFieldBind, type FieldBind, type FieldEventBind, type FieldPropBind };
export { TextInputTransform, type CoercedInputData, type InputData, type InputTransform };
export { DefaultFieldSubscription, DefaultFormSubscription };

export type ValidationError<T> =
	| { [P in keyof T]?: string[] | undefined }
	| { [FORM_ERROR]: string };

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

/**
 * Create a form controller.
 *
 * @param config Form api configuration.
 * @returns Reactive form api.
 */
export function useForm<Data extends object>({
	submit,
	validate = async () => {},
	initialValues = {},
	validateOnBlur = true,
	destroyOnUnregister = false,
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
