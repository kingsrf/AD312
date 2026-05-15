import test from "node:test";
import assert from "node:assert/strict";
import {
  fetchPosts,
  createPost,
  updatePost,
  patchPostTitle,
  deletePost,
} from "./api.js";

test("fetchPosts retrieves all posts", async () => {
  global.fetch = async (url) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts");

    return {
      ok: true,
      json: async () => [
        {
          id: 1,
          userId: 1,
          title: "First Post",
          body: "First body",
        },
      ],
    };
  };

  const posts = await fetchPosts();

  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, "First Post");
});

test("fetchPosts filters posts by user ID", async () => {
  global.fetch = async (url) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts?userId=2");

    return {
      ok: true,
      json: async () => [
        {
          id: 2,
          userId: 2,
          title: "User 2 Post",
          body: "Filtered body",
        },
      ],
    };
  };

  const posts = await fetchPosts("2");

  assert.equal(posts[0].userId, 2);
});

test("createPost sends a POST request", async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts");
    assert.equal(options.method, "POST");

    const body = JSON.parse(options.body);

    assert.equal(body.title, "New Post");
    assert.equal(body.body, "New body");

    return {
      ok: true,
      json: async () => ({
        id: 101,
        ...body,
      }),
    };
  };

  const createdPost = await createPost({
    title: "New Post",
    body: "New body",
    userId: 1,
  });

  assert.equal(createdPost.id, 101);
  assert.equal(createdPost.title, "New Post");
});

test("updatePost sends a PUT request with full post data", async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts/1");
    assert.equal(options.method, "PUT");

    const body = JSON.parse(options.body);

    assert.equal(body.id, 1);
    assert.equal(body.title, "Updated Title");
    assert.equal(body.body, "Updated body");

    return {
      ok: true,
      json: async () => body,
    };
  };

  const updatedPost = await updatePost({
    id: 1,
    userId: 1,
    title: "Updated Title",
    body: "Updated body",
  });

  assert.equal(updatedPost.title, "Updated Title");
  assert.equal(updatedPost.body, "Updated body");
});

test("patchPostTitle sends a PATCH request with only title", async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts/1");
    assert.equal(options.method, "PATCH");

    const body = JSON.parse(options.body);

    assert.deepEqual(body, {
      title: "Patched Title",
    });

    return {
      ok: true,
      json: async () => ({
        id: 1,
        title: body.title,
      }),
    };
  };

  const patchedPost = await patchPostTitle({
    id: 1,
    title: "Patched Title",
  });

  assert.equal(patchedPost.title, "Patched Title");
});

test("deletePost sends a DELETE request", async () => {
  global.fetch = async (url, options) => {
    assert.equal(url, "https://jsonplaceholder.typicode.com/posts/1");
    assert.equal(options.method, "DELETE");

    return {
      ok: true,
      json: async () => ({}),
    };
  };

  const deletedId = await deletePost(1);

  assert.equal(deletedId, 1);
});

test("throws an error when fetch fails", async () => {
  global.fetch = async () => ({
    ok: false,
    json: async () => ({}),
  });

  await assert.rejects(() => fetchPosts(), {
    message: "Failed to fetch posts.",
  });
});
