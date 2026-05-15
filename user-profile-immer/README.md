# User Profile With Immer

A React + Vite application that demonstrates complex nested state management using the `useImmer` hook from the Immer library.

## Objective

This project shows how to update nested React state in a cleaner and more readable way. Instead of manually spreading multiple levels of objects, `useImmer` allows updates through a draft state while still preserving React immutability.

## Features

- Manage a user profile with nested state
- Update the user's name
- Update nested contact details, including phone and address
- Toggle newsletter subscription
- Toggle notification preference
- Display the current profile in a structured profile card
- Show a JSON state preview for real-time state feedback
- Validate empty name, phone, and address fields
- Includes tests for normal and edge cases

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Immer
- use-immer
- Vitest
- React Testing Library

## Getting Started

Install dependencies:

npm install

Install Immer utilities:

npm install immer use-immer

Run the development server:

npm run dev

Run tests:

npm test

## Main Files

src/
|—— App.jsx
|—— UserProfileWithImmer.jsx
|—— UserProfileWithImmer.css
|—— UserProfileWithImmer.test.jsx
|—— main.jsx
|—— setupTests.js
|—— index.css

## Key Concept

With regular React state, nested updates often require multiple spread operators. With Immer, the same update can be written in a simpler way using a draft state:

updateUserProfile((draft) => {
  draft.contactDetails.phone = trimmedPhone;
  draft.contactDetails.address = trimmedAddress;
});

The code looks like a direct mutation, but Immer handles immutability internally.
