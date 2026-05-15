# Dog API App with TanStack Query

A React application built with Vite that uses TanStack Query to fetch, cache, and manage asynchronous data from the Dog API. This project demonstrates how to handle API requests efficiently while improving user experience through cleaner search functionality and better data organization.

## Objective

This project focuses on learning how to use TanStack Query for asynchronous data fetching while properly handling loading states, error states, and successful responses.

It also demonstrates how to work with multiple API endpoints and organize external data in a more user-friendly way.

## Features

- Fetches dog breeds from the Dog API
- Fetches detailed breed information
- Fetches random dog facts
- Fetches dog groups
- Uses TanStack Query for caching and API state management
- Handles:
  - isPending
  - isError
  - isSuccess
- Dynamic breed search filtering
- Shows only the first 6 matching breeds as users type
- Uses alphabetical filtering with `startsWith()` for cleaner search results
- Displays breed group directly inside breed details
- Prevents overwhelming users with an unnecessary full A-Z breed list
- Responsive UI design
- Includes testing for both normal and edge cases
- CSS linting support for cleaner styling maintenance

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- TanStack Query
- Dog API
- Vitest
- React Testing Library
- Stylelint

## Installation

npm install

Install TanStack Query:

npm install @tanstack/react-query

Install testing dependencies:

npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom

Install linting dependencies:

npm install -D eslint stylelint

Run development server:

npm run dev

Run tests:

npm test

Run lint checks:

npm run lint
npm run lint:css

## Main Functionality

### Breed Search
Instead of displaying every dog breed from A-Z, the app uses a real-time search system.

Example:
- Typing `r` shows the first 6 breeds starting with `r`
- Typing `ro` narrows results further
- Typing `rot` narrows results even more

This creates a much cleaner and more fluid user experience.

## Breed Details

When a breed is selected, users can view:

- Breed name
- Dog group
- Description
- Life expectancy
- Male weight
- Female weight

## Dog Facts

Displays random dog facts retrieved from the API.

## Testing Coverage

Normal Cases:
- Fetches breed data successfully
- Fetches dog facts successfully
- Displays breed details
- Displays correct dog groups

Edge Cases:
- Handles API failures
- Handles no breed search matches
- Verifies filtering logic
