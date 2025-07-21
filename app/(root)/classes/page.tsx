import { neon } from "@neondatabase/serverless";
import ClassCard from "@/components/admin/class/ClassCard";

const sql = neon(process.env.NEON_DATABASE_URL!);

export default async function ClassesPage() {
    const currentDate = new Date().toISOString();

    const classes = await sql`
    SELECT  
      id, slug, title, description, category, 
      telegram_group_link, start_date, end_date,
      schedule, status, current_students, max_students
    FROM class_terms
    WHERE status IN ('upcoming', 'ongoing')
    ORDER BY 
      CASE WHEN status = 'ongoing' THEN 0 ELSE 1 END,
      start_date ASC
  `;

    const hasClasses = Array.isArray(classes) && classes.length > 0;

    return (
        <main>
            <div className="container mx-auto px-12 py-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl sm:tracking-tight lg:text-7xl drop-shadow-lg">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            Available Classes
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-2xl text-gray-600">
                        Browse all our current and upcoming courses
                    </p>
                </div>

                {hasClasses ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {classes.map((classItem: any) => (
                            <div
                                key={classItem.id}
                                className="transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <ClassCard classItem={classItem} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24">
                        <svg
                            className="w-20 h-20 text-blue-200 mb-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 48 48"
                        >
                            <circle cx="24" cy="24" r="22" strokeWidth="3" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M16 24h16M24 16v16"
                            />
                        </svg>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            No classes available at the moment
                        </h3>
                        <p className="text-lg text-gray-500">
                            Check back later for new course offerings
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}