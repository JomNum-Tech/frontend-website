import { ClassDetails, ClassTerm } from "@/components/admin/class/ClassDetails";
import { neon } from "@neondatabase/serverless";
import { notFound } from "next/navigation";

const sql = neon(process.env.NEON_DATABASE_URL!);

export default async function ClassPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const classTerm = await sql`
    SELECT 
      id, title, slug, description, category, 
      telegram_group_link, start_date, end_date,
      schedule, status, current_students, max_students
    FROM class_terms
    WHERE slug = ${slug}
  `;

  if (!classTerm || classTerm.length === 0) {
    notFound();
  }

  // Parse schedule if it is a string
  const classTermObj = {
    ...classTerm[0],
    schedule: typeof classTerm[0].schedule === 'string' ? JSON.parse(classTerm[0].schedule) : classTerm[0].schedule,
    start_date: classTerm[0].start_date?.toString(),
    end_date: classTerm[0].end_date?.toString(),
  } as ClassTerm;

  return (
    <div className="container mx-auto py-8 px-12">
      <ClassDetails classTerm={classTermObj}  />
    </div>
  );
}