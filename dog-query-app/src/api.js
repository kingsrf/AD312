const API_BASE = "https://dogapi.dog/api/v2";

export async function fetchBreeds() {
  const res = await fetch(`${API_BASE}/breeds`);
  if (!res.ok) throw new Error("Failed to fetch breeds");
  return res.json();
}

export async function fetchBreedDetails(id) {
  const res = await fetch(`${API_BASE}/breeds/${id}`);
  if (!res.ok) throw new Error("Failed to fetch breed details");
  return res.json();
}

export async function fetchDogFacts() {
  const res = await fetch(`${API_BASE}/facts`);
  if (!res.ok) throw new Error("Failed to fetch dog facts");
  return res.json();
}

export async function fetchDogGroups() {
  const res = await fetch(`${API_BASE}/groups`);
  if (!res.ok) throw new Error("Failed to fetch dog groups");
  return res.json();
}
