"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface Resource {
  id: string;
  title: string;
  google_slides_url: string;
  class_category: string;
  created_at: string;
}

const CLASS_CATEGORIES = [
  { value: "all", label: "All Classes" },
  { value: "web_design", label: "Web Design" },
  { value: "java", label: "Java" },
  { value: "ui_ux", label: "UI/UX" },
  { value: "python", label: "Python" },
];

export function ResourcesList() {
  const { user } = useUser();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/admin/resource")
        .then((res) => res.json())
        .then((data) => {
          setResources(data);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const extractGoogleSlidesId = (url: string): string | null => {
    // Handle direct presentation URLs
    const directRegex = /\/presentation\/d\/([a-zA-Z0-9_-]+)/;
    const directMatch = url.match(directRegex);
    if (directMatch) return directMatch[1];

    // Handle shareable link URLs
    const shareableRegex = /\/d\/([a-zA-Z0-9_-]+)/;
    const shareableMatch = url.match(shareableRegex);
    if (shareableMatch) return shareableMatch[1];

    // Handle URL shortener links
    if (url.includes("goo.gl") || url.includes("bit.ly")) {
      // Note: In a real app, you might want to resolve the short URL first
      // This is a simplified version that checks for common patterns
      const shortenerRegex = /[a-zA-Z0-9_-]+$/;
      const shortenerMatch = url.match(shortenerRegex);
      if (shortenerMatch) return shortenerMatch[0];
    }

    return null;
  };

  const handlePreview = (url: string) => {
    const slidesId = extractGoogleSlidesId(url);
    if (slidesId) {
      setPreviewUrl(`https://docs.google.com/presentation/d/${slidesId}/preview`);
    } else {
      // Fallback to original URL if we can't extract ID
      setPreviewUrl(url);
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
          <path d="M7 3v4M17 3v4" strokeWidth="2" />
        </svg>
        Your Resources
      </h2>
      
      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg w-full max-w-6xl h-[90vh]">
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-200 transition"
              aria-label="Close preview"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-lg border-none"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}

      <div className="mb-8">
        <nav className="flex flex-wrap gap-2" aria-label="Tabs">
          {CLASS_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedClass(category.value)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-150 focus:outline-none border
                ${
                  selectedClass === category.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
              `}
              aria-current={selectedClass === category.value ? "page" : undefined}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Loading resources...
        </div>
      ) : (() => {
        const filteredResources =
          selectedClass === "all"
            ? resources
            : resources.filter(
                (resource) => resource.class_category === selectedClass
              );

        if (filteredResources.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p className="text-base">No resources found for this class.</p>
            </div>
          );
        }

        return (
          <div className="max-h-[420px] overflow-y-auto pr-4">
            <ul className="space-y-5">
              {filteredResources.map((resource) => (
                <li
                  key={resource.id}
                  className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                          <path d="M7 3v4M17 3v4" strokeWidth="2" />
                        </svg>
                        {resource.title}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full mt-2 font-medium border border-blue-100">
                        {CLASS_CATEGORIES.find(
                          (c) => c.value === resource.class_category
                        )?.label}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePreview(resource.google_slides_url)}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preview
                      </button>
                      <a
                        href={resource.google_slides_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m-1.5-5.5L10 17m0 0H7a4 4 0 01-4-4v-3" />
                        </svg>
                        View Slides
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Added on{" "}
                    <span className="font-medium text-gray-600">
                      {new Date(resource.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}
    </div>
  );
}