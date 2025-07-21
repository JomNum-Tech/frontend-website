"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useAdminRole } from "@/hooks/useAdminRole";
import { format, parseISO, isValid } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ClassTerm {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    telegram_group_link: string;
    start_date: string;
    end_date: string;
    schedule: {
        day: string;
        time: string;
        duration: string;
    };
    status: string;
    current_students: number;
    max_students: number;
}

export function ClassDetails({ classTerm }: { classTerm: ClassTerm }) {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [userClassRole, setUserClassRole] = useState<string | null>(null);
    const [checkingRole, setCheckingRole] = useState(false);

    useEffect(() => {
        async function checkUserRole() {
            if (!user || !classTerm) return;
            setCheckingRole(true);
            try {
                const res = await fetch(`/api/user/role?classTermId=${classTerm.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setUserClassRole(data.role);
                } else {
                    setUserClassRole(null);
                }
            } catch {
                setUserClassRole(null);
            } finally {
                setCheckingRole(false);
            }
        }
        if (isLoaded && user && classTerm) checkUserRole();
    }, [isLoaded, user, classTerm]);

    function getFormattedDate(dateStr: string | undefined | null) {
        if (!dateStr || typeof dateStr !== 'string') return "N/A";
        let date: Date;
        try {
            date = parseISO(dateStr);
        } catch {
            return "N/A";
        }
        if (!isValid(date)) return "N/A";
        return format(date, "MMMM d, yyyy");
    }

    const formattedStartDate = getFormattedDate(classTerm.start_date);
    const formattedEndDate = getFormattedDate(classTerm.end_date);

    const { userRole } = useAdminRole();

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
            <div className="p-8 md:p-10">
                {/* Show approved message if user is approved for this class term */}
                {userClassRole === 'student' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-semibold">
                            You have been approved for this class! Welcome aboard.
                        </span>
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{classTerm.title}</h1>
                        <span className="inline-block mt-3 px-4 py-1 text-sm font-semibold bg-blue-200 text-blue-900 rounded-full shadow-sm capitalize">
                            {classTerm.category.replace("_", " ")}
                        </span>
                    </div>
                    <span
                        className={`px-4 py-1 text-sm font-semibold rounded-full shadow-sm capitalize transition-colors duration-200
                            ${classTerm.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : classTerm.status === 'ongoing'
                                    ? 'bg-green-100 text-green-800'
                                    : classTerm.status === 'completed'
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-red-100 text-red-800'
                            }`}
                        title={`Status: ${classTerm.status}`}
                    >
                        {classTerm.status}
                    </span>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">About This Class</h2>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                            {classTerm.description}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 rounded-full p-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Schedule</h3>
                                <p className="text-gray-600">
                                    {classTerm.schedule.day}s at {classTerm.schedule.time} <span className="text-xs text-gray-400">({classTerm.schedule.duration})</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 rounded-full p-2">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Enrollment</h3>
                                <p className="text-gray-600">
                                    <span className={classTerm.current_students >= classTerm.max_students ? "text-red-500 font-semibold" : ""}>
                                        {classTerm.current_students}
                                    </span>
                                    {" / "}
                                    {classTerm.max_students} students
                                </p>
                                {classTerm.current_students >= classTerm.max_students && (
                                    <span className="text-xs text-red-500 font-medium">Class is full</span>
                                )}
                            </div>
                        </div>

                        {/* Only show Telegram group link if user is a student */}
                        {userClassRole === "student" && (
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-50 rounded-full p-2 mt-1">
                                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">UI/UX - Gen 2</h3>
                                    <Link
                                        href={classTerm.telegram_group_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
                                    >
                                        Join Class Telegram Group
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-1">
                                        All class communications will happen here
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        className={`px-6 py-3 text-base font-semibold rounded-lg shadow transition-colors duration-200
                            ${userClassRole === 'student'
                                ? "bg-green-300 text-green-700 cursor-not-allowed"
                                : classTerm.current_students >= classTerm.max_students || !classTerm.slug
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300"
                            }`}
                        disabled={userClassRole === 'student' || classTerm.current_students >= classTerm.max_students || !classTerm.slug}
                        onClick={() => {
                            if (
                                userClassRole !== 'student' &&
                                classTerm.current_students < classTerm.max_students &&
                                classTerm.slug
                            ) {
                                router.push(`/classes/${classTerm.slug}/register`);
                            }
                        }}
                    >
                        {userClassRole === 'student'
                            ? "You are enrolled this class"
                            : classTerm.current_students >= classTerm.max_students
                                ? "Class Full"
                                : "Enroll Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}