// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TestForm, {
	CREDENTIAL_FORM,
	EMAIL_INPUT,
	PASSWORD_INPUT,
	OTP_INPUT,
} from '@test/TestForm.vue';

function testidSelector(id: string): string {
	return `[data-testid=${id}]`;
}

function testSelector(value: string): string {
	return `[data-test=${value}]`;
}

// TODO: test visibility of validation error and submission errors

describe('UseForm test', () => {
	it('bind form fields', async () => {
		const wrapper = mount(TestForm);

		const form = wrapper.find<HTMLFormElement>(testidSelector(CREDENTIAL_FORM));
		const emailInput = wrapper.find<HTMLInputElement>(testidSelector(EMAIL_INPUT));
		const passwordInput = wrapper.find<HTMLInputElement>(testidSelector(PASSWORD_INPUT));
		const otpInput = wrapper.find<HTMLInputElement>(testidSelector(OTP_INPUT));

		await Promise.all([
			emailInput.setValue('user@email.com'),
			passwordInput.setValue('12345678'),
			otpInput.setValue('654321'),
		]);

		await form.trigger('submit');

		expect(wrapper.find(testSelector('form_submited')).exists()).toBe(true);
	});
});
