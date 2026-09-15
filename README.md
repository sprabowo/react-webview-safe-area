# react-webview-safe-area

Safe area helpers for React apps running inside mobile webviews. Reads `env(safe-area-inset-*)` from CSS and falls back to configurable defaults when the host webview does not expose insets.

## Install

```bash
npm install react-webview-safe-area
```

## Getting started

1. Add the CSS variables to your app (once):

```tsx
import 'react-webview-safe-area/style.css'
```

2. Use a viewport meta tag with `viewport-fit=cover`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

3. Wrap your app with `SafeAreaProvider` and apply padding with `SafeAreaView` or `useSafeArea`:

```tsx
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeArea,
} from 'react-webview-safe-area'
import 'react-webview-safe-area/style.css'

export function App() {
  return (
    <SafeAreaProvider fallback={{ top: 16, bottom: 16 }}>
      <SafeAreaView edges={['top', 'bottom']}>
        <YourContent />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

function YourContent() {
  const insets = useSafeArea()
  // insets.top, insets.right, insets.bottom, insets.left
  return <main>...</main>
}
```

### API

| Export | Description |
| --- | --- |
| `SafeAreaProvider` | Provides inset values from CSS variables with optional `fallback` |
| `SafeAreaView` | Applies padding for selected `edges` (`top`, `right`, `bottom`, `left`) |
| `useSafeArea()` | Returns the current `{ top, right, bottom, left }` inset values in pixels |

CSS variables are defined in `src/index.tsx` consumers via `style.css`:

```css
:root {
  --rw-safe-top: env(safe-area-inset-top, 0px);
  --rw-safe-right: env(safe-area-inset-right, 0px);
  --rw-safe-bottom: env(safe-area-inset-bottom, 0px);
  --rw-safe-left: env(safe-area-inset-left, 0px);
}
```

When CSS returns `0px` (common on some Android webviews), the provider uses the `fallback` values instead.

## Development

- Install dependencies:

```bash
npm install
```

- Run the playground:

```bash
npm run play
```

- Run the unit tests:

```bash
npm run test
```

- Build the library:

```bash
npm run build
```
