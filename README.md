# Autocomplete

This app is bootstrapped with [`Vite`](https://vite.dev/)'s `react-ts` template preset.

Tech stack used:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind.css](https://tailwindcss.com/)
- [Floating UI](https://floating-ui.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Props

```ts
type Option = string | { label: string; value: string }
```

| Name            | Type                                                           | Required? | Default value   | Description                                                                                                                   |
| --------------- | -------------------------------------------------------------- | --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `description`   | `string`                                                       | No        | N/A             | Text to be displayed below the input component                                                                                |
| `disabled`      | `boolean`                                                      | No        | `false`         | If `true`, disables `pointer-events` from the component                                                                       |
| `filterOptions` | `(query: string) => Option[]`                                  | No        | N/A             | If provided, overrides default filtering function                                                                             |
| `id`            | `string`                                                       | No        | `React.useId()` | Essential for ARIA props                                                                                                      |
| `label`         | `string`                                                       | No        | N/A             | Text to be displayed above the input component                                                                                |
| `loading`       | `boolean`                                                      | No        | `false`         | If `true`, displays loading state                                                                                             |
| `multiple`      | `boolean`                                                      | No        | `false`         | If `true`, multiple options can be selected                                                                                   |
| `onChange`      | `(values: string[]) => void`                                   | No        | N/A             | Callback function on option selection or deselection                                                                          |
| `onInputChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void`         | No        | N/A             | Callback function on input value change                                                                                       |
| `options`       | `Option[] \| null`                                             | Yes       | N/A             | Array of options to be displayed and selected                                                                                 |
| `placeholder`   | `string`                                                       | No        | N/A             | Helper text to be displayed within the input component                                                                        |
| `renderOption`  | `(option: Option, isSelected: boolean) => JSX.Element \| null` | No        | N/A             | If provided, overrides default rendering function                                                                             |
| `values`        | `string[]`                                                     | No        | N/A             | Array of selected values (It is set as always an array type for both single and multiple selection modes for easier handling) |

## Controls

### Mouse

Clicking on the component (both input and label) will focus the input and open up the options list if there are available options.

Clicking anywhere outside the component will unfocus the input and close the options list.

### Keyboard

Once the input is focused, the options list can be navigated via keyboard.

| Key           | Action                                                                |
| ------------- | --------------------------------------------------------------------- |
| ArrowUp       | Highlights the previous option                                        |
|               | (loops to the last option if currently highlighting the first option) |
| ArrowDown     | Highlights the next option                                            |
|               | (loops to the first option if currently highlighting the last option) |
| Home          | Highlights the first option                                           |
| End           | Highlights the last option                                            |
| Enter         | Selects the highlighted option                                        |
| Tab or Escape | Closes the options list                                               |

### Clear button

The search icon will turn into a Clear button once there is text in the input or option selection.

Clicking on it resets the component by clearing all input and option selection.

### Single / Multiple selection

In single selection mode, selecting an option will unfocus the input and close the options list.

In multiple selection mode, selecting an option will **not** unfocus the input and close the options list, so the user may continue their next selection.

## Potential Improvements

- Option to set limit for multiple selection
- Option to disable certain options
- Form validation
