# Gemini Project Context

## Project Overview

This is a code project for creating high-fidelity UI mockups using **React**, **TypeScript**, and **Material UI v7**. The project is built with **Vite**, providing a fast development experience and an optimized build process.

The primary purpose of this project is to develop and showcase UI mockups for various products in a structured and maintainable way. It uses a system of reusable templates and components to ensure consistency and speed up development.

The main application file, `src/App.tsx`, serves as a central directory for all mockups and templates, with `react-router-dom` handling the navigation between them.

## Key Technologies

*   **React 18** with TypeScript
*   **Material UI v7** for UI components
*   **Vite** for development and building
*   **React Router** for navigation
*   **Emotion** for styling
*   **ESLint** for code quality
*   **Playwright** for visual testing

## Building and Running

### Installation

To install the project dependencies, run:

```bash
npm install
```

### Development

To start the development server, run:

```bash
npm run dev
```

### Building

To build the project for production, run:

```bash
npm run build
```

This command also runs `tsc -b` to ensure there are no TypeScript errors.

### Linting

To check the code for linting and type errors, run:

```bash
npm run lint
```

### Testing

To run the visual regression tests with Playwright, use the following commands:

*   `npm run test:visual`: Run all visual tests.
*   `npm run test:visual:ui`: Open the Playwright UI for debugging tests.
*   `npm run test:visual:headed`: Run tests with a visible browser window.

## Development Conventions

### Project Structure

The project follows a clear and organized structure:

*   `src/composants`: Reusable components shared across different mockups.
*   `src/maquettes`: Individual UI mockups.
*   `src/templates`: Reusable page layouts (e.g., `UtilisateurIxBus.tsx`) that provide a consistent structure for mockups.
*   `src/types`: Shared TypeScript types and interfaces.
*   `tests`: Visual regression tests for each mockup, written with Playwright.

### Creating a New Mockup

1.  Create a new `.tsx` file in the `src/maquettes` directory.
2.  Use one of the existing templates from `src/templates` to structure your mockup.
3.  Add the new mockup to the `maquettes` array in `src/App.tsx` to make it accessible through the main navigation.

### Validation Workflow

Before submitting any new mockup, the following steps are mandatory:

1.  **Lint the code:** `npm run lint`
2.  **Build the project:** `npm run build`
3.  **Run visual tests:** `npm run test:visual`

This workflow ensures code quality, type safety, and visual consistency.
