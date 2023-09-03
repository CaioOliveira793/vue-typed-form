/**
 * Primitive values that may be encountered in a form
 */
export type FormPrimitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint
	| Date
	| File
	| FileList;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TupleKeys<T extends Array<any>> = Exclude<keyof T, keyof any[]>;

type PathImpl<K extends string | number, V, Primitive> = V extends Primitive
	? `${K}`
	: `${K}` | `${K}.${Path<V>}`;

type ArrayKey = number;

/**
 * All the paths in an object
 *
 * @example
 * ```
 * Path<{ obj: { nested: boolean }, name: string }> = 'name' | 'obj' | 'obj.nested'
 * Path<{ a: Record<string, { num: number }> }> = 'a' | `a.${string}` | `a.${string}.num`
 * Path<[string, { tag: string }, Record<string, number>]> = '0' | '1' | '1.tag' | '2' | `2.${string}`
 * Path<{ list: Array<{ value: string }> }> = 'list' | `list.${number}` | `list.${number}.value`
 * ```
 */
export type Path<T, Primitive = FormPrimitive> = T extends Array<infer V>
	? IsTuple<T> extends true
		? { [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], Primitive> }[TupleKeys<T>]
		: PathImpl<ArrayKey, V, Primitive>
	: { [K in keyof T]-?: PathImpl<K & string, T[K], Primitive> }[keyof T];

type PathWithImpl<K extends string | number, V, W, Primitive> = V extends W
	? `${K}`
	: V extends Primitive
	? never
	: `${K}.${PathWith<V, W, Primitive>}`;

/**
 * All the paths in an object that leads to a `Value`
 *
 * @example
 * ```
 * Path<{ obj: { nested: boolean }, name: string }, boolean> = 'obj.nested'
 * Path<{ a: Record<string, { num: number }> }, number> = `a.${string}.num`
 * Path<[string, { tag: string }, Record<string, number>], { tag: string }> = '1'
 * Path<{ list: Array<{ value: string }>, title: string }, string> = `list.${number}.value` | 'title'
 * ```
 */
export type PathWith<T, Value, Primitive = FormPrimitive> = T extends Array<infer V>
	? IsTuple<T> extends true
		? { [K in TupleKeys<T>]-?: PathWithImpl<K & string, T[K], Value, Primitive> }[TupleKeys<T>]
		: PathWithImpl<ArrayKey, V, Value, Primitive>
	: { [K in keyof T]-?: PathWithImpl<K & string, T[K], Value, Primitive> }[keyof T];

type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Checks whether T1 can be exactly (mutually) assigned to T2
 *
 * @example
 * ```
 * IsEqual<string, string> = true
 * IsEqual<'foo', 'foo'> = true
 * IsEqual<string, number> = false
 * IsEqual<string, number> = false
 * IsEqual<string, 'foo'> = false
 * IsEqual<'foo', string> = false
 * IsEqual<'foo' | 'bar', 'foo'> = boolean // 'foo' is assignable, but 'bar' is not (true | false) -> boolean
 * ```
 */
export type IsEqual<T1, T2> = T1 extends T2
	? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
		? true
		: false
	: false;

/**
 * Helper function to break apart T1 and check if any are equal to T2
 *
 * See {@link IsEqual}
 */
type AnyIsEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;

type ArrayPathImpl<K extends string | number, V, TraversedTypes> = V extends FormPrimitive
	? IsAny<V> extends true
		? string
		: never
	: V extends ReadonlyArray<infer U>
	? U extends FormPrimitive
		? IsAny<V> extends true
			? string
			: never
		: // Check so that we don't recurse into the same type
		// by ensuring that the types are mutually assignable
		// mutually required to avoid false positives of subtypes
		true extends AnyIsEqual<TraversedTypes, V>
		? never
		: `${K}` | `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
	: true extends AnyIsEqual<TraversedTypes, V>
	? never
	: `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`;

type ArrayPathInternal<T, TraversedTypes = T> = T extends Array<infer V>
	? IsTuple<T> extends true
		? { [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K], TraversedTypes> }[TupleKeys<T>]
		: ArrayPathImpl<ArrayKey, V, TraversedTypes>
	: { [K in keyof T]-?: ArrayPathImpl<K & string, T[K], TraversedTypes> }[keyof T];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArrayPath<T> = T extends any ? ArrayPathInternal<T> : never;

/**
 * Extract the value of an object `T` using a `Path<T>`
 *
 * @example
 * ```
 * PathValue<{ obj: { nested: boolean }, name: string }, 'obj.nested'> = boolean
 * PathValue<{ a: Record<string, { num?: number }> }, `a.${'str'}.num`> = number | undefined
 * PathValue<[string, { tag: string }, Record<string, number>], '1'> = { tag: string }
 * PathValue<{ list: Array<{ value: string | null }>, title: string }, `list.${0}.value`> = string | null
 * ```
 */
export type PathValue<
	T,
	P extends Path<T, Primitive> | ArrayPath<T> | string,
	Primitive = FormPrimitive
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = T extends any
	? P extends `${infer K}.${infer R}`
		? K extends keyof T
			? R extends Path<T[K], Primitive>
				? PathValue<T[K], R, Primitive>
				: never
			: K extends `${ArrayKey}`
			? T extends ReadonlyArray<infer V>
				? PathValue<V, R & Path<V, Primitive>, Primitive>
				: never
			: never
		: P extends keyof T
		? T[P]
		: P extends `${ArrayKey}`
		? T extends ReadonlyArray<infer V>
			? V
			: never
		: never
	: never;

type ValueImpl<V, Primitive, N> = V extends Primitive ? N : N | Value<V, N>;

/**
 * Remmaps a object `T` values to `N` type preserving the `T` structure
 */
export type Value<T, N, Primitive = FormPrimitive> = T extends Array<infer V>
	? IsTuple<T> extends true
		? { [K in TupleKeys<T>]?: ValueImpl<T[K], Primitive, N> }[TupleKeys<T>]
		: ValueImpl<V, Primitive, N>
	: { [K in keyof T]?: ValueImpl<T[K], Primitive, N> };
