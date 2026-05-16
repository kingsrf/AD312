// app/data/recipes.ts
export type Recipe = {
  id: string;
  title: string;
  image: string;
  description: string;
};

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Classic Pancakes",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
    description: "Fluffy pancakes served with syrup and fresh fruit.",
  },
  {
    id: "2",
    title: "Avocado Toast",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80",
    description: "Toasted bread topped with avocado, seasoning, and herbs.",
  },
  {
    id: "3",
    title: "Chicken Pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    description: "A simple pasta dish with chicken, sauce, and parmesan.",
  },
  {
    id: "4",
    title: "Fresh Salad",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    description: "A colorful salad with fresh vegetables and light dressing.",
  },
  {
    id: "5",
    title: "Berry Smoothie",
    image:
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80",
    description: "A refreshing smoothie made with mixed berries and yogurt.",
  },
  {
    id: "6",
    title: "Grilled Salmon",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    description: "Grilled salmon served with vegetables and lemon.",
  },
];
