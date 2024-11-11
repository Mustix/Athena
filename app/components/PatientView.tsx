//athena\app\components\PatientView.tsx
"use client";

import React from "react";

interface GroupedData {
  basicInfo: Record<string, any>;
  contactInfo: Record<string, any>;
  clinicalInfo: Record<string, any>;
  preferences: Record<string, any>;
  other: Record<string, any>;
}

export default function PatientView({ data }: { data: any }) {
  const getMissingFields = (rawData: any): string[] => {
    const missingFields: string[] = [];

    // Get values
    const patientId = rawData[0]?.patientid;
    const firstName = rawData[0]?.firstname;
    const lastName = rawData[0]?.lastname;
    const dob = rawData[0]?.dob;
    const mobilePhone = rawData[0]?.mobilephone;
    const email = rawData[0]?.email;
    const departmentId = rawData[0]?.departmentid;
    const primaryDepartmentId = rawData[0]?.primarydepartmentid;

    // Production validation checks
    if (patientId === null || patientId === undefined) {
      missingFields.push("Patient ID");
    }
    if (firstName === null || firstName === undefined) {
      missingFields.push("First Name");
    }
    if (lastName === null || lastName === undefined) {
      missingFields.push("Last Name");
    }
    if (dob === null || dob === undefined) {
      missingFields.push("Date of Birth");
    }
    if (mobilePhone === null || mobilePhone === undefined) {
      missingFields.push("Mobile Phone");
    }
    if (email === null || email === undefined) {
      missingFields.push("Email");
    }
    if (departmentId === null || departmentId === undefined) {
      missingFields.push("Department ID");
    }
    if (primaryDepartmentId === null || primaryDepartmentId === undefined) {
      missingFields.push("Primary Department ID");
    }

    return missingFields;
  };

  const groupData = (rawData: any): GroupedData => {
    const grouped: GroupedData = {
      basicInfo: {},
      contactInfo: {},
      clinicalInfo: {},
      preferences: {},
      other: {},
    };

    const mappings = {
      basicInfo: [
        "firstName",
        "lastName",
        "email",
        "address",
        "city",
        "zip",
        "sex",
        "dob",
      ],
      contactInfo: ["homephone", "mobilephone", "contactpreference"],
      clinicalInfo: [
        "patientid",
        "departmentlist",
        "status",
        "lastupdated",
        "departmentid",
        "primarydepartmentid",
      ],
      preferences: ["portalTermsOnFile", "emailExists", "consentPresent"],
    };

    Object.entries(rawData[0]).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      let placed = false;

      for (const [category, fields] of Object.entries(mappings)) {
        if (fields.some((field) => lowerKey.includes(field.toLowerCase()))) {
          grouped[category as keyof GroupedData][key] = value;
          placed = true;
          break;
        }
      }

      if (!placed) {
        grouped.other[key] = value;
      }
    });

    return grouped;
  };

  const formatValue = (value: any): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ");
  };

  const groupedData = groupData(data);
  const missingFields = getMissingFields(data);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {missingFields.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Missing Required Information
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please check the following fields:
                <ul className="list-disc pl-4 mt-1">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {Object.entries(groupedData).map(
        ([section, sectionData]) =>
          Object.keys(sectionData).length > 0 && (
            <div key={section} className="bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold p-4 bg-gray-50 rounded-t-lg border-b">
                {formatLabel(section)}
              </h2>
              <div className="divide-y">
                {Object.entries(sectionData).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 flex justify-between hover:bg-gray-50"
                  >
                    <div className="font-medium text-gray-700">
                      {formatLabel(key)}
                    </div>
                    <div className="text-gray-900 ml-4">
                      {formatValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
}
