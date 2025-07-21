import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Verify admin role - you'll need to implement this based on your auth setup
    if (!userId /* || !isAdmin(userId) */) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      title,
      slug,
      description,
      category,
      telegram_group_link,
      start_date,
      end_date,
      schedule,
      max_students,
    } = await req.json();

    // Validate inputs
    if (!title || !slug || !start_date || !end_date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Insert into database
    await sql`
      INSERT INTO class_terms (
        title, slug, description, category, 
        telegram_group_link, start_date, end_date, 
        schedule, max_students
      )
      VALUES (
        ${title}, ${slug}, ${description}, ${category}::class_category,
        ${telegram_group_link}, ${new Date(start_date).toISOString()}, 
        ${new Date(end_date).toISOString()}, ${schedule}, ${max_students}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLASSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    // Verify admin role
    if (!userId /* || !isAdmin(userId) */) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const classes = await sql`
      SELECT 
        id, title, slug, category, 
        start_date, end_date, status,
        current_students, max_students
      FROM class_terms
      ORDER BY start_date DESC
    `;

    return NextResponse.json(classes);
  } catch (error) {
    console.error("[CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

