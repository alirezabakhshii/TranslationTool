# Translation Management Tool

A responsive internal translation management tool built with React and TypeScript.

The application provides a dashboard for managing translation keywords and a public view for consuming the same translation data.

## Features

### Management Dashboard

* View all keywords and their translations
* Dynamically render translation columns based on supported languages
* Edit translations inline
* Add new keywords
* Automatically create empty translations for languages without a provided value
* Prevent duplicate keywords
* Search keywords and translations
* Delete keywords
* Drag and drop keywords to change their order
* Persist all changes to `localStorage`
* Restore the latest dataset after page reload
* Responsive desktop and mobile layouts
* Empty states for empty datasets and search results

### Public View

* Display keywords and translations in a readable format
* Switch between available languages
* Show an empty state when a translation is missing
* Preserve the same keyword ordering as the dashboard
* Use the same source of truth as the dashboard

## Tech Stack

* React
* TypeScript
* React Context API
* React Hooks
* React Router
* Tailwind CSS
* Browser Local Storage
* `dnd-kit` for drag and drop interactions

## Project Structure

```text
src/
├── components/
│   ├── DragHandleIcon/
│   │   └── DragHandleIcon.tsx
│   │
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
│   │   ├── Dashboard.tsx
│   │   ├── AddKeywordModal.tsx
│   │   ├── SortableMobileCard.tsx
│   │   └── SortableTableRow.tsx
│   │
│   └── PublicView/
│       └── PublicView.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

The project separates the application into three main concerns:

* **State & business logic** — `TranslationContext`
* **Initial/static data** — `initialData`
* **Presentation** — pages and reusable UI components

This keeps the UI components focused on presentation while the shared context handles application state and mutations.

## Data Model

The application uses the following structure:

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
    {
      id: "login",
      translations: {
        en: "Login",
        fa: "ورود",
        de: "Anmelden",
      },
    },
  ],
};
```

### Why this structure?

Each keyword has an identifier, while translations are stored in a `Record` keyed by language code.

This makes translation access direct:

```ts
keyword.translations[language]
```

It also keeps the structure flexible when supporting multiple languages.

Adding a new language can be handled by adding its language code to the `languages` array. The UI dynamically generates the corresponding translation column and input fields.

The keyword array represents the ordering used by both the dashboard and public view.

## State Management

React Context is used as the single source of truth for translation data.

The context exposes operations such as:

```ts
updateTranslation()
addKeyword()
deleteKeyword()
reorderKeywords()
```

Both the Dashboard and Public View consume the same context.

This prevents having separate copies of the translation dataset and keeps both views synchronized automatically.

## Persistence

The complete translation dataset is stored in `localStorage` as JSON.

Storage key:

```text
translation-manager-data
```

Whenever the application state changes, the updated dataset is persisted:

```ts
useEffect(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}, [data]);
```

When the application starts, it attempts to restore the previously saved dataset.

If the storage entry does not exist or contains invalid JSON, the application safely falls back to the initial dataset.

## Adding Keywords

When a new keyword is created:

1. The keyword is validated.
2. Duplicate keywords are rejected.
3. Translation fields are generated dynamically for all supported languages.
4. Missing translations are stored as empty strings.
5. The keyword is added to the dataset.
6. The updated dataset is automatically persisted.

For example:

```text
Keyword: settings
EN: Settings
FA: تنظیمات
DE:
```

results in:

```ts
{
  id: "settings",
  translations: {
    en: "Settings",
    fa: "تنظیمات",
    de: "",
  },
}
```

## Search & Filtering

The dashboard includes keyword search functionality.

Search matches against:

* Keyword identifiers
* Translation values across all supported languages

For example, searching for:

```text
ورود
```

can find the keyword:

```text
login
```

because its Persian translation is `ورود`.

Filtering only affects the displayed results. The underlying dataset and ordering remain unchanged.

## Deleting Keywords

Keywords can be deleted directly from the dashboard.

Deletion is handled through the shared `TranslationContext`, ensuring that the change is reflected across the application and persisted to `localStorage`.

## Drag & Drop Ordering

Keyword ordering is handled using `dnd-kit`.

The implementation supports:

