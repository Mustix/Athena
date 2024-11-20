import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";

import PatientCard from "../patientCard/PatientCard";
import styles from "./PatientView.module.css";
const PatientView = ({ data }: { data: any }) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  console.log(data[0]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Move this to the top

  /*  requiredFields.forEach(({ field, name }) => {
    if (field === null || field === undefined) {
      missingFields.push(name);
    } 
  });*/
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "Not provided";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return JSON.stringify(value, null, 2);
    if (typeof value === "object") {
      if (value instanceof Date) return value.toLocaleDateString();
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, " ")
      .trim();
  };

  const getStatusColor = (value: string) => {
    const status = value.toString().toLowerCase();
    if (status.includes("active")) return "bg-green-100 text-green-800";
    if (status.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (status.includes("inactive") || status.includes("error"))
      return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const renderValue = (key: string, value: any) => {
    const isStatus = key.toLowerCase().includes("status");
    const isEmail =
      key.toLowerCase().includes("email") && typeof value === "string";
    const isPhone =
      key.toLowerCase().includes("phone") && typeof value === "string";
    const isDate =
      key.toLowerCase().includes("date") ||
      key.toLowerCase().includes("updated") ||
      key.toLowerCase().includes("modified");

    if (isStatus) {
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm ${getStatusColor(value)}`}
        >
          {formatValue(value)}
        </span>
      );
    }

    if (isEmail && value) {
      return (
        <a
          href={`mailto:${value}`}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          {formatValue(value)}
        </a>
      );
    }

    if (isPhone && value) {
      return (
        <a
          href={`tel:${value}`}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          {formatValue(value)}
        </a>
      );
    }

    if (isDate && value) {
      return (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(value).toLocaleString()}
        </span>
      );
    }

    return formatValue(value);
  };

  const sections = Object.entries(data[0] || {}).reduce(
    (acc: Record<string, Record<string, any>>, [key, value]) => {
      const section =
        key.toLowerCase().includes("date") ||
        key.toLowerCase().includes("updated")
          ? "Timestamps"
          : key.toLowerCase().includes("phone") ||
            key.toLowerCase().includes("email") ||
            key.toLowerCase().includes("address")
          ? "Contact"
          : key.toLowerCase().includes("status")
          ? "Status"
          : key.toLowerCase().includes("id")
          ? "Identifiers"
          : "General Information";

      if (!acc[section]) acc[section] = {};
      acc[section][key] = value;
      return acc;
    },
    {}
  );

  if (!data?.length) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex items-center gap-5">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-red-700">No patient data available</span>
      </div>
    );
  }

  return (
    <div className={styles.patientContainer}>
      <PatientCard data={data[0]} />
      <div className={styles.accordeon}>
        {Object.entries(sections).map(([section, sectionData]) => (
          <div
            key={section}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <button
              onClick={() => toggleSection(section)}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
            >
              <h2 className="text-lg font-medium text-gray-900">{section}</h2>
              {expandedSections[section] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections[section] && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(sectionData).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col p-3 rounded-lg bg-gray-50"
                    >
                      <span className="text-sm text-gray-500 break-all">
                        {formatKey(key)}
                      </span>
                      <div className="mt-1 text-gray-900 break-all">
                        {renderValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientView;
