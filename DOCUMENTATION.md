# API Docs

## Constants

<dl>
<dt><a href="#DefaultFormSubscription">DefaultFormSubscription</a></dt>
<dd><p>DefaultFormSubstription</p>
<p>All enabled form subscription options.</p>
</dd>
<dt><a href="#DefaultFieldSubscription">DefaultFieldSubscription</a></dt>
<dd><p>DefaultFieldSubstription</p>
<p>All enabled field subscription options.</p>
</dd>
<dt><a href="#TextInputTransform">TextInputTransform</a></dt>
<dd><p>Text input transform.</p>
<p>Transforms a non-empty input value.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#fieldInputProp">fieldInputProp(state, transformer)</a> ⇒ <code>FieldProp</code></dt>
<dd><p>Extract the field props to be used in the field input.</p>
</dd>
<dt><a href="#formStateErrors">formStateErrors(state)</a> ⇒</dt>
<dd><p>Collect all form errors from validation error and submission error.</p>
</dd>
<dt><a href="#useFieldState">useFieldState(param)</a> ⇒</dt>
<dd><p>Create a reactive field state object with extended functionality.</p>
</dd>
<dt><a href="#useFormState">useFormState(input)</a></dt>
<dd><p>Create a bind object for the form state.</p>
</dd>
<dt><a href="#getStringFromInput">getStringFromInput(ev)</a></dt>
<dd><p>Extract a string value of a <code>HTMLElement</code> from a <code>InputEvent</code>.</p>
</dd>
<dt><a href="#useForm">useForm(config)</a> ⇒</dt>
<dd><p>Create a form controller.</p>
</dd>
</dl>

<a name="DefaultFormSubscription"></a>

## DefaultFormSubscription
DefaultFormSubstription

All enabled form subscription options.

**Kind**: global constant  
<a name="DefaultFieldSubscription"></a>

## DefaultFieldSubscription
DefaultFieldSubstription

All enabled field subscription options.

**Kind**: global constant  
<a name="TextInputTransform"></a>

## TextInputTransform
Text input transform.

Transforms a non-empty input value.

**Kind**: global constant  
<a name="fieldInputProp"></a>

## fieldInputProp(state, transformer) ⇒ <code>FieldProp</code>
Extract the field props to be used in the field input.

**Kind**: global function  
**Returns**: <code>FieldProp</code> - field props  

| Param       | Description     |
| ----------- | --------------- |
| state       | field state     |
| transformer | input transform |

<a name="formStateErrors"></a>

## formStateErrors(state) ⇒
Collect all form errors from validation error and submission error.

**Kind**: global function  
**Returns**: All form errors.  

| Param | Description |
| ----- | ----------- |
| state | Form state. |

<a name="useFieldState"></a>

## useFieldState(param) ⇒
Create a reactive field state object with extended functionality.

**Kind**: global function  
**Returns**: Reactive binding object.  

| Param | Description          |
| ----- | -------------------- |
| param | Field bindind input. |

<a name="useFormState"></a>

## useFormState(input)
Create a bind object for the form state.

**Kind**: global function  

| Param | Description      |
| ----- | ---------------- |
| input | Form bind input. |

<a name="getStringFromInput"></a>

## getStringFromInput(ev)
Extract a string value of a `HTMLElement` from a `InputEvent`.

**Kind**: global function  

| Param | Description |
| ----- | ----------- |
| ev    | InputEvent  |

<a name="useForm"></a>

## useForm(config) ⇒
Create a form controller.

**Kind**: global function  
**Returns**: Reactive form api.  

| Param  | Description             |
| ------ | ----------------------- |
| config | Form api configuration. |

