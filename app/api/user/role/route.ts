import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req); // Clerk user ID
  const classTermId = req.nextUrl.searchParams.get('classTermId');
  if (!userId || !classTermId) return NextResponse.json({ role: null });

  const rows = await sql`
    SELECT role FROM user_roles WHERE user_id = ${userId} AND class_term_id = ${classTermId} LIMIT 1
  `;
  return NextResponse.json({ role: rows[0]?.role || null });
}