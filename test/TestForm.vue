<script setup lang="ts">
import { useForm, useFieldState, TextInputTransform, useFormState } from '@/lib';
import { ref } from 'vue';

export interface UserCredential {
	email: string;
	password: string;
	otp: string;
}

const formData = ref<UserCredential | null>(null);

const formApi = useForm<UserCredential>({
	submit: async data => {
		formData.value = data;
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
</script>

<template>
	<form :data-testid="CREDENTIAL_FORM" @submit.prevent="formApi.submit">
		<div>
			<input
				:data-testid="EMAIL_INPUT"
				type="text"
				inputmode="email"
				v-bind="email.prop"
				v-on="email.event"
			/>
			<p v-if="email.prop.errors.length !== 0" data-test="email_error">email error</p>
		</div>
		<div>
			<input
				:data-testid="PASSWORD_INPUT"
				type="password"
				v-bind="password.prop"
				v-on="password.event"
			/>
			<p v-if="password.prop.errors.length !== 0" data-test="password_error">password error</p>
		</div>
		<div>
			<input
				:data-testid="OTP_INPUT"
				type="text"
				inputmode="numeric"
				v-bind="otp.prop"
				v-on="otp.event"
			/>
			<p v-if="otp.prop.errors.length !== 0" data-test="otp_error">otp error</p>
		</div>
		<p v-if="formState.errors.length !== 0" data-test="form_error">form error</p>
		<span v-if="formData" data-test="form_submited">submited</span>
	</form>
</template>
