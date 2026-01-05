import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  data: {
    head?: { vars: string[] };
    results?: { bindings: Record<string, { value: string; type?: string }>[] };
  };
};

export default function ResultsTable({ data }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  if (!data) return null;

  const vars = data.head?.vars || [];
  const bindings = data.results?.bindings || [];
  
  // Pagination logic
  const totalPages = Math.ceil(bindings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBindings = bindings.slice(startIndex, endIndex);
  
  // Reset to page 1 when bindings change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (bindings.length === 0) {
    return (
      <div className="mt-8 card-gradient p-12 rounded-2xl shadow-xl border border-gray-100 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-500">
          Your query didn&apos;t return any results. Try modifying your query.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 animate-in fade-in duration-500">
      <div className="card-gradient p-6 rounded-2xl shadow-xl border border-gray-100">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Query Results</h2>
              <p className="text-sm text-gray-500">
                {bindings.length} {bindings.length === 1 ? "result" : "results"}{" "}
                found • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const csv = [vars.join(",")];
                bindings.forEach(
                  (row: Record<string, { value: string; type?: string }>) => {
                    csv.push(
                      vars.map((v: string) => row[v]?.value || "").join(",")
                    );
                  }
                );
                const blob = new Blob([csv.join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "results.csv";
                a.click();
              }}
              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="table-auto w-full text-sm border-collapse bg-white">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-blue-200">
                  #
                </th>
                {vars.map((v: string) => (
                  <th
                    key={v}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider border-b-2 border-blue-200"
                  >
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentBindings.map(
                (
                  row: Record<string, { value: string; type?: string }>,
                  i: number
                ) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-4 py-3 text-gray-500 font-medium whitespace-nowrap">
                      {startIndex + i + 1}
                    </td>
                    {vars.map((v: string) => {
                      const value = row[v]?.value;
                      const type = row[v]?.type;
                      const isUri =
                        type === "uri" || (value && value.startsWith("http"));

                      return (
                        <td key={v} className="px-4 py-3 text-gray-700">
                          {isUri ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 max-w-md truncate"
                              title={value}
                            >
                              <span className="truncate">{value}</span>
                              <svg
                                className="w-3 h-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          ) : (
                            <span className="break-words">
                              {value || (
                                <span className="text-gray-400">-</span>
                              )}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {bindings.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">
                Items per page:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            {/* Page info and navigation */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">
                Showing {startIndex + 1} to {Math.min(endIndex, bindings.length)} of {bindings.length}
              </span>
              
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
