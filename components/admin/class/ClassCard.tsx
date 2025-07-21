"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useAdminRole } from "@/hooks/useAdminRole";
import { useState } from "react";

interface ClassItem {
  id: string;
  title: string;
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
  slug: string; // Added slug to the interface
}

export default function ClassCard({ classItem }: { classItem: ClassItem }) {
  const { userRole, isLoadingRole } = useAdminRole();

  const [userClassRole, setUserClassRole] = useState<string | null>(null);

  const getFormattedDate = (date: string | Date | undefined | null) => {
    if (!date) return "N/A";
    if (typeof date === "string") {
      try {
        return format(parseISO(date), "MMM d, yyyy");
      } catch {
        return "Invalid date";
      }
    }
    if (date instanceof Date) {
      try {
        return format(date, "MMM d, yyyy");
      } catch {
        return "Invalid date";
      }
    }
    return "Invalid date";
  };

  const formattedStartDate = getFormattedDate(classItem.start_date);
  const formattedEndDate = getFormattedDate(classItem.end_date);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 group hover:shadow-2xl hover:border-blue-400 hover:scale-[1.025]">
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
              classItem.status === "upcoming"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
          </span>
          <span className="px-3 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full capitalize">
            {classItem.category.replace("_", " ")}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">
          {classItem.title}
        </h2>

        <p className="text-gray-600 line-clamp-3 mb-5 text-base">
          {classItem.description}
        </p>

        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{formattedStartDate} - {formattedEndDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <span className="font-medium">{classItem.schedule.day}s</span> at <span className="font-medium">{classItem.schedule.time}</span> <span className="text-gray-400">({classItem.schedule.duration})</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>
              <span className="font-medium">{classItem.current_students}</span>
              <span className="text-gray-400">/</span>
              <span className="font-medium">{classItem.max_students}</span> students enrolled
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          {/* Only show Telegram group link if user is a student */}
          {isLoadingRole ? (
            <span className="text-sm text-gray-400 animate-pulse"></span>
          ) : userClassRole === "student" ? (
            classItem.telegram_group_link ? (
              <Link
                href={classItem.telegram_group_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-semibold rounded-lg shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
              >
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
                Join Group
              </Link>
            ) : (
              <span className="text-sm text-gray-400 italic">Group link coming soon</span>
            )
          ) : <span />}

          {/* Always show details link */}
          <Link
            href={`/classes/${classItem.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            View details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}