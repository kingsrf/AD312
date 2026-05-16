// app/routes/gallery.tsx
import { Link } from "react-router";
import { recipes } from "../data/recipes";

export default function Gallery() {
  return (
    <section className="page-card">
      <h1>Recipe Gallery</h1>

      <p className="page-description">
        Browse the full recipe gallery. Select any recipe to view its detail
        page.
      </p>

      <div className="gallery-grid">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            to={`/recipe/${recipe.id}`}
            className="recipe-card"
          >
            <img src={recipe.image} alt={recipe.title} />

            <div className="recipe-card-content">
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
