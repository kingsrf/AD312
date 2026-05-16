# Blog Remix App

A multi-page blog application built with React Router Framework and TypeScript. This project converts a static, single-view blog into a routed application with a home feed, an about page, and dynamic post detail pages.

## Objective

The goal of this assignment is to practice file-based routing, persistent layouts, dynamic routes, URL parameters, and programmatic navigation using React Router.

## Features

- Home feed route
- About page route
- Dynamic post detail route
- Persistent navigation layout with `Outlet`
- File-based routing with React Router
- Uses `Link` for client-side navigation
- Uses `useParams()` to read the post ID from the URL
- Uses `useNavigate()` to return to the feed programmatically
- Displays all blog posts on the home page
- Loads specific blog content based on the route parameter
- Handles invalid post IDs with a Post Not Found view
- Clean responsive UI
- Includes normal and edge case testing

## Tech Stack

- React
- React Router Framework
- TypeScript
- CSS
- Vitest
- React Testing Library
- User Event Testing Library

## Installation

npx create-react-router@latest blog-remix-app

cd blog-remix-app

npm install

npm run dev

## Run Tests

npm test


## Route Structure

/
Home feed page

/about
About page

/post/:postId
Dynamic post detail page

## Key Concepts

### Persistent Layout

The root layout contains the navigation bar and uses `Outlet` to render the active route.

### File-Based Routing

Routes are organized through files inside the `app/routes` directory.

### Dynamic Routes

The file `post.$postId.tsx` creates a dynamic route that maps to `/post/:postId`.

### useParams

The post detail page uses `useParams()` to get the post ID from the URL:

const { postId } = useParams();

Then it finds the matching post from the data array:

const post = posts.find((currentPost) => currentPost.id === numericPostId);

### useNavigate

The post detail page uses `useNavigate()` to programmatically send the user back to the home feed:

const navigate = useNavigate();

<button onClick={() => navigate("/")}>Return to Feed</button>

## Testing Coverage

Normal Cases:
- Home feed renders all blog posts
- Clicking a post link navigates to the correct dynamic post page
- About page renders correctly
- Dynamic post ID loads the correct post content

Edge Cases:
- Invalid numeric post ID displays Post Not Found
- Non-numeric post ID displays Post Not Found
- Return to Feed button navigates back to the home page

## Notes

During testing, the React Router Vite plugin was disabled only for Vitest because route tests use `createRoutesStub()` to simulate routing. The plugin is still used normally when running or building the app.
