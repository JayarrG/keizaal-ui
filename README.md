# keizaal-ui

UI component library for Keizaal Online. React + TypeScript, designed for CEF.

## Setup

```
npm install
npm run dev
```

## Components

```tsx
import { Panel, Button, ScrollPanel, Modal, Tooltip, ... } from './components';
```

Panel, ScrollPanel, Grid, Modal, Tooltip, Accordion, TabBar, DialogPanel, Button, Slider, Toggle, Checkbox, TextInput, Dropdown, Stepper, ContextMenu, ProgressBar, StatLine, Badge, ItemSlot, List, NotificationStack, LoadingSpinner, ConfirmDialog, Divider, Label, Book.

## Color System

Accent colors via CSS variables on `:root`:

```css
--accent-h: 0;
--accent-s: 0%;
--accent-l: 100%;
```

Pass `accent="#hex"` to Panel, Button, ProgressBar for per-instance overrides.

## Deploy

```
npm run deploy
```

Pushes to `gh-pages` branch.
