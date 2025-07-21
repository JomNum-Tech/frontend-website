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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Class Term</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="web-design-fall-2023"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
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
            <label className="block text-sm font-medium mb-1">Max Students</label>
            <input
              type="number"
              name="max_students"
              value={formData.max_students}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class Day</label>
            <select
              name="schedule_day"
              value={formData.schedule_day}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="schedule_time"
              value={formData.schedule_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              name="schedule_duration"
              value={formData.schedule_duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="2 hours"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telegram Group Link</label>
          <input
            type="url"
            name="telegram_group_link"
            value={formData.telegram_group_link}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://t.me/your-telegram-group"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Creating..." : "Create Class Term"}
        </button>
      </form>
    </div>
  );
}