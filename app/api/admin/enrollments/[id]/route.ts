import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`
      SELECT e.*, ct.title as class_term_title
      FROM enrollments e
      JOIN class_terms ct ON e.class_term_id = ct.id
      WHERE e.id = ${id}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ enrollment: result[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}