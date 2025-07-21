'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAdminRole } from '@/hooks/useAdminRole';

type EnrollmentDetails = {
  id: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  facebook_link: string;
  date_of_birth: string;
  id_card_url: string;
  education_level: string;
  school_name: string;
  province: string;
  occupation: string;
  referral_source: string;
  career_interests: string[];
  comments: string;
  payment_proof_url: string;
  status: 'pending' | 'approved' | 'rejected';
  class_term_title: string;
  created_at: string;
};

export default function EnrollmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAdmin, isLoadingRole } = useAdminRole();
  const [enrollment, setEnrollment] = useState<EnrollmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isLoadingRole && !isAdmin) {
      router.replace('/unauthorized');
    }
  }, [isAdmin, isLoadingRole, router]);

  useEffect(() => {
    if (!isAdmin || isLoadingRole) return;
    const fetchEnrollment = async () => {
      try {
        const response = await fetch(`/api/admin/enrollments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch enrollment');
        }
        const data = await response.json();
        setEnrollment(data.enrollment);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollment();
  }, [id, isAdmin, isLoadingRole]);

  const handleAction = async (action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/enrollments/${id}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${action} enrollment`);
      }

      // Update local state
      setEnrollment(prev => prev ? { ...prev, status: action === 'approve' ? 'approved' : 'rejected' } : null);
      
      // Optionally redirect back to list
      router.push('/admin/enrollments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isLoadingRole || (!isAdmin && !isLoadingRole)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!enrollment) {
    return <div>Enrollment not found</div>;
  }

  return (
    <div className="container mx-auto px-12 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Enrollment Details</h1>
        <button 
          onClick={() => router.push('/admin/enrollments')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-200 transition font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to List
        </button>
      </div>

      {/* Basic Information */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
        </div>
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.name}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.gender}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date of Birth</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.date_of_birth}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facebook Profile</p>
            <p className="mt-1 text-base text-gray-900">
              {enrollment.facebook_link ? (
                <a href={enrollment.facebook_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  View Profile
                </a>
              ) : <span className="text-gray-400">Not provided</span>}
            </p>
          </div>
        </div>
      </section>

      {/* Education & Career */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Education & Career</h2>
        </div>
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Education Level</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.education_level || <span className="text-gray-400">Not provided</span>}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">School/University</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.school_name || <span className="text-gray-400">Not provided</span>}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Province/City</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.province || <span className="text-gray-400">Not provided</span>}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Occupation</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.occupation || <span className="text-gray-400">Not provided</span>}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Referral Source</p>
            <p className="mt-1 text-base text-gray-900">{enrollment.referral_source || <span className="text-gray-400">Not provided</span>}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Career Interests</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {enrollment.career_interests?.length > 0 ? (
                enrollment.career_interests.map((interest, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">Not specified</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Class Information */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Class Information</h2>
        </div>
        <div className="px-8 py-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</p>
          <p className="mt-1 text-base text-gray-900">{enrollment.class_term_title}</p>
        </div>
      </section>

      {/* Documents */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        </div>
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID Card/Passport</p>
            {enrollment.id_card_url ? (
              <a 
                href={enrollment.id_card_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                </svg>
                View Document
              </a>
            ) : (
              <p className="mt-2 text-base text-gray-400">Not provided</p>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Proof</p>
            {enrollment.payment_proof_url ? (
              <a 
                href={enrollment.payment_proof_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center px-4 py-2 border border-green-200 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                </svg>
                View Document
              </a>
            ) : (
              <p className="mt-2 text-base text-gray-400">Not provided</p>
            )}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Additional Information</h2>
        </div>
        <div className="px-8 py-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comments</p>
          <p className="mt-2 text-base text-gray-900 whitespace-pre-line">
            {enrollment.comments || <span className="text-gray-400">No additional comments</span>}
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      {enrollment.status === 'pending' && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button
            onClick={() => handleAction('reject')}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject Application
          </button>
          <button
            onClick={() => handleAction('approve')}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Approve Application
          </button>
        </div>
      )}
    </div>
  );
}