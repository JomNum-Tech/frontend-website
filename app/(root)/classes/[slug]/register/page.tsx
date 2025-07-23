'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { use } from "react";
import { ClassTerm } from '@/components/admin/class/ClassDetails';
import { upload } from '@vercel/blob/client';

import Image from "next/image"
import Link from "next/link"

type Params = { slug: string };

type FormState = {
  name: string;
  gender: string;
  phone: string;
  email: string;
  facebook_link: string;
  date_of_birth: string;
  education_level: string;
  school_name: string;
  province: string;
  occupation: string;
  referral_source: string;
  career_interests: string[];
  comments: string;
  payment_proof_file: File | null;
};

export default function ClassTermRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useUser();
  const router = useRouter();

  // Form state
  const [form, setForm] = useState<FormState>({
    name: '',
    gender: '',
    phone: '',
    email: user?.emailAddresses[0]?.emailAddress || '' ,
    facebook_link: '',
    date_of_birth: '',
    education_level: '',
    school_name: '',
    province: '',
    occupation: '',
    referral_source: '',
    career_interests: [],
    comments: '',
    payment_proof_file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [classTerm, setClassTerm] = useState<ClassTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  // Add a new state for step
  const [step, setStep] = useState(1);
  // Add state for custom profile picture
  const [customProfileFile, setCustomProfileFile] = useState<File | null>(null);
  const [customProfilePreview, setCustomProfilePreview] = useState<string | null>(null);
  // Add state for payment proof preview
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [paymentProofType, setPaymentProofType] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClassTerm() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/classes/classes-term/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('Failed to fetch class term');
        }

        const data = await response.json();
        
        // Parse schedule if it's a string
        const parsedClassTerm = {
          ...data.classTerm,
          schedule: typeof data.classTerm.schedule === 'string' 
            ? JSON.parse(data.classTerm.schedule) 
            : data.classTerm.schedule,
          start_date: data.classTerm.start_date?.toString(),
          end_date: data.classTerm.end_date?.toString(),
        } as ClassTerm;

        setClassTerm(parsedClassTerm);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load class');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchClassTerm();
    }
  }, [slug, router]);

  // Check if user already registered for this class term
  useEffect(() => {
    async function checkRegistration() {
      if (!user || !classTerm) return;
      setCheckingRegistration(true);
      try {
        const res = await fetch(`/api/admin/enrollments?class_term_id=${classTerm.id}&user_id=${user.id}`);
        if (res.ok) {
          setAlreadyRegistered(true);
          const data = await res.json();
          // Assume API returns { enrollment: { status: ... } }
          setRegistrationStatus(data.enrollment?.status || 'pending');
        } else {
          setAlreadyRegistered(false);
          setRegistrationStatus(null);
        }
      } catch {
        setAlreadyRegistered(false);
        setRegistrationStatus(null);
      } finally {
        setCheckingRegistration(false);
      }
    }
    if (user && classTerm) checkRegistration();
  }, [user, classTerm, router]);

  if (!user) return <div>Please sign in to register.</div>;
  if (loading) return <div>Loading class information...</div>;
  if (!classTerm) return <div>Class not found or failed to load.</div>;
  if (checkingRegistration) return <div className="text-blue-700 text-center py-8">Checking your registration status...</div>;
  if (alreadyRegistered) {
    let statusBanner = null;
    if (registrationStatus === 'approved') {
      statusBanner = (
        <div className="flex flex-col items-center justify-center gap-2 mb-6 px-6 py-4 bg-green-50 border border-green-200 rounded-xl shadow">
          <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" fill="none" />
          </svg>
          <div className="text-lg font-bold text-green-700">Registration Approved!</div>
          <div className="text-green-600 text-center">Congratulations! Your registration has been approved. Please check your email for further instructions.</div>
        </div>
      );
    } else if (registrationStatus === 'rejected') {
      statusBanner = (
        <div className="flex flex-col items-center justify-center gap-2 mb-6 px-6 py-4 bg-red-50 border border-red-200 rounded-xl shadow">
          <svg className="w-10 h-10 text-red-500 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fecaca" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" stroke="#ef4444" strokeWidth="2" fill="none" />
          </svg>
          <div className="text-lg font-bold text-red-700">Registration Rejected</div>
          <div className="text-red-600 text-center">We regret to inform you that your registration was not approved. Please contact support for more information.</div>
        </div>
      );
    }
    return (
      <div className="my-16 flex flex-col items-center justify-center py-12 px-4 bg-blue-50 rounded-xl shadow-md border border-blue-200 max-w-lg mx-auto mt-10">
        {statusBanner}
        {(!registrationStatus || registrationStatus === 'pending') && (
          <>
            <svg
              className="w-16 h-16 text-blue-400 mb-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e0f2fe" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
                stroke="#38bdf8"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <h2 className="text-2xl font-bold text-blue-800 mb-2">Registration Submitted!</h2>
            <p className="text-blue-700 mb-2">
              You have already registered for this class term.
            </p>
            <p className="text-blue-600 mb-4">
              Please wait while an admin reviews your registration.<br />
              You will be notified once your registration is approved.
            </p>
            <div className="flex items-center gap-2 text-blue-500 text-sm">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Waiting for admin approval...
            </div>
          </>
        )}
      </div>
    );
  }

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'file') {
      const target = e.target as HTMLInputElement;
      setForm(f => ({
        ...f,
        [name]: target.files && target.files.length > 0 ? target.files[0] : null,
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;
      const val = target.value;
      setForm(f => ({
        ...f,
        career_interests: checked
          ? [...f.career_interests, val]
          : f.career_interests.filter(v => v !== val),
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Placeholder for file upload logic
  async function uploadFile(file: File | null, type: 'id_card' | 'payment_proof'): Promise<string> {
    if (!file) return '';
    // Choose directory based on file type
    let dir = '';
    if (type === 'id_card') {
      dir = `enrollments/id-cards/`;
    } else if (type === 'payment_proof') {
      dir = `enrollments/payment-proofs/`;
    }
    // Use user id and timestamp for uniqueness if available
    const userId = user?.id || 'anonymous';
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${userId}_${timestamp}.${ext}`;
    const blobPath = `${dir}${filename}`;
    // Upload to Vercel Blob
    const { url } = await upload(blobPath, file, {
      access: 'public',
      handleUploadUrl: '/api/admin/storage/upload',
    });
    return url;
  }

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Use uploaded file if present, else fetch Clerk profile image
      let id_card_url = '';
      if (customProfileFile) {
        id_card_url = await uploadFile(customProfileFile, 'id_card');
      } else if (user?.imageUrl) {
        const response = await fetch(user.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'profile-picture.jpg', { type: blob.type });
        id_card_url = await uploadFile(file, 'id_card');
      }
      // Upload payment proof file
      const payment_proof_url = await uploadFile(form.payment_proof_file, 'payment_proof');

      // Prepare payload
      const payload = {
        user_id: user.id,
        class_term_id: classTerm.id,
        name: form.name,
        gender: form.gender,
        phone: form.phone,
        email: form.email || user.emailAddresses[0]?.emailAddress,
        facebook_link: form.facebook_link,
        date_of_birth: form.date_of_birth,
        id_card_url, // Now from custom or Clerk profile
        education_level: form.education_level,
        school_name: form.school_name,
        province: form.province,
        occupation: form.occupation,
        referral_source: form.referral_source,
        career_interests: form.career_interests,
        comments: form.comments,
        payment_proof_url,
      };

      // Submit to API
      const res = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Add a helper for step validation
  const validateStep = () => {
    if (step === 1) {
      return (
        form.name && form.gender && form.phone && (form.email || user.emailAddresses[0]?.emailAddress) && form.date_of_birth
      );
    }
    if (step === 2) {
      return true; // All fields optional
    }
    if (step === 3) {
      return !!form.payment_proof_file;
    }
    return true;
  };

  // Stepper labels
  const stepLabels = ["Personal Info", "Education & Career", "Payment"];

  // Replace the single form with a multi-step form
  return (
    <div className="container mx-auto px-6 md:px-12 py-10 bg-white rounded-2xl shadow-lg border border-blue-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 tracking-tight">Register for Class Term: {classTerm?.title || ""}</h1>
      {error && (
        <div className="text-red-700 mb-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}
      {success ? (
        <div className="text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-4 py-4 text-center font-semibold">
          Registration submitted! Please wait for admin approval.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Stepper */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center w-full max-w-xl justify-between">
              {stepLabels.map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center relative">
                    {/* Circle */}
                    <div className={`flex items-center justify-center rounded-full border-2 transition-all duration-200
                      ${isActive ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg' : isCompleted ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white border-blue-200 text-blue-400'}
                      w-10 h-10 z-10 font-bold text-lg`}
                    >
                      {isCompleted ? (
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`mt-2 text-xs font-semibold text-center w-32
                      ${isActive ? 'text-blue-700' : isCompleted ? 'text-blue-500' : 'text-blue-400'}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Progress Bar */}
            <div className="w-full max-w-xl mt-4">
              <div className="h-2 bg-blue-100 rounded-full relative overflow-hidden">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((step - 1) / (stepLabels.length - 1)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 transition-all duration-150 outline-none"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    required
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    placeholder="Email"
                    readOnly
                    required
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    type="email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="facebook_link">
                  Telegram Contact Link
                </label>
                <input
                  id="facebook_link"
                  name="facebook_link"
                  placeholder="https://t.me/yourusername"
                  className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                  value={form.facebook_link}
                  onChange={handleChange}
                  autoComplete="url"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="date_of_birth">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 transition-all duration-150 outline-none"
                  value={form.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <Image
                    src={customProfilePreview || user?.imageUrl || '/default-avatar.png'}
                    alt="Profile Picture Preview"
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-blue-200 shadow"
                  />
                  <span className="text-blue-700 text-sm">This will be used as your profile picture.</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setCustomProfileFile(file);
                      setCustomProfilePreview(URL.createObjectURL(file));
                    } else {
                      setCustomProfileFile(null);
                      setCustomProfilePreview(null);
                    }
                  }}
                  className="block w-full text-sm text-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 bg-blue-50 border border-blue-200"
                />
                <p className="text-xs text-blue-400 mt-1">Accepted formats: JPG, PNG. Max size: 5MB.</p>
              </div>
            </>
          )}
          {/* Step 2: Education & Career */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="education_level">
                    Education Level
                  </label>
                  <input
                    id="education_level"
                    name="education_level"
                    placeholder="Education Level"
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.education_level}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="school_name">
                    School/University Name
                  </label>
                  <input
                    id="school_name"
                    name="school_name"
                    placeholder="School/University Name"
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.school_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="province">
                    Province/City
                  </label>
                  <input
                    id="province"
                    name="province"
                    placeholder="Province/City"
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.province}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="occupation">
                    Occupation
                  </label>
                  <input
                    id="occupation"
                    name="occupation"
                    placeholder="Occupation"
                    className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                    value={form.occupation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="referral_source">
                  How did you hear about us?
                </label>
                <input
                  id="referral_source"
                  name="referral_source"
                  placeholder="How did you hear about us?"
                  className="w-full px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                  value={form.referral_source}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700">
                  Career Interests
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Web Developer', 'Mobile Developer', 'UI/UX', 'Data Scientist', 'Other'].map(opt => (
                    <label key={opt} className="flex items-center space-x-2 text-sm font-normal text-blue-800 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      <input
                        type="checkbox"
                        name="career_interests"
                        value={opt}
                        checked={form.career_interests.includes(opt)}
                        onChange={handleChange}
                        className="accent-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="comments">
                  Other comments
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  placeholder="Other comments"
                  className="w-full min-h-[80px] px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl bg-blue-50 text-blue-900 placeholder-blue-300 transition-all duration-150 outline-none"
                  value={form.comments}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {/* Step 3: Payment */}
          {step === 3 && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-blue-800 mb-3 flex items-center gap-2">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  Bank Transfer Payment
                </h2>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                  <div className="flex flex-col items-center gap-3 md:items-start">
                    <Link
                      href="https://link.payway.com.kh/ABAPAYjD363173c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center"
                      title="Click to open QR payment in new tab"
                    >
                      <div className="relative">
                        <Image
                          height={900}
                          width={900}
                          src="https://ijewzjgscgbar55p.public.blob.vercel-storage.com/admin-uploads/photo_2025-07-22_14-19-38.jpg"
                          alt="Bank QR Code"
                          className="w-120 h-120 md:w-80 md:h-80 object-contain border-4 border-blue-300 rounded-2xl bg-white shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl"
                        />                        
                      </div>
                      <span className="mt-3 text-sm font-semibold text-blue-700 group-hover:underline group-hover:text-blue-900 transition">
                        Scan QR to pay
                        <svg className="inline ml-1 w-4 h-4 text-blue-400 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-blue-900 text-base">
                      <span className="font-semibold">Bank:</span> <span className="ml-1">ABA Bank</span>
                    </div>
                    <div className="mb-2 text-blue-900 text-base">
                      <span className="font-semibold">Account Name:</span> <span className="ml-1">NAKTECH BY V.SOL</span>
                    </div>
                    <div className="mb-2 text-blue-900 text-base flex items-center">
                      <span className="font-semibold">Account Number:</span>
                      <span className="ml-1 tracking-wider select-all">500-626-557</span>
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                        onClick={() => {
                          navigator.clipboard.writeText("123-456-789");
                        }}
                        title="Copy account number"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="mt-4 text-blue-700 text-sm bg-blue-100 rounded px-3 py-2">
                      Please transfer the registration fee and upload your payment proof below.<br />
                      <span className="font-semibold text-blue-800">Note:</span> Make sure your payment slip is clear and readable.
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-semibold mb-2 text-blue-700" htmlFor="payment_proof_file">
                  Upload Payment Proof <span className="text-red-500">*</span>
                </label>
                <input
                  id="payment_proof_file"
                  name="payment_proof_file"
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  onChange={e => {
                    handleChange(e);
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setPaymentProofType(file.type);
                      if (file.type.startsWith('image/')) {
                        setPaymentProofPreview(URL.createObjectURL(file));
                      } else if (file.type === 'application/pdf') {
                        setPaymentProofPreview('pdf');
                      } else {
                        setPaymentProofPreview(null);
                      }
                    } else {
                      setPaymentProofPreview(null);
                      setPaymentProofType(null);
                    }
                  }}
                  className="block w-full text-sm text-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 bg-blue-50 border border-blue-200"
                />
                <p className="text-xs text-blue-400 mt-1">Accepted formats: JPG, PNG, PDF. Max size: 5MB.</p>
                {/* Payment proof preview */}
                {paymentProofPreview && (
                  <div className="mt-4">
                    {paymentProofType && paymentProofType.startsWith('image/') ? (
                      <Image
                        src={paymentProofPreview}
                        alt="Payment Proof Preview"
                        width={320}
                        height={320}
                        className="rounded-xl border border-blue-200 shadow max-h-64 object-contain"
                      />
                    ) : paymentProofType === 'application/pdf' ? (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-blue-700 font-semibold">PDF file selected</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button type="button" className="px-6 py-2 rounded-xl bg-blue-100 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-200 transition" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" className={`px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold border border-blue-700 hover:bg-blue-700 transition ${!validateStep() ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={() => validateStep() && setStep(step + 1)} disabled={!validateStep()}>
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className={`px-6 py-2 rounded-xl font-bold transition-colors shadow-sm ${submitting || !classTerm || loading || alreadyRegistered || checkingRegistration ? 'bg-blue-200 text-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                disabled={submitting || !classTerm || loading || alreadyRegistered || checkingRegistration || !validateStep()}
              >
                {submitting ? (
                  <span>
                    <svg className="inline w-5 h-5 mr-2 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}