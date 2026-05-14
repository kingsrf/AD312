# Task Manager

A simple React + Vite task manager app that demonstrates how to update arrays and objects in React state immutably.

## Features
- Add tasks with a custom title
- Store each task with an id, title, and completed status
- Mark tasks as complete or incomplete
- Automatically move completed tasks into a completed section
- Prevent empty or whitespace-only tasks
- Handle long task titles with proper text wrapping
- Uses immutable state updates with `.map()` and spread syntax

## Tech Stack
- React
- Vite
- JavaScript
- CSS
- Vitest
- React Testing Library

### Getting Started

Install dependencies:

npm install

Run the development server:

npm run dev

Run tests:

npm test

### Main Files

src/
|—— App.jsx
|—— TaskManager.jsx
|—— TaskManager.css
|—— main.jsx
|—— index.css
|—— TaskManager.test.jsx

#### Key Concept

This project updates task objects immutably by using `.map()` and the spread operator:

setTasks((prevTasks) =>
  prevTasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  )
);

#### Learning Outcome

This project helped reinforce React state management, immutable updates for arrays and objects, conditional rendering, and organizing dynamic UI behavior.
