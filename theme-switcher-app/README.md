# Global Theme Switcher

A React + Vite application that demonstrates global state management using the React Context API. This project allows users to switch between light mode and dark mode across the entire application.

## Objective

The goal of this assignment is to practice using `createContext`, a custom Provider component, and `useContext` to manage a global theme state.

The app uses a shared theme context so multiple components can access the current theme and toggle between light and dark mode without prop drilling.

## Features

- Uses React Context API for global theme state
- Creates a custom `ThemeProvider` component
- Uses `useContext` to access theme values inside components
- Toggles between light mode and dark mode
- Dynamically applies CSS classes based on the current theme
- Updates background, text, cards, and button styling based on theme
- Uses `localStorage` to persist the user’s theme preference
- Loads the saved theme when the app refreshes
- Clean and responsive UI
- Includes automated tests for normal and edge cases
- Separates theme constants/context from the Provider to avoid Fast Refresh warnings

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- React Context API
- Vitest
- React Testing Library
- localStorage

## Installation

npm create vite@latest theme-switcher-app -- --template react

cd theme-switcher-app

npm install

npm run dev

## Run Tests

npm test


## Main Concepts

### createContext

The app creates a `ThemeContext` to store the current theme and the toggle function globally.

### ThemeProvider

The `ThemeProvider` manages the theme state and provides the current theme value to the entire application.

### useContext

The `ThemeSwitcher` and `App` components use `useContext` to access the current theme and toggle function.

### Dynamic Styling

The app applies either `light-mode` or `dark-mode` classes based on the current theme.

### Persistent Preference

The selected theme is saved in `localStorage`, so when the app reloads, the user’s previous theme choice is restored.

## Testing Coverage

Normal Cases:
- App renders with light mode by default
- Theme toggles from light mode to dark mode
- Theme toggles from dark mode back to light mode

Edge Cases:
- Selected theme is saved to localStorage
- Saved dark theme loads correctly from localStorage
- Correct theme classes are applied to the main container

## Notes

The project originally had an ESLint Fast Refresh warning because the context file exported constants, context, and a component from the same file. To improve code organization and avoid that warning, the theme constants and context were moved into `theme.js`, while the Provider component was placed in `ThemeProvider.jsx`.
