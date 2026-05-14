# Shopping List With Immer (React)

A React application that demonstrates complex state management using the `useImmer` hook from the Immer library. This project simplifies nested state updates by allowing direct mutations on a draft state while maintaining immutability behind the scenes.

## Features

- Uses `useImmer` for cleaner nested state updates
- Add new shopping items with item name, quantity, category, and notes
- Prevents empty item names
- Prevents duplicate items (case-insensitive)
- Prevents invalid quantities
- Enforces a maximum quantity limit of 50 for realistic shopping scenarios
- Uses `draft.push()` to add items
- Uses `draft.find()` to update nested properties
- Uses `draft.splice()` to remove items
- Handles empty shopping list states
- Responsive UI design
- Includes normal and edge case testing
- Uses Stylelint for cleaner CSS maintenance

## Technologies Used

- React
- Vite
- Immer
- use-immer
- CSS
- Vitest
- React Testing Library
- Stylelint

## Installation

git clone <your-repository-url>
cd shopping-list-immer
npm install
npm install immer use-immer
npm run dev

## Run Tests

npm test

## Run CSS Linting

npm run lint:css

## State Structure Example

{
  id: 1,
  name: "Apples",
  quantity: 3,
  details: {
    category: "Fruit",
    notes: "Buy fresh red apples"
  }
}

## Core Immer Updates Demonstrated

Add Item:
Uses `draft.push()` to insert new items.

Update Item:
Uses `draft.find()` to locate an item by ID and directly update nested properties.

Remove Item:
Uses `draft.splice()` to remove an item from the array.

## Testing Coverage

Normal Cases:
- Adds items successfully
- Updates quantity correctly
- Updates notes correctly
- Removes items properly

Edge Cases:
- Prevents empty item names
- Prevents duplicate items
- Prevents invalid quantity values
- Prevents quantities above 50
- Handles empty shopping list state
