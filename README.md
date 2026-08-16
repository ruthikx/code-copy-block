# code-copy-block

A React code block with syntax highlighting, line numbers, a filename label, and a copy-to-clipboard button.

## Installation

```bash
npm install code-copy-block
```

This package requires React 18 or later. `react` and `react-dom` are peer dependencies, so your app must already include them.

## Usage

```tsx
import CopyCodeBlock from "code-copy-block";

export default function Example() {
  return (
    <CopyCodeBlock
      filename="hello.ts"
      language="typescript"
      code={`const greeting = "Hello, world!";
console.log(greeting);`}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | Required | The code to display and copy. |
| `language` | `string` | `"javascript"` | Syntax-highlighting language. Common aliases such as `js`, `ts`, `sh`, and `c++` are supported. |
| `filename` | `string` | — | Optional label shown in the header. |
| `showLineNumbers` | `boolean` | `true` | Shows line numbers beside the code. |
| `className` | `string` | — | Additional CSS classes on the outer container. |

## Styling

The component uses Tailwind CSS utility classes for its layout and header styles. Use it in an app with Tailwind configured, or provide equivalent CSS for the generated class names. Syntax highlighting is supplied by `react-syntax-highlighter`.

## Browser support

Copying uses the browser Clipboard API. It normally requires a secure context (HTTPS or `localhost`) and may be unavailable if the browser denies clipboard permission.

## Publishing a new version

```bash
npm run build
npm pack --dry-run
npm version patch
npm publish
```

## License

ISC
