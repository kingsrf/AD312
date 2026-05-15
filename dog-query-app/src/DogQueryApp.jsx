import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./DogQueryApp.css";

const API_BASE_URL = "https://dogapi.dog/api/v2";

async function fetchData(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Failed to fetch data from the Dog API.");
  }

  return response.json();
}

export default function DogQueryApp() {
  const [selectedBreedId, setSelectedBreedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const breedsQuery = useQuery({
    queryKey: ["breeds"],
    queryFn: () => fetchData("/breeds"),
  });

  const breedDetailsQuery = useQuery({
    queryKey: ["breedDetails", selectedBreedId],
    queryFn: () => fetchData(`/breeds/${selectedBreedId}`),
    enabled: Boolean(selectedBreedId),
  });

  const factsQuery = useQuery({
    queryKey: ["dogFacts"],
    queryFn: () => fetchData("/facts"),
  });

  const groupsQuery = useQuery({
    queryKey: ["dogGroups"],
    queryFn: () => fetchData("/groups"),
  });

  const allBreeds = breedsQuery.data?.data || [];
  const allGroups = groupsQuery.data?.data || [];
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredBreeds = allBreeds
    .filter((breed) =>
      breed.attributes.name.toLowerCase().startsWith(normalizedSearchTerm)
    )
    .sort((firstBreed, secondBreed) =>
      firstBreed.attributes.name.localeCompare(secondBreed.attributes.name)
    )
    .slice(0, 6);

  const selectedBreedGroup = allGroups.find((group) =>
    group.relationships?.breeds?.data?.some(
      (breedRelationship) => breedRelationship.id === selectedBreedId
    )
  );

  function renderQueryState(query, successContent) {
    if (query.isPending) {
      return <p className="loading-message">Loading data...</p>;
    }

    if (query.isError) {
      return <p className="error-message">{query.error.message}</p>;
    }

    if (query.isSuccess) {
      return successContent;
    }

    return null;
  }

  return (
    <div className="dog-app-container">
      <h1>Dog API with TanStack Query</h1>

      <section className="dog-section">
        <h2>Dog Breeds</h2>

        {renderQueryState(
          breedsQuery,
          <>
            <input
              className="breed-search"
              type="text"
              placeholder="Search for a breed..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {normalizedSearchTerm === "" ? (
              <p className="empty-message">
                Start typing to see matching dog breeds.
              </p>
            ) : filteredBreeds.length === 0 ? (
              <p className="empty-message">No breeds found.</p>
            ) : (
              <div className="breed-grid">
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed.id}
                    className={`breed-card ${
                      selectedBreedId === breed.id ? "selected-breed" : ""
                    }`}
                    onClick={() => setSelectedBreedId(breed.id)}
                  >
                    {breed.attributes.name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="dog-section">
        <h2>Breed Details</h2>

        {!selectedBreedId && (
          <p className="empty-message">Select a breed to view more details.</p>
        )}

        {selectedBreedId &&
          renderQueryState(
            breedDetailsQuery,
            <div className="details-card">
              <h3>{breedDetailsQuery.data?.data?.attributes?.name}</h3>

              <p>
                <strong>Group:</strong>{" "}
                {groupsQuery.isPending
                  ? "Loading group..."
                  : selectedBreedGroup?.attributes?.name || "Unknown group"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {breedDetailsQuery.data?.data?.attributes?.description ||
                  "No description available."}
              </p>

              <p>
                <strong>Life Expectancy:</strong>{" "}
                {breedDetailsQuery.data?.data?.attributes?.life?.min} -{" "}
                {breedDetailsQuery.data?.data?.attributes?.life?.max} years
              </p>

              <p>
                <strong>Male Weight:</strong>{" "}
                {breedDetailsQuery.data?.data?.attributes?.male_weight?.min} -{" "}
                {breedDetailsQuery.data?.data?.attributes?.male_weight?.max} kg
              </p>

              <p>
                <strong>Female Weight:</strong>{" "}
                {breedDetailsQuery.data?.data?.attributes?.female_weight?.min} -{" "}
                {breedDetailsQuery.data?.data?.attributes?.female_weight?.max} kg
              </p>
            </div>
          )}
      </section>

      <section className="dog-section">
        <h2>Dog Facts</h2>

        {renderQueryState(
          factsQuery,
          <div className="facts-list">
            {factsQuery.data?.data?.map((fact) => (
              <div key={fact.id} className="fact-card">
                {fact.attributes.body}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
