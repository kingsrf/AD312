import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBreedDetails } from "./api";
import Spinner from "./Spinner";

export default function BreedDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["breed", id],
    queryFn: () => fetchBreedDetails(id),
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const breed = data.data;

  return (
    <div className="card">
      <Link to="/" className="back-link">← Back to Breeds</Link>
      {breed.attributes.image && <img src={breed.attributes.image.url} alt={breed.attributes.name} />}
      <h2>{breed.attributes.name}</h2>
      {breed.attributes.description && <p>{breed.attributes.description}</p>}
      <p>Life span: {breed.attributes.life?.min} - {breed.attributes.life?.max} years</p>
      <p>Weight: {breed.attributes.male_weight?.min} - {breed.attributes.male_weight?.max} kg</p>
      <p>Hypoallergenic: {breed.attributes.hypoallergenic ? "Yes" : "No"}</p>
    </div>
  );
}
