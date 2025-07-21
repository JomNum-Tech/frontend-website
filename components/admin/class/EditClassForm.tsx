"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

const CLASS_CATEGORIES = [
  { value: "web_design", label: "Web Design" },
  { value: "java", label: "Java" },
  { value: "ui_ux", label: "UI/UX" },
  { value: "python", label: "Python" },
];

const DAYS_OF_WEEK = [
  "Monday", "Tuesday", "Wednesday", "Thursday", 
  "Friday", "Saturday", "Sunday"
];

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditClassForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web_design",
    telegram_group_link: "",
    start_date: "",
    end_date: "",
    schedule_day: "Monday",
    schedule_time: "19:00",
    schedule_duration: "2 hours",
    max_students: 20,
    status: "upcoming",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      // Ensure start_date and end_date are strings
      const startDateStr =
        typeof initialData.start_date === "string"
          ? initialData.start_date
          : initialData.start_date instanceof Date
          ? initialData.start_date.toISOString()
          : "";
      const endDateStr =
        typeof initialData.end_date === "string"
          ? initialData.end_date
          : initialData.end_date instanceof Date
          ? initialData.end_date.toISOString()
          : "";

      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        telegram_group_link: initialData.telegram_group_link || "",
        start_date: startDateStr ? format(parseISO(startDateStr), "yyyy-MM-dd'T'HH:mm") : "",
        end_date: endDateStr ? format(parseISO(endDateStr), "yyyy-MM-dd'T'HH:mm") : "",
        schedule_day: initialData.schedule.day,
        schedule_time: initialData.schedule.time,
        schedule_duration: initialData.schedule.duration,
        max_students: initialData.max_students,
        status: initialData.status,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const schedule = {
        day: formData.schedule_day,
        time: formData.schedule_time,
        duration: formData.schedule_duration,
      };

      const response = await fetch(`/api/admin/classes/${initialData.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },  
        body: JSON.stringify({
          ...formData,
          schedule,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      router.push("/admin/classes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white rounded-2xl shadow-xl border border-blue-200">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 flex items-center gap-2">
          <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Edit Class Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 placeholder-blue-300"
              required
              autoFocus
              placeholder="Enter class title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            >
              <option value="" disabled>Select category</option>
              {CLASS_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 placeholder-blue-300"
            rows={4}
            required
            placeholder="Describe the class..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            >
              <option value="" disabled>Select status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Max Students</label>
            <input
              type="number"
              name="max_students"
              value={formData.max_students}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 placeholder-blue-300"
              min="1"
              required
              placeholder="e.g. 30"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-700">Telegram Group Link</label>
          <input
            type="url"
            name="telegram_group_link"
            value={formData.telegram_group_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 placeholder-blue-300"
            placeholder="https://t.me/yourgroupname"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Start Date</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">End Date</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Class Day</label>
            <select
              name="schedule_day"
              value={formData.schedule_day}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            >
              <option value="" disabled>Select day</option>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Start Time</label>
            <input
              type="time"
              name="schedule_time"
              value={formData.schedule_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 text-blue-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-blue-700">Duration</label>
            <input
              type="text"
              name="schedule_duration"
              value={formData.schedule_duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition bg-blue-50 placeholder-blue-300"
              placeholder="e.g. 2 hours"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mt-2">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => router.push("/admin/classes")}
            className="px-6 py-2 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition disabled:bg-blue-300"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Updating...
              </span>
            ) : (
              "Update Class"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}