// components/admin/ClassList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Loader2, AlertTriangle } from "lucide-react";

interface ClassTerm {
  id: string;
  title: string;
  slug: string;
  category: string;
  start_date: string;
  end_date: string;
  status: string;
  current_students: number;
  max_students: number;
}

function getStatusBadge(status: string) {
  let color = "";
  let icon = null;
  switch (status) {
    case "upcoming":
      color = "bg-blue-100 text-blue-800 border border-blue-200";
      icon = (
        <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
      break;
    case "ongoing":
      color = "bg-green-100 text-green-800 border border-green-200";
      icon = (
        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case "completed":
      color = "bg-gray-100 text-gray-800 border border-gray-200";
      icon = (
        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      );
      break;
    default:
      color = "bg-red-100 text-red-800 border border-red-200";
      icon = (
        <svg className="w-4 h-4 mr-1 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
        </svg>
      );
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function getFormattedDate(dateStr: string) {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return "N/A";
  }
}

export function ClassList() {
  const [classes, setClasses] = useState<ClassTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/classes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch classes");
        return res.json();
      })
      .then((data) => setClasses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-blue-600 py-8 justify-center">
        <Loader2 className="animate-spin w-5 h-5" />
        <span className="font-medium">Loading classes...</span>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center gap-2 text-red-500 py-8 justify-center">
        <AlertTriangle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );

  if (!classes.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="22" strokeWidth="3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 24h16M24 16v16" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No classes found</h3>
        <p className="text-gray-400">Create a new class to get started.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
          <tr>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Title</th>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Category</th>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Dates</th>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Status</th>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Students</th>
            <th className="py-4 px-5 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {classes.map((classTerm) => (
            <tr
              key={classTerm.id}
              className="hover:bg-blue-50/60 transition-colors group"
            >
              <td className="py-3 px-5">
                <Link
                  href={`/admin/classes/${classTerm.slug}/students`}
                  className="font-semibold text-blue-700 hover:underline hover:text-blue-900 transition"
                >
                  {classTerm.title}
                </Link>
              </td>
              <td className="py-3 px-5 capitalize">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                  {classTerm.category.replace("_", " ")}
                </span>
              </td>
              <td className="py-3 px-5 whitespace-nowrap">
                <span className="font-medium text-gray-700">
                  {getFormattedDate(classTerm.start_date)}
                </span>
                <span className="mx-1 text-gray-400">–</span>
                <span className="font-medium text-gray-700">
                  {getFormattedDate(classTerm.end_date)}
                </span>
              </td>
              <td className="py-3 px-5">
                {getStatusBadge(classTerm.status)}
              </td>
              <td className="py-3 px-5">
                <span
                  className={`font-semibold ${
                    classTerm.current_students >= classTerm.max_students
                      ? "text-red-500"
                      : "text-green-700"
                  }`}
                >
                  {classTerm.current_students}
                </span>
                <span className="text-gray-400"> / </span>
                <span className="font-semibold">{classTerm.max_students}</span>
                {classTerm.current_students >= classTerm.max_students && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 font-medium">
                    Full
                  </span>
                )}
              </td>
              <td className="py-3 px-5 space-x-2">
                <Link
                  href={`/admin/classes/${classTerm.slug}/edit`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 text-xs font-semibold shadow-sm border border-blue-100 transition"
                  title="Edit class"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2H7v-2l6-6" />
                  </svg>
                  Edit
                </Link>
                <Link
                  href={`/classes/${classTerm.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-900 text-xs font-semibold shadow-sm border border-green-100 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View public class page"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6m-1.293-4.707L10 15l-4 4-1 1 1-1 4-4L20.707 4.707z" />
                  </svg>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}