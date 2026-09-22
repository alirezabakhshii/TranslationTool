# Internal Translation Management Tool

A responsive React + TypeScript application for managing multilingual keyword translations through an internal dashboard and displaying them through a public translation view.

The application uses **React Context** as the single source of truth and persists the complete translation dataset in `localStorage`.

---

## Features

### Management Dashboard

* View all keywords and their translations
* Edit translations inline
* Add new keywords
* Add a translation for any available language when creating a keyword
* Automatically create empty translation values for languages that were not provided
* Reorder keywords using drag & drop
* Desktop and mobile-friendly drag & drop interactions
* Keyboard-accessible keyword reordering
* Responsive layout:

    * Table-based layout on desktop
    * Card-based layout on mobile
* Empty state when no keywords exist

### Public View

* Display keywords and their translations
* Switch between available languages
* Clearly indicate missing translations
* Preserve the same keyword ordering as the dashboard
* Responsive desktop/mobile layout
* Uses the same shared state as the dashboard

### Persistence

* Complete translation dataset is stored in `localStorage`
* Changes are persisted automatically after every state update
* Data is restored when the application is reloaded
* Invalid or missing stored data falls back to the initial dataset

### Accessibility & UX

* Semantic buttons, labels and form controls
* Accessible drag handles
* Keyboard drag & drop support
* Visible keyboard focus states
* Accessible modal dialog
* Escape key support for closing the modal
* Automatic focus on the keyword input when the modal opens
* Validation feedback for invalid keyword input
* Accessible labels for translation inputs
* Screen-reader-friendly table caption and status messages

---

## Tech Stack

* React
* TypeScript
* React Context API
* React Hooks
* React Router
* Tailwind CSS
* `@dnd-kit/core`
* `@dnd-kit/sortable`
* `@dnd-kit/utilities`
* Browser `localStorage`

---

## Project Structure

```text
src/
├── components/
│   ├── DragHandleIcon/
│   │   └── DragHandleIcon.tsx
│   └── LanguageSelector/
│       └── LanguageSelector.tsx
│
├── context/
│   └── TranslationContext.tsx
│
├── data/
│   └── initialData.ts
│
├── pages/
│   ├── Dashboard/
│   │   ├── AddKeywordModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── SortableMobileCard.tsx
│   │   └── SortableTableRow.tsx
│   │
│   └── PublicView/
│       └── PublicView.tsx
│
├── App.tsx
└── index.tsx
```

The application separates:

* **State management** → `TranslationContext`
* **Initial data/model** → `data/initialData.ts`
* **Page-level logic** → `Dashboard`, `PublicView`
* **Reusable UI** → `components`
* **Drag & drop presentation** → sortable row/card components

---

# Setup

## Requirements

* Node.js 18+
* npm

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Start the development server

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

## Available routes

### Dashboard

```text
/dashboard
```

Used for managing keywords and translations.

### Public View

```text
/public
```

Used for viewing the translations as an end user.

---

## Production Build

To create a production build:

```bash
npm run build
```

The generated production files will be placed in the `build/` directory.

---

# Data Model

The application uses the following data structure:

```ts
interface TranslationKeyword {
  id: string;
  translations: Record<string, string>;
}

interface TranslationData {
  languages: string[];
  keywords: TranslationKeyword[];
}
```

Example:

```ts
const data: TranslationData = {
  languages: ["en", "fa", "de"],

  keywords: [
    {
      id: "welcome",
      translations: {
        en: "Welcome",
        fa: "خوش آمدید",
        de: "Willkommen",
      },
    },
  ],
};
```

The `languages` array defines the supported languages.

The `keywords` array defines both the available keywords and their display order.

Each keyword contains a `translations` object where the keys are language codes.

---

# Persistence

The application stores the complete `TranslationData` object in `localStorage`.

The storage key is:

```text
translation-manager-data
```

Whenever the Context state changes, the complete dataset is serialized and stored:

```ts
localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(data)
);
```

On application startup, the stored dataset is restored.

If there is no stored data, the application uses the initial dataset.

If the stored value contains invalid JSON, the application falls back to the initial dataset rather than crashing.

### Reset local data

To reset the application to its initial state, run the following in the browser console:

```js
localStorage.removeItem("translation-manager-data");
```

Then reload the page.

---

# Assumptions

The implementation makes the following assumptions:

