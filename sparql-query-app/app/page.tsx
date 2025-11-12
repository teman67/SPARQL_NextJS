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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            SPARQL Query Explorer
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore and query the Semantic Web with DBpedia&apos;s powerful
            SPARQL endpoint
          </p>
        </div>

        {/* Query Form Card */}
        <div className="mb-8">
          <QueryForm onSubmit={handleSubmit} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1s",
                }}
              ></div>
            </div>
            <p className="mt-4 text-blue-600 font-semibold text-lg animate-pulse">
              Executing query...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold text-lg mb-1">
                  Query Error
                </h3>
                <p className="text-red-700">{(error as Error).message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {data && <ResultsTable data={data} />}

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <span>Powered by</span>
            <span className="font-semibold text-gray-700">Next.js</span>
            <span>•</span>
            <span className="font-semibold text-gray-700">DBpedia</span>
            <span>•</span>
            <span className="font-semibold text-gray-700">SPARQL</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
