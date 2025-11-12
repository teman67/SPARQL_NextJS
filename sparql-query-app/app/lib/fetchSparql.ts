export async function fetchSparql(query: string) {
  const endpoint = "https://dbpedia.org/sparql";
  const url = `${endpoint}?query=${encodeURIComponent(query)}&format=json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("SPARQL query failed");
  return res.json();
}
