"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

const CLASS_CATEGORIES = [
  { value: "web_design", label: "Web Design" },
  { value: "java", label: "Java" },
  { value: "ui_ux", label: "UI/UX" },
  { value: "python", label: "Python" },
];

export function AddResourceForm() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [classCategory, setClassCategory] = useState("web_design");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          googleSlidesUrl: url,
          classCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
      setTitle("");
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add resource");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-10 bg-white rounded-3xl border border-gray-200">
      <h2 className="text-2xl font-extrabold mb-8 text-blue-800 text-center tracking-tight">
        👉 Add Google Slides Resource
      </h2>
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label htmlFor="title" className="block text-base font-semibold mb-2 text-gray-800">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 bg-gray-50"
            required
            autoComplete="off"
            placeholder="Enter resource title"
            maxLength={100}
          />
        </div>
        
        <div>
          <label htmlFor="class" className="block text-base font-semibold mb-2 text-gray-800">
            Class
          </label>
          <div className="relative">
            <select
              id="class"
              value={classCategory}
              onChange={(e) => setClassCategory(e.target.value)}
              className="w-full appearance-none px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white text-gray-900 pr-10"
              required
            >
              <option value="" disabled className="text-gray-400 bg-gray-50">
                🏷️ Select a class
              </option>
              {CLASS_CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                  className="text-gray-900 bg-white hover:bg-blue-50"
                >
                  {category.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        
        <div>
          <label htmlFor="url" className="block text-base font-semibold mb-2 text-gray-800">
            Google Slides URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 bg-gray-50"
            placeholder="https://docs.google.com/presentation/d/..."
            required
            autoComplete="off"
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-xl text-sm animate-shake">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl text-sm animate-fade-in">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Resource added successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="inline mr-2 w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Resource
            </>
          )}
        </button>
      </form>
    </div>
  );
}