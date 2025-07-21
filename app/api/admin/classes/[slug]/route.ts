import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      const { userId } = await auth();
      const { slug } = await params;
  
      if (!userId /* || !isAdmin(userId) */) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const {
        title,
        description,
        category,
        telegram_group_link,
        start_date,
        end_date,
        schedule,
        max_students,
        status,
      } = await req.json();
  
      // Validate inputs
      if (!title || !start_date || !end_date) {
        return new NextResponse("Missing required fields", { status: 400 });
      }
  
      if (telegram_group_link && !telegram_group_link.includes("t.me/")) {
        return new NextResponse("Invalid Telegram group link", { status: 400 });
      }
  
      // Update in database
      await sql`
        UPDATE class_terms
        SET
          title = ${title},
          description = ${description},
          category = ${category}::class_category,
          telegram_group_link = ${telegram_group_link},
          start_date = ${new Date(start_date).toISOString()},
          end_date = ${new Date(end_date).toISOString()},
          schedule = ${schedule},
          max_students = ${max_students},
          status = ${status}::class_status,
          updated_at = NOW()
        WHERE slug = ${slug}
      `;
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("[CLASSES_PUT]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  