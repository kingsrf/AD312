# Context Refactor App

A React + Vite application that demonstrates how to refactor a prop-drilling component tree using the React Context API and the `useContext` hook.

## Objective

The goal of this assignment is to understand the problem of prop drilling and how React Context can centralize shared state so deeply nested components can access data directly.

Before the refactor, the user object would have to be manually passed through multiple components:

App → Dashboard → Sidebar → UserProfile

The problem is that Dashboard and Sidebar do not actually use the user data. They only pass it down. This creates unnecessary props and makes the code harder to maintain.

After the refactor, the user data is stored in a global context and accessed directly inside `UserProfile`.

## Features

- Uses React Context API to manage global user data
- Creates a centralized `UserContext`
- Uses a custom `UserProvider` component
- Removes unnecessary prop passing through Dashboard and Sidebar
- Uses `useContext` inside the deeply nested `UserProfile` component
- Displays user name, email, and theme preference
- Includes a button to toggle the user’s theme preference
- Clean and simple UI
- Responsive layout
- Includes automated tests for normal and edge cases
- Avoids React Fast Refresh warnings by separating context from the Provider component

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- React Context API
- Vitest
- React Testing Library

## Installation

npm create vite@latest context-refactor-app -- --template react

cd context-refactor-app

npm install

npm run dev

## Run Tests

npm test

## Project Structure

context-refactor-app/
|—— src/
|   |—— App.jsx
|   |—— App.css
|   |—— Dashboard.jsx
|   |—— Sidebar.jsx
|   |—— UserProfile.jsx
|   |—— UserProvider.jsx
|   |—— userContext.js
|   |—— ContextRefactor.test.jsx
|   |—— main.jsx
|   |—— setupTests.js
|   |—— index.css
|—— package.json
|—— vite.config.js

## Component Flow

App
|—— UserProvider
    |—— Dashboard
        |—— Sidebar
            |—— UserProfile

## Key Concepts

### Prop Drilling Problem

Prop drilling happens when data is passed through components that do not actually need it, just so it can reach a deeper child component.

Example before refactor:

App passes user to Dashboard  
Dashboard passes user to Sidebar  
Sidebar passes user to UserProfile  

Dashboard and Sidebar do not use the user data, so this creates unnecessary code.

### Context Refactor

The app creates a `UserContext` to store global user data.

The `UserProvider` wraps the app and provides the user object and update function.

The `UserProfile` component uses `useContext(UserContext)` to access the user directly.

### useContext

The deeply nested `UserProfile` component accesses user data like this:

const { user } = useContext(UserContext);

This removes the need to pass user props through Dashboard and Sidebar.

## Testing Coverage

Normal Cases:
- App title renders correctly
- User profile displays name and email from context
- Default theme preference renders correctly

Edge Cases:
- Theme preference toggles from dark to light
- Theme preference toggles from light back to dark
- Dashboard and Sidebar render without needing user props, while UserProfile still receives user data from context

## Notes

The context was split into `userContext.js` and `UserProvider.jsx` to keep the code organized and avoid React Fast Refresh warnings.

This structure is cleaner and easier to maintain as the app grows.