### 1. Keywords have unique IDs

The keyword ID is treated as a stable unique identifier.

For example:

```text
welcome
login
settings
```

Two keywords with the same ID are not allowed.

The Add Keyword flow also performs a case-insensitive duplicate check.

---

### 2. Language codes are unique

Each language appears only once in the `languages` array.

For example:

```ts
["en", "fa", "de"]
```

rather than:

```ts
["en", "fa", "en"]
```

---

### 3. Languages are predefined

The assignment requires adding keywords and translations, but does not require adding/removing languages through the UI.

Therefore, the available languages are currently defined by the dataset.

Adding another language to the dataset automatically causes it to appear in the dashboard and public view.

---

### 4. Missing translations are valid

A keyword does not necessarily have a translation for every language.

For example:

```ts
{
  id: "hello",
  translations: {
    en: "Hello",
    fa: "",
    de: "Hallo"
  }
}
```

The public view displays a clear empty state for the missing translation instead of showing an undefined value.

---

### 5. localStorage is sufficient for this assignment

The application is designed as a client-side technical assignment, so a backend/database is intentionally not included.

`localStorage` provides persistence across browser reloads without introducing unnecessary infrastructure.

---

### 6. Keyword ordering is meaningful

The order of the `keywords` array represents the canonical display order.

Both the dashboard and public view consume this same array, which guarantees that the public view reflects the order configured in the dashboard.

---

# Drag & Drop

The application uses `dnd-kit` instead of the native HTML5 Drag and Drop API.

This was chosen because it provides better support for:

* Touch devices
* Pointer interactions
* Keyboard interactions
* Collision detection
* Sortable lists
* React-based state management

Three sensors are configured:

```text
PointerSensor
TouchSensor
KeyboardSensor
```

The keyboard sensor uses `sortableKeyboardCoordinates` to support keyboard-based reordering.

The order is updated in the shared React Context, which automatically triggers persistence to `localStorage`.

---

# Architecture & State Management

React Context is used as the single source of truth.

The main state is:

```text
TranslationProvider
        │
        ├── Dashboard
        │     ├── Add Keyword
        │     ├── Edit Translation
        │     └── Reorder Keywords
        │
        └── Public View
              └── Select Language
```

The Dashboard never maintains its own copy of the translation dataset.

Instead, it calls Context actions such as:

```ts
updateTranslation(...)
addKeyword(...)
reorderKeywords(...)
```

The Public View reads the same `data` object.

This prevents the dashboard and public view from becoming out of sync.

---

# Written Answers

## 1. Why did you choose this data structure? How would you handle adding a new language later?

I chose a structure with a top-level `languages` array and a `keywords` array where every keyword contains a `translations` object keyed by language code.

For example:

```ts
{
  languages: ["en", "fa", "de"],
  keywords: [
    {
      id: "welcome",
      translations: {
        en: "Welcome",
        fa: "خوش آمدید",
        de: "Willkommen"
      }
    }
  ]
}
```

There are two important reasons for this structure.

First, the keyword order is naturally represented by the `keywords` array. Reordering keywords therefore only requires changing the array order.

Second, using a `Record<string, string>` for translations makes the model flexible. The application does not need a separate property such as `english`, `german`, or `persian` for every language.

If a new language is introduced, for example `fr`, the language can simply be added to the `languages` array:

```ts
languages: ["en", "fa", "de", "fr"]
```

Existing keywords can then receive an empty French translation:

```ts
{
  id: "welcome",
  translations: {
    en: "Welcome",
    fa: "خوش آمدید",
    de: "Willkommen",
    fr: ""
  }
}
```

The UI already renders translation fields dynamically based on the `languages` array, so no component-level changes would be required to display the new language.

For a production application, I would move language management into a dedicated domain layer or API and migrate existing records when a new language is introduced. I would also validate the persisted dataset to ensure every keyword remains structurally consistent.

---

## 2. If this needed to scale to thousands of keywords and many languages, what would you change? What would be the first bottleneck?

The current implementation is intentionally optimized for the scope of the assignment rather than for very large datasets.

With thousands of keywords and many languages, the first major bottleneck would likely be the amount of UI rendered at once.

Currently, every keyword and its translation inputs are rendered in the DOM. With thousands of rows and many language columns, this would create a large number of React elements and input controls.

The first change I would make would therefore be **virtualization**.

