import { useQuery } from "@tanstack/react-query";
import { fetchBreeds } from "./api";
import Spinner from "./Spinner";
import { Link } from "react-router-dom";

export default function BreedsList() {
  const { data, isLoading, error } = useQuery({ queryKey: ["breeds"], queryFn: fetchBreeds });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid">
      {data.data.map((breed) => (
        <Link key={breed.id} to={`/breeds/${breed.id}`} className="card">
          {breed.attributes.image && <img src={breed.attributes.image.url} alt={breed.attributes.name} />}
          <h3>{breed.attributes.name}</h3>
          {breed.attributes.temperament && <p>{breed.attributes.temperament}</p>}
        </Link>
      ))}
    </div>
  );
}
