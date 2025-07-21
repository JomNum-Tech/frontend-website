"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function CreateClassForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "web_design",
    telegram_group_link: "",
    start_date: "",
    end_date: "",
    schedule_day: "Monday",
    schedule_time: "19:00",
    schedule_duration: "2 hours",
    max_students: 20,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch("/api/admin/classes", {
        method: "POST",
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
      setError(err instanceof Error ? err.message : "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-12 py-8 bg-white rounded-2xl shadow-lg border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
        Fill out the form below to add a new class term.
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">URL Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="web-design-fall-2023"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
              required
            >
              {CLASS_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Max Students</label>
            <input
              type="number"
              name="max_students"
              value={formData.max_students}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Start Date</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">End Date</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Class Day</label>
            <select
              name="schedule_day"
              value={formData.schedule_day}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
              required
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Start Time</label>
            <input
              type="time"
              name="schedule_time"
              value={formData.schedule_time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-blue-700">Duration</label>
            <input
              type="text"
              name="schedule_duration"
              value={formData.schedule_duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="2 hours"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-blue-700">Telegram Group Link</label>
          <input
            type="url"
            name="telegram_group_link"
            value={formData.telegram_group_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="https://t.me/your-telegram-group"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Creating...
            </span>
          ) : "Create Class Term"}
        </button>
      </form>
    </div>
  );
}