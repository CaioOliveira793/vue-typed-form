// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import { fireEvent, render, RenderOptions } from '@testing-library/vue';
// import { useForm, useFieldBind, TextInputTransform } from '@/lib';
import TestForm, {
	CREDENTIAL_FORM,
	EMAIL_INPUT,
	PASSWORD_INPUT,
	OTP_INPUT,
	type UserCredential,
} from '@test/TestForm.vue';

describe('UseForm test', () => {
	it('bind form fields', async () => {
		const { getByTestId } = render(TestForm, {
			listeners: {
				submit: async (data: UserCredential) => {
					expect(data).toStrictEqual({
						email: 'user@email.com',
						password: '12345678',
						otp: '654321',
					});
				},
			},
		} as RenderOptions);

		const formEl: HTMLFormElement = getByTestId(CREDENTIAL_FORM);
		const emailInput: HTMLFormElement = getByTestId(EMAIL_INPUT);
		const passwordInput: HTMLFormElement = getByTestId(PASSWORD_INPUT);
		const otpInput: HTMLFormElement = getByTestId(OTP_INPUT);

		await fireEvent.update(emailInput, 'user@email.com');
		await fireEvent.update(passwordInput, 'user@email.com');
		await fireEvent.update(otpInput, 'user@email.com');

		await fireEvent.submit(formEl);
	});
});
