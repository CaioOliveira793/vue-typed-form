<script setup lang="ts">
import { defineEmits } from 'vue';
import { useForm, useFieldBind, TextInputTransform, ValidationError } from '@/lib';
import { FormApi } from 'final-form';

export interface UserCredential {
	email: string;
	password: string;
	otp: string;
}

const emit = defineEmits<{
	(
		e: 'submit',
		data: [UserCredential, FormApi<UserCredential>]
	): Promise<void | ValidationError<UserCredential>>;
}>();

const formApi = useForm<UserCredential>({
	submit: async (data, formApi) => {
		emit('submit', [data, formApi]);
	},
});

const email = useFieldBind({ name: 'email', formApi, transformer: TextInputTransform });
const password = useFieldBind({ name: 'password', formApi, transformer: TextInputTransform });
const otp = useFieldBind({ name: 'otp', formApi, transformer: TextInputTransform });
</script>

<script lang="ts">
export const CREDENTIAL_FORM = 'credential_form';
export const EMAIL_INPUT = 'email_form';
export const PASSWORD_INPUT = 'password_form';
export const OTP_INPUT = 'otp_form';
</script>

<template>
	<form :data-testid="CREDENTIAL_FORM" @submi="formApi.submit">
		<input
			:data-testid="EMAIL_INPUT"
			type="text"
			inputmode="email"
			v-bind="email.prop"
			v-on="email.event"
		/>
		<input
			:data-testid="PASSWORD_INPUT"
			type="password"
			v-bind="password.prop"
			v-on="password.event"
		/>
		<input
			:data-testid="OTP_INPUT"
			type="text"
			inputmode="numeric"
			v-bind="otp.prop"
			v-on="otp.event"
		/>
	</form>
</template>
