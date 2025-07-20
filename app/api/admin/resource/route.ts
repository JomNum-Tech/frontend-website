import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, googleSlidesUrl, classCategory } = await req.json();
    
    // Validate inputs
    if (!googleSlidesUrl.includes("docs.google.com/presentation")) {
      return new NextResponse("Invalid Google Slides URL", { status: 400 });
    }

    if (!['web_design', 'java', 'ui_ux', 'python'].includes(classCategory)) {
      return new NextResponse("Invalid class category", { status: 400 });
    }

    // Insert into database
    await sql`
      INSERT INTO resources (user_id, title, google_slides_url, class_category)
      VALUES (${userId}, ${title}, ${googleSlidesUrl}, ${classCategory}::class_category)
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESOURCES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
    try {
      const { userId } = await auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const resources = await sql`
        SELECT id, title, google_slides_url, class_category, created_at
        FROM resources
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
  
      return NextResponse.json(resources);
    } catch (error) {
      console.error("[RESOURCES_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }