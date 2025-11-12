"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import QueryForm from "./components/QueryForm";
import ResultsTable from "./components/ResultsTable";
import { fetchSparql } from "./lib/fetchSparql";

export default function HomePage() {
  const [query, setQuery] = useState<string>("");
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["sparql", query],
    queryFn: () => fetchSparql(query),
    enabled: shouldFetch && query.length > 0,
  });

  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setShouldFetch(true);
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        SPARQL Query Explorer
      </h1>

      <QueryForm onSubmit={handleSubmit} />

      {isLoading && (
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <p className="mt-6 text-red-600 font-medium">
          Error: {(error as Error).message}
        </p>
      )}

      {data && <ResultsTable data={data} />}

      <footer className="text-center mt-10 text-gray-500 text-sm">
        Next.js & SPARQL Demo
      </footer>
    </main>
  );
}
