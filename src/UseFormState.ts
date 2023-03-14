import type { FormApi, FormState } from 'final-form';
import { reactive } from 'vue';

import { formStateErrors } from '@/FormStateDecorator';
import { DefaultFormSubscription } from '@/SubscriptionOptions';

export interface UseFormStateConfig<Data extends object> {
	/**
	 * Form api
	 *
	 * @see https://final-form.org/docs/final-form/types/FormApi
	 */
	formApi: FormApi<Data>;
}

export interface DecoratedFormState<Data extends object> {
	/**
	 * Form state
	 *
	 * @see https://final-form.org/docs/final-form/types/FormState
	 */
	state: FormState<Data> | null;

	/**
	 * Form errors from data and submit validation. `{ [FORM_ERROR]: errorList }`
	 */
	errors: string[];
}

/**
 * Create a bind object for the form state.
 *
 * @param input Form bind input.
 */
export function useFormState<Data extends object>({
	formApi,
}: UseFormStateConfig<Data>): DecoratedFormState<Data> {
	const formState = reactive({ state: null, errors: [] }) as DecoratedFormState<Data>;

	formApi.subscribe(state => {
		formState.errors = formStateErrors(state);
		formState.state = state;
	}, DefaultFormSubscription);

	return formState as DecoratedFormState<Data>;
}
