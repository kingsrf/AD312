import { useQuery } from "@tanstack/react-query";
import { fetchDogGroups, fetchBreeds } from "./api";
import Spinner from "./Spinner";

export default function DogGroups() {
  const { data: groupsData, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchDogGroups,
  });

  const { data: breedsData, isLoading: breedsLoading, error: breedsError } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchBreeds,
  });

  if (groupsLoading || breedsLoading) return <Spinner />;
  if (groupsError) return <p>Error loading groups: {groupsError.message}</p>;
  if (breedsError) return <p>Error loading breeds: {breedsError.message}</p>;

  return (
    <div className="grid">
      {groupsData.data.map((group) => {
        // Find breeds that belong to this group
        const groupBreeds = breedsData.data.filter(
          (breed) => breed.attributes.group_id === group.id
        );

        return (
          <div key={group.id} className="group-card">
            <h3>{group.attributes.name}</h3>
            {groupBreeds.length > 0 && (
              <ul>
                {groupBreeds.map((b) => (
                  <li key={b.id}>{b.attributes.name}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