* Mouse interaction
* Touch interaction
* Keyboard-based interaction
* Smooth sortable transitions

When a keyword is dropped onto another keyword, the shared dataset is reordered.

Because the complete dataset is persisted whenever state changes, the new ordering is also preserved after page reload.

The same ordering is consumed by the Public View.

## Responsive Design

The dashboard uses two responsive presentation patterns.

### Desktop

Translations are displayed in a table:

```text
Keyword     EN          FA          DE
-------------------------------------------
welcome     Welcome     خوش آمدید   Willkommen
login       Login       ورود        Anmelden
```

### Mobile

Each keyword is displayed as a separate card with translations stacked vertically.

This avoids forcing users to horizontally scroll a wide translation table on small screens.

## Accessibility & UX

The application includes several accessibility and usability improvements:

* Semantic buttons and form controls
* Accessible labels for inputs
* ARIA labels for drag handles and actions
* Keyboard-compatible drag and drop
* Focus states for interactive elements
* Accessible modal semantics
* Escape key support for closing the add-keyword modal
* Search result announcements using `aria-live`
* Responsive layouts for desktop and mobile
* Clear empty states and validation feedback

## Error Handling

The application handles several invalid states gracefully:

* Empty keyword validation
* Duplicate keyword validation
* Invalid or corrupted `localStorage`
* Missing translations
* Empty keyword dataset
* Empty search results

Missing translations are represented by an empty string and displayed using an appropriate empty state in the Public View.

## Scaling Considerations

For the assignment, the complete dataset is kept in React Context and persisted in `localStorage`.

For a much larger dataset containing thousands of keywords and many languages, the first potential bottlenecks would be:

* Rendering a large number of rows
* Updating and serializing the entire dataset on every change
* React Context causing broad component re-renders
* `localStorage` serialization and its synchronous browser API

At that scale, possible improvements would include:

* Server-side persistence
* API-based pagination
* Virtualized lists
* More granular state management
* Debounced persistence
* Splitting translation data into smaller independently managed units
* Moving persistence away from `localStorage`

The current architecture keeps the data model, state management, and presentation concerns separated, making these future optimizations easier to introduce.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will be available through the local development server.

## Production Build

Create a production build:

```bash
npm run build
```

Type-check the project:

```bash
npx tsc --noEmit
```

## Routes

### Dashboard

```text
/dashboard
```

Used for managing keywords, translations, searching, deleting, and reordering.

### Public View

```text
/public
```

Used for viewing translations and switching between supported languages.

## Assumptions

* The assignment does not require a backend, so `localStorage` is used for persistence.
* Language management itself is outside the requested scope; supported languages are defined in the dataset.
* Authentication and authorization are outside the scope of this assignment.
* The public view is read-only and uses the same shared dataset as the dashboard.
* Translation identifiers are treated as unique.

## Incomplete / Out of Scope

The following optional features were intentionally left out because they were not required for the core assignment:

* Rename keyword
* Import / Export JSON
* Automated test suite
* Backend/API persistence
* Authentication and authorization

These features could be added later without fundamentally changing the current architecture.

## Written Answers

### 1. Why did you choose this data structure, and how would you handle adding a new language?

The data structure separates supported languages from keyword data.

Each keyword contains an identifier and a `translations` object where language codes are used as keys.

This provides direct access to a translation:

```ts
keyword.translations[language]
```

It also allows the UI to dynamically render translation fields based on the supported languages.

Adding a new language would only require adding its language code to the `languages` array. The UI can then automatically generate the corresponding column and input fields.

Existing keywords can simply contain an empty string until a translation is provided.

### 2. How would you scale this to thousands of keywords and many languages? What would be the first bottleneck?

The first bottleneck would likely be rendering and updating a large number of rows, followed by serializing the complete dataset to `localStorage` after every change.

For thousands of keywords, I would consider server-side persistence, pagination or virtualization for the UI, and more granular state updates.

I would also avoid storing and rewriting the entire dataset in `localStorage` for every keystroke. Persistence could instead be debounced or handled by a backend API.

The current implementation keeps state management, business logic, and UI concerns separated, so these optimizations can be introduced without fundamentally changing the component structure.
