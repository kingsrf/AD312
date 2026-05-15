const API_URL = "https://jsonplaceholder.typicode.com/posts";

export async function fetchPosts(userId = "") {
  const url = userId ? `${API_URL}?userId=${userId}` : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch posts.");
  }

  return response.json();
}

export async function createPost(newPost) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error("Failed to create post.");
  }

  return response.json();
}

export async function updatePost(updatedPost) {
  const response = await fetch(`${API_URL}/${updatedPost.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  });

  if (!response.ok) {
    throw new Error("Failed to update post.");
  }

  return response.json();
}

export async function patchPostTitle({ id, title }) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to patch post title.");
  }

  return response.json();
}

export async function deletePost(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post.");
  }

  return id;
}
