"use client";
// To:DO Add title
import styles from "./Home.module.css";
import React, { useState } from "react";
import PatientView from "@/app/components/patientView/PatientView";
import { Input } from "@/app/components/input/Input";
import Button from "./components/button/Button";

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
      <h1 className={styles.headerStyle}>Athena Patient Data</h1>

      <form className={styles.patientForm} onSubmit={handleSubmit}>
        <Input
          label="AthenaID"
          type="text"
          value={athenaId}
          onChange={(e) => setAthenaId(e.target.value)}
        />

        <Button content="Fetch Data" loading={loading} />
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {data && <PatientView data={data} />}
    </div>
  );
}
