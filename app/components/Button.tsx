import { FallingLines } from "react-loader-spinner";

export default function Button({
  loading,
  content,
}: {
  loading: boolean;
  content: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
    >
      {loading ? (
        <>
          <FallingLines color="#FFFFFF" width="90" height="90" />
          Loading...
        </>
      ) : (
        content
      )}
    </button>
  );
}
