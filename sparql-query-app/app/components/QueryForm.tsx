"use client";
import { useForm } from "react-hook-form";

type Props = {
  onSubmit: (query: string) => void;
};

export default function QueryForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<{ query: string }>();

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.query))}
      className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md"
    >
      <label className="text-sm font-medium text-gray-700">SPARQL Query</label>
      <textarea
        {...register("query", { required: true })}
        placeholder="Enter your SPARQL query..."
        rows={8}
        className="border border-gray-300 p-3 rounded-lg w-full font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Run Query
      </button>
    </form>
  );
}
