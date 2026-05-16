// app/test/blog-routes.test.tsx
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";

import Home from "../routes/_index";
import About from "../routes/about";
import PostView from "../routes/post.$postId";

function renderBlogRoute(initialPath = "/") {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/about",
      Component: About,
    },
    {
      path: "/post/:postId",
      Component: PostView,
    },
  ]);

  return render(<Stub initialEntries={[initialPath]} />);
}

describe("Blog Remix App Routes", () => {
  test("renders the home feed with all blog post titles", () => {
    renderBlogRoute("/");

    expect(screen.getByText("Blog Remix App")).toBeInTheDocument();
    expect(screen.getByText("React Router Tips")).toBeInTheDocument();
    expect(screen.getByText("State Management")).toBeInTheDocument();
    expect(screen.getByText("The Future of Web")).toBeInTheDocument();
  });

  test("navigates from the home feed to a dynamic post page", async () => {
    const user = userEvent.setup();

    renderBlogRoute("/");

    await user.click(screen.getByRole("link", { name: /state management/i }));

    expect(screen.getByRole("heading", { name: "State Management" })).toBeInTheDocument();
    expect(screen.getByText(/context api works well/i)).toBeInTheDocument();
  });

  test("renders the about page route", () => {
    renderBlogRoute("/about");

    expect(screen.getByRole("heading", { name: /about this blog/i })).toBeInTheDocument();
    expect(screen.getByText(/multi-page react router application/i)).toBeInTheDocument();
  });

  test("uses the dynamic postId route parameter to load the correct post", () => {
    renderBlogRoute("/post/3");

    expect(screen.getByRole("heading", { name: "The Future of Web" })).toBeInTheDocument();
    expect(screen.getByText(/ai and react are merging/i)).toBeInTheDocument();
  });

  test("shows a not found message for an invalid numeric post ID", () => {
    renderBlogRoute("/post/999");

    expect(screen.getByRole("heading", { name: /post not found/i })).toBeInTheDocument();
    expect(screen.getByText(/does not exist/i)).toBeInTheDocument();
  });

  test("shows a not found message for a non-numeric post ID", () => {
    renderBlogRoute("/post/abc");

    expect(screen.getByRole("heading", { name: /post not found/i })).toBeInTheDocument();
  });

  test("return to feed button programmatically navigates back home", async () => {
    const user = userEvent.setup();

    renderBlogRoute("/post/1");

    expect(screen.getByRole("heading", { name: "React Router Tips" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /return to feed/i }));

    expect(screen.getByText("Blog Remix App")).toBeInTheDocument();
    expect(screen.getByText("React Router Tips")).toBeInTheDocument();
  });
});
