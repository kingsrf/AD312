// app/routes/recipe.$id.tsx
import { Link, useParams } from "react-router";
import { recipes } from "../data/recipes";

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find((currentRecipe) => currentRecipe.id === id);

  if (!recipe) {
    return (
      <section className="page-card">
        <h1>Recipe Not Found</h1>
        <p>The recipe you are looking for does not exist.</p>

        <Link to="/gallery" className="primary-link">
          Back to Gallery
        </Link>
      </section>
    );
  }

  return (
    <section className="page-card detail-page">
      <img src={recipe.image} alt={recipe.title} className="detail-image" />

      <div className="detail-content">
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>

        <h2>Cooking Instructions</h2>
        <p>
          Placeholder cooking instructions will go here. This section can later
          be expanded with step-by-step preparation details, ingredients, and
          serving notes.
        </p>

        <Link to="/gallery" className="primary-link">
          Back to Gallery
        </Link>
      </div>
    </section>
  );
}
