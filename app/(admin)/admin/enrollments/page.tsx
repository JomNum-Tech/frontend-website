'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Enrollment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  class_term_title: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetch(`/api/admin/enrollments?status=${filter}`)
      .then(res => res.json())
      .then(data => {
        setEnrollments(data.enrollments || []);
        setLoading(false);
      });
  }, [filter]);

  const filteredEnrollments = filter === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.status === filter);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`/api/admin/enrollments/${id}/${action}`, { method: 'POST' });
    setEnrollments(prevEnrollments =>
      prevEnrollments.map(e =>
        e.id === id ? { ...e, status: action === 'approve' ? 'approved' : 'rejected' } : e
      )
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-12 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Enrollment Requests</h1>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All", value: "all", color: "bg-blue-600", text: "text-white" },
            { label: "Pending", value: "pending", color: "bg-yellow-500", text: "text-white" },
            { label: "Approved", value: "approved", color: "bg-green-600", text: "text-white" },
            { label: "Rejected", value: "rejected", color: "bg-red-600", text: "text-white" },
          ].map(({ label, value, color, text }) => (
            <button
              key={value}
              onClick={() => setFilter(value as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
                ${filter === value ? `${color} ${text} shadow` : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
              `}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-lg">
                    No enrollments found.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      <Link href={`/admin/enrollments/${enrollment.id}`} className="text-blue-700 hover:underline focus:underline focus:outline-none">
                        {enrollment.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enrollment.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enrollment.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enrollment.class_term_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                        ${
                          enrollment.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : enrollment.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      `}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {enrollment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(enrollment.id, 'approve')}
                              className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-xs font-semibold shadow hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                              title="Approve"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(enrollment.id, 'reject')}
                              className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md text-xs font-semibold shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
                              title="Reject"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/enrollments/${enrollment.id}`}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                          title="View details"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                          </svg>
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}