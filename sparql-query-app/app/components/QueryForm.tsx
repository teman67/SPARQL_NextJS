"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { validateSparql } from "../lib/validateSparql";

type Props = {
  onSubmit: (query: string) => void;
};

export default function QueryForm({ onSubmit }: Props) {
  const [validationError, setValidationError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ query: string }>();

  const onFormSubmit = (data: { query: string }) => {
    // Validate SPARQL query before submitting
    const validation = validateSparql(data.query);

    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid query");
      return;
    }

    // Clear validation error and submit
    setValidationError("");
    onSubmit(data.query);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="card-gradient p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="mb-6">
        <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          SPARQL Query
        </label>
        <p className="text-sm text-gray-500 mt-1">
          Write your SPARQL query below
        </p>
      </div>

      <textarea
        {...register("query", { required: "Query is required" })}
        placeholder="SELECT ?subject ?predicate ?object WHERE {
  ?subject ?predicate ?object .
} LIMIT 10"
        rows={6}
        className="input-field resize-y min-h-[140px]"
        onChange={() => setValidationError("")}
      />

      {errors.query && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errors.query.message}
        </p>
      )}

      {validationError && (
        <div className="mt-3 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h4 className="text-red-800 font-semibold text-sm mb-1">
                Validation Error
              </h4>
              <p className="text-red-700 text-sm">{validationError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Run Query
        </button>
      </div>
    </form>
  );
}
