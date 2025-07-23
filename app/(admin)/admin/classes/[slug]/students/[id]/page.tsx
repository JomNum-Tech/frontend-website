"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Enrollment {
  id: string;
  user_id: string;
  name: string;
  email: string;
  status: string;
  gender?: string;
  phone?: string;
  date_of_birth?: string;
  education_level?: string;
  school_name?: string;
  province?: string;
  occupation?: string;
  referral_source?: string;
  // Add other fields as needed
}

export default function StudentDetailPage() {
  const { slug, id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !id) return;
    setLoading(true);
    fetch(`/api/admin/enrollments/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch student details");
        const data = await res.json();
        setStudent(data.enrollment || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, id]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-12 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-blue-700" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex flex-wrap items-center gap-2">
            <li className="flex items-center gap-2">
              <Link href="/admin/users" className="hover:underline text-blue-700 font-semibold">Admin</Link>
              <span className="text-blue-300">/</span>
            </li>
            <li className="flex items-center gap-2">
              <Link href="/admin/classes" className="hover:underline text-blue-700 font-semibold">Classes</Link>
              <span className="text-blue-300">/</span>
            </li>
            <li className="flex items-center gap-2">
              <Link href={`/admin/classes/${slug}/students`} className="hover:underline text-blue-700 font-semibold">Class Term Students</Link>
              <span className="text-blue-300">/</span>
            </li>
            <li className="text-blue-900 font-bold">Student Detail</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
                Student Details
              </h1>
              <p className="mt-2 text-blue-700/80">
                View and manage student information
              </p>
            </div>
            <button 
              onClick={() => router.back()}
              className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-lg shadow-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            >
              ← Back to Students
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500 mb-5"></div>
            <span className="text-blue-700 font-semibold text-lg">Loading student details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-base text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        ) : student ? (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-blue-100">
            {/* Student Header */}
            <div className="px-8 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{student.name}</h3>
                <p className="mt-1 text-base text-blue-700">{student.email}</p>
              </div>
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                ${
                  student.status === "approved"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : student.status === "rejected"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
              {/* Personal Information */}
              <div className="space-y-5">
                <h4 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-2">Personal Information</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-blue-700">Gender</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.gender || <span className="text-blue-300">Not specified</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Phone</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.phone || <span className="text-blue-300">Not provided</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Date of Birth</p>
                    <p className="text-base font-medium text-blue-900 mt-1">
                      {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : <span className="text-blue-300">Not provided</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Information */}
              <div className="space-y-5">
                <h4 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-2">Education Information</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-blue-700">Education Level</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.education_level || <span className="text-blue-300">Not specified</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">School</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.school_name || <span className="text-blue-300">Not provided</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Province</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.province || <span className="text-blue-300">Not provided</span>}</p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-5 md:col-span-2">
                <h4 className="text-lg font-bold text-blue-800 border-b-2 border-blue-100 pb-2">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-blue-700">Occupation</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.occupation || <span className="text-blue-300">Not provided</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Referral Source</p>
                    <p className="text-base font-medium text-blue-900 mt-1">{student.referral_source || <span className="text-blue-300">Not provided</span>}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="mx-auto h-14 w-14 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-blue-900">Student not found</h3>
            <p className="mt-2 text-base text-blue-700">The requested student could not be found.</p>
            <div className="mt-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-6 py-2 border border-transparent shadow-md text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
              >
                ← Go back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}