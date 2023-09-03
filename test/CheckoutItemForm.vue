<script setup lang="ts" generic="T extends object">
import type { FormApi } from 'final-form';
import { InputTransform, PathWith, TextInputTransform, useFieldState } from '@/lib';

const { formApi, sku, count } = defineProps<{
	formApi: FormApi<T>;
	sku: PathWith<T, string | null>;
	count: PathWith<T, number | null>;
}>();

const sku_field = useFieldState({
	formApi,
	name: sku,
	transformer: TextInputTransform,
});
const count_field = useFieldState<T, number | null, PathWith<T, number | null>>({
	formApi,
	name: count,
	transformer: TextInputTransform as InputTransform<InputEvent, number | null>,
});
</script>

<script lang="ts">
export interface CheckoutItem {
	sku: string;
	count: number;
}
</script>

<template>
	<div>
		<div>
			<input type="text" v-bind="sku_field.prop" v-on="sku_field.event" />
			<p v-if="sku_field.prop.errors.length !== 0" data-any-error>sku field error</p>
		</div>
		<div>
			<input type="text" v-bind="count_field.prop" v-on="count_field.event" />
			<p v-if="count_field.prop.errors.length !== 0" data-any-error>count field error</p>
		</div>
	</div>
</template>
