# Recipe Router App

A modern multi-page Recipe Gallery application built with React Router Framework and TypeScript. This project transitions a simple state-based recipe gallery into a routed application with a home page, gallery page, and individual recipe detail pages.

## Objective

The goal of this assignment is to practice file-based routing, dynamic routes, URL parameters, and global navigation using React Router.

Instead of using state-based Previous and Next buttons to move between recipes, this version uses real routes so each recipe has its own detail page.

## Features

- Home dashboard route
- Full recipe gallery route
- Dynamic recipe detail route
- File-based routing with React Router
- Uses `useParams()` to read the recipe ID from the URL
- Uses `Link` for client-side navigation
- Global navigation bar visible across pages
- Gallery displays all recipe thumbnails
- Each recipe card links to its own detail page
- Detail page displays recipe image, title, description, and cooking instructions placeholder
- Handles invalid recipe IDs with a Recipe Not Found page
- Responsive layout
- Clean card-based UI with simple glass-style navigation

## Tech Stack

- React
- React Router Framework
- TypeScript
- CSS
- Vite-powered development server

## Installation

npx create-react-router@latest recipe-router-app

cd recipe-router-app

npm install

npm run dev


## Route Structure

/ 
Home page

/gallery
Recipe gallery page

/recipe/:id
Dynamic recipe detail page

## Key Concepts

### File-Based Routing

Routes are organized using files inside the `app/routes` directory.

### Dynamic Routes

The file `recipe.$id.tsx` creates a dynamic route that maps to `/recipe/:id`.

### useParams

The detail page uses `useParams()` to extract the recipe ID from the URL:

const { id } = useParams();

Then it finds the matching recipe from the data array:

const recipe = recipes.find((currentRecipe) => currentRecipe.id === id);

### Link Navigation

The gallery uses `Link` so users can navigate to recipe detail pages without a full page reload.

## Notes

This routing structure is useful beyond this assignment. The same concept can be applied to larger projects, such as restaurant menus, product catalogs, portfolio pages, dashboards, and apps like a cafe ordering or recipe discovery platform.
