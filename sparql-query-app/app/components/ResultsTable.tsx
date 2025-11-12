type Props = {
  data: any;
};

export default function ResultsTable({ data }: Props) {
  if (!data) return null;

  const vars = data.head?.vars || [];
  const bindings = data.results?.bindings || [];

  return (
    <div className="overflow-x-auto mt-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <table className="table-auto w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {vars.map((v: string) => (
              <th
                key={v}
                className="border-b border-gray-200 px-4 py-2 font-semibold"
              >
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bindings.map((row: any, i: number) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 hover:bg-blue-50"
            >
              {vars.map((v: string) => (
                <td key={v} className="px-4 py-2 border-b border-gray-100">
                  {row[v]?.value || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
