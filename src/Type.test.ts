import { describe, it, assert } from 'vitest';
import { Path, PathValue, PathWith } from '@/Type';

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
	? true
	: false;

describe('Path object', () => {
	type Obj = {
		obj: {
			num: number;
			date: Date;
			f: File;
			list_f: FileList;
		};
		list: Array<{ tag: string }>;
		sym: symbol;
		obj2: Record<string, unknown>;
		nil: null;
		undef: undefined;
		str: string;
		num: number;
		what: unknown;
		tulp: [number, string, Date, { under: Record<string, { num: object }> }];
		empty_tulp: [];
	};

	it('match object paths', () => {
		const e: Expect<
			Equal<
				Path<Obj>,
				| 'obj'
				| 'list'
				| `list.${number}`
				| `list.${number}.tag`
				| 'sym'
				| 'obj2'
				| 'nil'
				| 'undef'
				| 'str'
				| 'num'
				| 'what'
				| 'tulp'
				| 'empty_tulp'
				| 'obj.num'
				| 'obj.date'
				| 'obj.f'
				| 'obj.list_f'
				| `obj2.${string}`
				| 'tulp.0'
				| 'tulp.1'
				| 'tulp.2'
				| 'tulp.3'
				| 'tulp.3.under'
				| `tulp.3.under.${string}`
			>
		> = true;

		assert.strictEqual(e, true);
	});

	it('match object path value', () => {
		type A = Expect<Equal<PathValue<Obj, 'obj.f'>, File>>;
		type B = Expect<Equal<PathValue<Obj, `obj2.${string}`>, unknown>>;
		type C = Expect<Equal<PathValue<Obj, `tulp.3`>, { under: Record<string, { num: object }> }>>;
		type D = Expect<Equal<PathValue<Obj, `list.${number}.tag`>, string>>;
		type E = Expect<Equal<PathValue<Obj, `tulp.0`>, number>>;
		type F = Expect<Equal<PathValue<Obj, `tulp.3.under.${string}.num`>, object>>;

		assert.strictEqual<A>(true, true);
		assert.strictEqual<B>(true, true);
		assert.strictEqual<C>(true, true);
		assert.strictEqual<D>(true, true);
		assert.strictEqual<E>(true, true);
		assert.strictEqual<F>(true, true);
	});

	it('match object path with value type', () => {
		type A = Expect<Equal<PathWith<Obj, Date>, 'obj.date' | 'tulp.2'>>;
		type B = Expect<
			Equal<
				PathWith<Obj, unknown>,
				| 'obj'
				| 'list'
				| 'sym'
				| 'obj2'
				| 'nil'
				| 'undef'
				| 'str'
				| 'num'
				| 'what'
				| 'tulp'
				| 'empty_tulp'
			>
		>;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		type C = Expect<Equal<PathWith<Obj, Array<any>>, 'list' | 'tulp' | 'empty_tulp'>>;
		type D = Expect<Equal<PathWith<Obj, string>, 'str' | `list.${number}.tag` | 'tulp.1'>>;

		assert.strictEqual<A>(true, true);
		assert.strictEqual<B>(true, true);
		assert.strictEqual<C>(true, true);
		assert.strictEqual<D>(true, true);
	});
});
