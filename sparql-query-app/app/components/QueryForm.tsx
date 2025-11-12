"use client";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (query: string) => void;
};

export default function QueryForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ query: string }>();

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
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
