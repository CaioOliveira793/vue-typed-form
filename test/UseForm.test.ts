// @vitest-environment happy-dom

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TestForm, {
	CREDENTIAL_FORM,
	EMAIL_INPUT,
	PASSWORD_INPUT,
	OTP_INPUT,
	FORM_SUBMITED,
	PASSWORD_ERROR,
	OTP_ERROR,
	EMAIL_ERROR,
} from '@test/TestForm.vue';

function testAttrAs(value: string): string {
	return `[data-test=${value}]`;
}

describe('UseForm test', () => {
	it('submit form with valid input', async () => {
		const wrapper = mount(TestForm);

		const form = wrapper.find<HTMLFormElement>(testAttrAs(CREDENTIAL_FORM));
		const emailInput = wrapper.find<HTMLInputElement>(testAttrAs(EMAIL_INPUT));
		const passwordInput = wrapper.find<HTMLInputElement>(testAttrAs(PASSWORD_INPUT));
		const otpInput = wrapper.find<HTMLInputElement>(testAttrAs(OTP_INPUT));

		await Promise.all([
			emailInput.setValue('user@company.com'),
			passwordInput.setValue('p4s$w0Rd'),
			otpInput.setValue('654321'),
		]);

		await form.trigger('submit');

		expect(wrapper.find(testAttrAs(FORM_SUBMITED)).exists()).toBe(true);
	});

	it('render validation errors for all touched inputs', async () => {
		const wrapper = mount(TestForm);

		const emailInput = wrapper.find<HTMLInputElement>(testAttrAs(EMAIL_INPUT));
		const passwordInput = wrapper.find<HTMLInputElement>(testAttrAs(PASSWORD_INPUT));

		await emailInput.trigger('focus');
		await emailInput.setValue('not_a_email');
		await emailInput.trigger('blur');

		await passwordInput.trigger('focus');
		await passwordInput.setValue('000');
		await passwordInput.trigger('blur');

		expect(wrapper.find(testAttrAs(EMAIL_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(PASSWORD_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(OTP_ERROR)).exists()).toBe(false);
	});

	it('render submission errors', async () => {
		const wrapper = mount(TestForm);

		const form = wrapper.find<HTMLFormElement>(testAttrAs(CREDENTIAL_FORM));
		const emailInput = wrapper.find<HTMLInputElement>(testAttrAs(EMAIL_INPUT));
		const passwordInput = wrapper.find<HTMLInputElement>(testAttrAs(PASSWORD_INPUT));
		const otpInput = wrapper.find<HTMLInputElement>(testAttrAs(OTP_INPUT));

		await Promise.all([
			emailInput.setValue('fake@email.com'),
			passwordInput.setValue('12345678'),
			otpInput.setValue('128931'),
		]);

		await form.trigger('submit');

		expect(wrapper.find(testAttrAs(EMAIL_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(PASSWORD_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(OTP_ERROR)).exists()).toBe(false);
	});

	it('not render validation error when not touched', async () => {
		const wrapper = mount(TestForm);
		const emailInput = wrapper.find<HTMLInputElement>(testAttrAs(EMAIL_INPUT));

		await emailInput.trigger('focus');
		await emailInput.setValue('typo');
		await emailInput.trigger('blur');

		expect(wrapper.find(testAttrAs(EMAIL_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(PASSWORD_ERROR)).exists()).toBe(false);
		expect(wrapper.find(testAttrAs(OTP_ERROR)).exists()).toBe(false);
	});

	it('not render submission error when not touched', async () => {
		const wrapper = mount(TestForm);
		const form = wrapper.find<HTMLFormElement>(testAttrAs(CREDENTIAL_FORM));
		const emailInput = wrapper.find<HTMLInputElement>(testAttrAs(EMAIL_INPUT));
		const passwordInput = wrapper.find<HTMLInputElement>(testAttrAs(PASSWORD_INPUT));
		const otpInput = wrapper.find<HTMLInputElement>(testAttrAs(OTP_INPUT));

		await Promise.all([
			emailInput.setValue('user@someotherdomain.com'),
			passwordInput.setValue('p4s$w0Rd'),
			otpInput.setValue('654321'),
		]);

		await form.trigger('submit');

		expect(wrapper.find(testAttrAs(EMAIL_ERROR)).exists()).toBe(true);
		expect(wrapper.find(testAttrAs(PASSWORD_ERROR)).exists()).toBe(false);
		expect(wrapper.find(testAttrAs(OTP_ERROR)).exists()).toBe(false);
	});
});
