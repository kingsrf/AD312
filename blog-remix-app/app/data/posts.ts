// app/data/posts.ts
export type BlogPost = {
  id: number;
  title: string;
  content: string;
};

export const posts: BlogPost[] = [
  {
    id: 1,
    title: "React Router Tips",
    content:
      "Use Link instead of anchor tags so navigation stays inside the React app without a full page refresh.",
  },
  {
    id: 2,
    title: "State Management",
    content:
      "Context API works well for lightweight shared state, while Redux can help with larger and more complex state flows.",
  },
  {
    id: 3,
    title: "The Future of Web",
    content:
      "AI and React are merging through smarter tooling, better developer workflows, and more dynamic user experiences.",
  },
];
