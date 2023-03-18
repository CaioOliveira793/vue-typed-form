<script setup lang="ts">
import { ref } from 'vue';
import { useForm, useFieldState, TextInputTransform, useFormState, ValidationError } from '@/lib';

export interface UserCredential {
	email: string;
	password: string;
	otp: string;
}

const formData = ref<UserCredential>({} as never);

const formApi = useForm<UserCredential>({
	submit: async data => {
		const errors: ValidationError<UserCredential> = {};

		if (!data.email.includes('@company.com')) {
			errors.email = ['E-mail address not found'];
		}

		if (data.password !== 'p4s$w0Rd') {
			errors.password = ['Invalid password'];
		}

		if (Object.keys(errors).length === 0) {
			formData.value = data;
		}

		return errors;
	},
	validate: async data => {
		const errors: ValidationError<UserCredential> = {};

		if (!data.email || !data.email.includes('@')) {
			errors.email = ['Invalid e-mail address'];
		}

		if (!data.password || data.password.length < 8) {
			errors.password = ['Password must have at least 8 characters'];
		}

		if (!data.otp || data.otp.length !== 6) {
			errors.otp = ['OTP must have exact 6 numbers'];
		}

		return errors;
	},
});

const formState = useFormState({ formApi });
const email = useFieldState({ name: 'email', formApi, transformer: TextInputTransform });
const password = useFieldState({ name: 'password', formApi, transformer: TextInputTransform });
const otp = useFieldState({ name: 'otp', formApi, transformer: TextInputTransform });
</script>

<script lang="ts">
export const CREDENTIAL_FORM = 'credential_form';
export const EMAIL_INPUT = 'email_form';
export const PASSWORD_INPUT = 'password_form';
export const OTP_INPUT = 'otp_form';

export const FORM_ERROR = 'form_error';
export const EMAIL_ERROR = 'email_error';
export const PASSWORD_ERROR = 'password_error';
export const OTP_ERROR = 'otp_error';
export const ANY_ERROR_ATTR = 'data-any-error';

export const FORM_SUBMITED = 'form_submited';
</script>

<template>
	<form :data-test="CREDENTIAL_FORM" @submit.prevent="formApi.submit">
		<div>
			<input
				:data-test="EMAIL_INPUT"
				type="text"
				inputmode="email"
				v-bind="email.prop"
				v-on="email.event"
			/>
			<p v-if="email.prop.errors.length !== 0" data-any-error :data-test="EMAIL_ERROR">
				email error
			</p>
		</div>
		<div>
			<input
				:data-test="PASSWORD_INPUT"
				type="password"
				v-bind="password.prop"
				v-on="password.event"
			/>
			<p v-if="password.prop.errors.length !== 0" data-any-error :data-test="PASSWORD_ERROR">
				password error
			</p>
		</div>
		<div>
			<input
				:data-test="OTP_INPUT"
				type="text"
				inputmode="numeric"
				v-bind="otp.prop"
				v-on="otp.event"
			/>
			<p v-if="otp.prop.errors.length !== 0" data-any-error :data-test="OTP_ERROR">otp error</p>
		</div>
		<p v-if="formState.errors.length !== 0" data-any-error :data-test="FORM_ERROR">form error</p>
		<span v-if="formState.state?.submitSucceeded" :data-test="FORM_SUBMITED">submited</span>
	</form>
</template>
