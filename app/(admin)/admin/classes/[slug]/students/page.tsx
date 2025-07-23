"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function ClassTermStudentsPage() {
  const { slug } = useParams();
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/admin/enrollments?classTermId=${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data.enrollments || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-12 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex items-center">
            <li>
              <Link href="/admin/users" className="hover:underline text-blue-700 font-medium">Admin</Link>
            </li>
            <li className="mx-2">&gt;</li>
            <li>
              <Link href="/admin/classes" className="hover:underline text-blue-700 font-medium">Classes</Link>
            </li>
            <li className="mx-2">&gt;</li>
            <li className="text-gray-700 font-semibold">Class Term Students</li>
          </ol>
        </nav>
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
              Students in Class Term
            </h1>
            <p className="mt-2 text-base text-gray-500">
              List of all students enrolled in this class term.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-blue-700 font-medium">Loading students...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-32">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
              {error}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Gender</th>

                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Date of Birth</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Education Level</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">School</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Province</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-widest border-b-2 border-blue-200">Occupation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 max-w-[180px] truncate" title={student.name}>
                      <Link href={`/admin/classes/${slug}/students/${student.id}`} className="text-blue-700 hover:underline focus:underline focus:outline-none">
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-[200px] truncate" title={student.email}>{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                        ${student.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : student.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"}
                      `}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{student.gender || <span className="text-gray-300">-</span>}</td>
                
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : <span className="text-gray-300">-</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{student.education_level || <span className="text-gray-300">-</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 max-w-[160px] truncate" title={student.school_name}>{student.school_name || <span className="text-gray-300">-</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{student.province || <span className="text-gray-300">-</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{student.occupation || <span className="text-gray-300">-</span>}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-10 text-center text-gray-400 text-lg">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-10 h-10 text-gray-300 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m-3.5 0h14.5M4.75 9v9A2.25 2.25 0 007 20.25h10A2.25 2.25 0 0019.25 18V9"
                    />
                  </svg>
                  No students found for this class term.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 