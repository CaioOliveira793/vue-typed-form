// @vitest-environment happy-dom
import { describe, it, assert } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import TestForm, { Checkout, CHECKOUT_FORM } from '@test/ComposedForm.vue';

function testAttrAs(value: string): string {
	return `[data-test=${value}]`;
}

describe('ComposedForm test', () => {
	it('submit form with inner object', async () => {
		const wrapper = mount(TestForm, {});

		const form = wrapper.find<HTMLFormElement>(testAttrAs(CHECKOUT_FORM));

		await form.trigger('submit');
		await nextTick();
		await nextTick();

		assert.deepStrictEqual(wrapper.emitted('data') as Checkout[][], [
			[
				{
					name: null,
					item: {
						sku: null,
						count: null,
					},
				} as unknown as Checkout,
			],
		]);
	});
});
