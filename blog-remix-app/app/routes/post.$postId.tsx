// app/routes/post.$postId.tsx
import { useNavigate, useParams } from "react-router";
import { posts } from "../data/posts";

export default function PostView() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const numericPostId = Number(postId);
  const post = posts.find((currentPost) => currentPost.id === numericPostId);

  if (!post) {
    return (
      <section className="page-card">
        <h1>Post Not Found</h1>

        <p>
          The blog post you are looking for does not exist. Please return to the
          feed and choose an available post.
        </p>

        <button className="primary-button" onClick={() => navigate("/")}>
          Return to Feed
        </button>
      </section>
    );
  }

  return (
    <article className="page-card post-detail">
      <span className="post-id">Post #{post.id}</span>

      <h1>{post.title}</h1>

      <p>{post.content}</p>

      <button className="primary-button" onClick={() => navigate("/")}>
        Return to Feed
      </button>
    </article>
  );
}
