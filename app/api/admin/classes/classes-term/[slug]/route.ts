import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const result = await sql`
      SELECT 
        id, title, slug, description, category, 
        telegram_group_link, start_date, end_date,
        schedule, status, current_students, max_students
      FROM class_terms
      WHERE slug = ${slug}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Class term not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ classTerm: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}