"use client";

/* 
To do : add patient medical info, height, weight, gender, blood pressure.

clean cache
 */

import styles from "./Home.module.css";
import React, { useState } from "react";
import PatientView from "@/app/components/patientView/PatientView";
import { Input } from "@/app/components/input/Input";
import Button from "./components/button/Button";
import REQUIRED_FIELDS from "./components/patientCard/constants";

export default function AthenaPage() {
  const [athenaId, setAthenaId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const res = await fetch(
        `./api/getToken?athenaId=${athenaId}&t=${timestamp}`,
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          // Force reload
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

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
  // Helper function to check if a field is empty
  const isFieldEmpty = (value: string | undefined): boolean => {
    return value === undefined || value === null || value === "";
  };

  // Get list of missing fields
  const missingFields = REQUIRED_FIELDS.filter(({ field }) => {
    if (data) {
      return isFieldEmpty(data[0][field.toLowerCase()]);
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className={styles.headerStyle}>Athena Patient Data</h1>

      <form className={styles.patientForm} onSubmit={handleSubmit}>
        <Input
          label="               Athena ID"
          type="text"
          value={athenaId}
          onChange={(e) => setAthenaId(e.target.value)}
        />

        <Button content="Fetch Data" loading={loading} />
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      <section className={styles.missed_field}>
        {missingFields.length > 0 && (
          <div className={styles.missingFieldsSummary}>
            <div className={styles.summaryTitle}>
              <span className={styles.warningIcon} />
              Potential errors
            </div>
            <ul className={styles.missingFieldsList}>
              {missingFields.map(({ field, name }) => (
                <li key={`missing-${field}`}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {data && <PatientView data={data} />}
    </div>
  );
}
