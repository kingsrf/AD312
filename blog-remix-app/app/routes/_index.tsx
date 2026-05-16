// app/routes/_index.tsx
import { Link } from "react-router";
import { posts } from "../data/posts";

export default function Home() {
  return (
    <section className="page-card">
      <div className="hero-section">
        <h1>Blog Remix App</h1>
        <p>
          Welcome to the blog feed. Select a post below to open its dynamic
          detail page.
        </p>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`} className="post-preview">
            <span className="post-id">Post #{post.id}</span>
            <h2>{post.title}</h2>
            <p>{post.content.slice(0, 85)}...</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
