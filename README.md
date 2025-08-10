# Form Builder Application

A dynamic form builder application built with React, TypeScript, and Vite. This application allows users to create, customize, and preview forms with various field types and validation rules.

## Features

- Create and manage custom forms
- Add different types of form fields (text, number, select, etc.)
- Configure validation rules for form fields
- Preview forms before publishing
- Responsive design with Material-UI
- Type-safe development with TypeScript

## Tech Stack

- React 18+ with TypeScript
- Vite for fast development and building
- Material-UI for component library
- Redux Toolkit for state management
- ESLint for code quality

## Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd form-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── features/          # Redux slices and feature-specific code
├── pages/            # Main application pages/routes
├── store/            # Redux store configuration
└── theme.ts          # Material-UI theme customization
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### ESLint Configuration

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Components

### Main Components

1. **CreateForm** (`pages/CreateForm.tsx`)
   - Main form creation interface
   - Manages form fields and validation rules
   - Handles form submission and validation

2. **FieldEditor** (`components/FieldEditor.tsx`)
   - Configures individual form fields
   - Supports different field types
   - Manages field-specific settings

3. **ValidationRulesSection** (`components/ValidationRulesSection.tsx`)
   - Configures field validation rules
   - Supports required fields, patterns, min/max values

4. **PreviewForm** (`pages/PreviewForm.tsx`)
   - Displays form preview
   - Tests form validation
   - Simulates form submission

## Contributing

