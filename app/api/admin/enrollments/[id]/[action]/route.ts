import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { clerkClient } from "@clerk/clerk-sdk-node";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const { id, action } = await params;

  // Fetch enrollment
  const enrollmentRows = await sql`
    SELECT * FROM enrollments WHERE id = ${id}
  `;
  const enrollment = enrollmentRows[0];
  if (!enrollment) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (action === 'approve') {
    // Update enrollment status
    await sql`
      UPDATE enrollments
      SET status = 'approved', approved_at = NOW()
      WHERE id = ${id}
    `;
    // Assign student role
    await sql`
      INSERT INTO user_roles (user_id, class_term_id, role, assigned_at)
      VALUES (${enrollment.user_id}, ${enrollment.class_term_id}, 'student', NOW())
      ON CONFLICT (user_id, class_term_id, role) DO NOTHING
    `;

    // Increment current_students in class_terms
    await sql`
      UPDATE class_terms
      SET current_students = current_students + 1
      WHERE id = ${enrollment.class_term_id}
    `;

    // Assign student role in Clerk
    try {
      await clerkClient.users.updateUser(enrollment.user_id, {
        publicMetadata: { role: "student" }
      });
    } catch (err) {
      // Optionally log or handle error, but don't block approval
      console.error("Failed to update Clerk user role:", err);
    }

    return NextResponse.json({ success: true });
  } else if (action === 'reject') {
    await sql`
      UPDATE enrollments
      SET status = 'rejected'
      WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}