<script setup lang="ts">
import { TextInputTransform, useFieldState, useForm, ValidationError } from '@/lib';
import CheckoutItemForm, { CheckoutItem } from './CheckoutItemForm.vue';

const emit = defineEmits<{
	(e: 'data', value: Checkout): void;
	(e: 'error', value: ValidationError<Checkout>): void;
}>();

const formApi = useForm<Checkout>({
	submit: async data => {
		const error: ValidationError<Checkout> = {};

		if (!data.item) {
			error.item = ['Missing checkout item'];
		}

		if (Object.keys(error).length === 0) {
			emit('data', data);
		} else {
			emit('error', error);
		}

		return error;
	},
});

const name = useFieldState({ formApi, name: `name`, transformer: TextInputTransform });
</script>

<script lang="ts">
export interface Checkout {
	name: string;
	item: CheckoutItem;
}

export const CHECKOUT_FORM = 'checkout_form';
</script>

<template>
	<form :data-test="CHECKOUT_FORM" @submit.prevent="formApi.submit">
		<div>
			<input type="text" v-bind="name.prop" v-on="name.event" />
			<p v-if="name.prop.errors.length !== 0" data-any-error>name error</p>
		</div>

		<CheckoutItemForm :form-api="formApi" sku="item.sku" count="item.count" />
	</form>
</template>
