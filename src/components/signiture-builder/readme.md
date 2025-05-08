# signiture-builder



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default     |
| --------- | ---------- | ----------- | -------- | ----------- |
| `fileUrl` | `file-url` |             | `string` | `undefined` |


## Events

| Event           | Description | Type                                |
| --------------- | ----------- | ----------------------------------- |
| `fieldAdded`    |             | `CustomEvent<FormField>`            |
| `fieldRemoved`  |             | `CustomEvent<{ fieldId: string; }>` |
| `fieldsChanged` |             | `CustomEvent<FormField[]>`          |


## Methods

### `getFields() => Promise<FormField[]>`



#### Returns

Type: `Promise<FormField[]>`



### `setActiveFieldType(type: "signature" | "name") => Promise<void>`



#### Parameters

| Name   | Type                    | Description |
| ------ | ----------------------- | ----------- |
| `type` | `"signature" \| "name"` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