Instead of rendering every keyword simultaneously, only the rows currently visible in the viewport would be rendered.

For example:

```text
Thousands of keywords
        ↓
Virtualized list/table
        ↓
Only visible rows rendered
```

I would also consider the following changes:

### 1. Virtualization

Use a virtualization solution so only visible rows are mounted.

This would significantly reduce:

* DOM size
* React rendering work
* memory usage
* scrolling overhead

### 2. Normalize or index keyword data

For a much larger application, I would consider separating ordering from keyword entities:

```ts
{
  languages: ["en", "fa", "de"],
  keywordOrder: ["welcome", "login", "settings"],
  keywordsById: {
    welcome: {
      translations: {
        en: "Welcome",
        fa: "خوش آمدید"
      }
    }
  }
}
```

This can make individual keyword updates and lookups more efficient because they can be performed by ID rather than repeatedly scanning the entire array.

### 3. Avoid persisting the entire dataset on every keystroke

The current assignment explicitly requires persistence after every change, so the current implementation follows that requirement.

For a production-scale application, continuously serializing a very large dataset into `localStorage` after every keystroke would become inefficient.

I would consider:

* debounced persistence
* batching changes
* IndexedDB
* server-side persistence

depending on the application requirements.

### 4. Server-side persistence

`localStorage` is not suitable as the primary data store for a multi-user production translation management system.

A backend API and database would allow:

* multiple users
* authentication and authorization
* concurrent editing
* audit history
* backups
* larger datasets
* centralized data management

### 5. Memoization and component isolation

For large datasets, I would ensure individual keyword rows do not re-render unnecessarily when unrelated keywords change.

This could involve:

* `React.memo`
* stable callbacks
* selector-based state access
* more granular state subscriptions

---

# Incomplete / Intentionally Not Implemented

The core requirements of the assignment are implemented.

The following optional features were intentionally not included:

### Search / Filter

Not implemented because it is explicitly listed as an optional feature in the assignment.

For a larger dataset, search would become more important, especially when combined with virtualization.

### Delete Keyword

Not implemented because it is also optional.

### Rename Keyword

Not implemented.

The current model treats the keyword ID as a stable identifier rather than an editable display field.

### Import / Export JSON

Not implemented.

The current application only persists data through `localStorage`.

### Automated Tests

No automated test suite has been added.

Given more time, I would add tests for the Context actions and the main user flows, particularly:

* adding a keyword
* editing a translation
* reordering keywords
* restoring persisted data
* handling missing translations

---

# Design Decisions

## Why React Context?

The application has a relatively small shared state model.

React Context provides:

* a single source of truth
* simple state sharing between routes
* no unnecessary external state-management dependency
* a clear separation between state and presentation

For this application's scope, a larger state-management library would add complexity without a clear benefit.

---

## Why localStorage?

The assignment explicitly requires local persistence.

`localStorage` is appropriate for this scope because:

* it is available directly in the browser
* it persists across page reloads
* it requires no backend
* the dataset is small

It would not be my choice for a production-scale collaborative translation system.

---

## Why separate desktop and mobile layouts?

The desktop experience benefits from a table because multiple languages can be compared horizontally.

On smaller screens, a table with many language columns becomes difficult to use.

Therefore:

* Desktop → translation table
* Mobile → stacked keyword cards

Both layouts consume the exact same Context data and actions, so their behavior remains consistent.

---

# Validation

Before submitting the project, the following commands can be used to verify the application:

```bash
npx tsc --noEmit
```

and:

```bash
npm run build
```

Both should complete successfully before submission.

---

# Future Improvements

If this project were continued beyond the assignment, the next improvements would be:

1. Automated unit/component tests
2. Search and filtering
3. Import/export JSON
4. Delete and rename functionality
5. Strong runtime validation for persisted `localStorage` data
6. Virtualized rendering for large datasets
7. Backend/API persistence
8. Authentication and permissions
9. Translation history / audit log
10. Optimistic updates and server synchronization

---

# Summary

This project focuses on keeping the architecture simple while maintaining a clear separation between state, business logic, and presentation.

The main design principle is:

> **One source of truth, predictable state updates, and reusable presentation components.**

The Dashboard and Public View both consume the same translation state, while persistence and mutations are centralized in the React Context.

This keeps the implementation easy to understand for the current assignment while leaving clear paths for scaling the application later.
