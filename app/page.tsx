"use client";

import React, { useState } from "react";
import PatientView from "@/app/components/PatientView";

import Button from "./components/Button";
export default function AthenaPage() {
  const [athenaId, setAthenaId] = useState("3746");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`./api/getToken?athenaId=${athenaId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "An error occurred");
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Athena Patient Data</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4">
          <label className="flex items-center">
            <span className="mr-2">ATHENA_ID:</span>
            <input
              type="text"
              value={athenaId}
              onChange={(e) => setAthenaId(e.target.value)}
              className="px-3 py-1 border rounded"
            />
          </label>
          <Button content="Fetch Data" loading={loading} />
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {data && <PatientView data={data} />}
    </div>
  );
}
