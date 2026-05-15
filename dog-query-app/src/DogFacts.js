import { useQuery } from "@tanstack/react-query";
import { fetchDogFacts } from "./api";
import Spinner from "./Spinner";

export default function DogFacts() {
  const { data, isLoading, error } = useQuery({ queryKey: ["facts"], queryFn: fetchDogFacts });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.data.map((fact) => (
        <div key={fact.id} className="fact-card">{fact.attributes.body}</div>
      ))}
    </div>
  );
}
