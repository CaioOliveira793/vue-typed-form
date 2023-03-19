# vue-typed-form

Vue [final-form](https://final-form.org/) integration focused on extensibility and rich typescript annotations

## Objective

The core api is essentially a shell to use final-form library nicelly with Vue.

```vue
<script setup lang="ts">
// imports omited ...

interface CredentialForm {
	username: string;
	password: string;
}

const formApi = useForm<CredentialForm>({
	submit: async data => {
		makeRequest(data);
	},
	validate: schemaAdapterFn(CredentialSchema),
});

const username = useFieldState({ formApi, name: 'username', transform: TextInputTransform });
const password = useFieldState({ formApi, name: 'password', transform: TextInputTransform });
</script>

<template>
	<form>
		<input v-bind="username.prop" v-on="username.event" />
		<input v-bind="password.prop" v-on="password.event" />
	</form>
</template>
```

Although, it can *decorate* the emitted [state](https://final-form.org/docs/final-form/types/FieldState) from final-form, permitting to add application behaviour from outside of the library.

```ts
const formApi = useForm<CredentialForm>({
	submit: async data => {
		makeRequest(data);
	},
	validate: schemaAdapterFn(CredentialSchema),
});

const field = useFieldState({
	formApi,
	name: 'username',
	transform: CustomTransformer,
	decorator: myFieldDecorator
});

function myFieldDecorator(state: FieldState) {
	// ...
}
```

## API Docs

TODO: API documentation

## Testing

The test suite is composed of functional tests and integration tests using a Vue component instance.

To run the tests, use the package script `test` or `test:cov` for code coverage.

## Building

To build the js files, run `build:js` and `build:type` for typescript declaration files.

For a full build (`.d.ts`, `.js`), run the `build` script.

## License

[MIT License](LICENSE)
