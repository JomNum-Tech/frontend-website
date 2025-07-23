import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Destructure and validate required fields
    const {
      user_id,
      class_term_id,
      name,
      gender,
      phone,
      email,
      facebook_link,
      date_of_birth,
      id_card_url,
      education_level,
      school_name,
      province,
      occupation,
      referral_source,
      career_interests,
      comments,
      payment_proof_url,
    } = data;

    // Basic validation (expand as needed)
    if (!user_id || !class_term_id || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into enrollments table using neon
    const result = await sql`
      INSERT INTO enrollments (
        user_id, class_term_id, name, gender, phone, email, facebook_link, date_of_birth,
        id_card_url, education_level, school_name, province, occupation, referral_source,
        career_interests, comments, payment_proof_url, status, created_at
      ) VALUES (
        ${user_id}, ${class_term_id}, ${name}, ${gender}, ${phone}, ${email}, ${facebook_link}, ${date_of_birth},
        ${id_card_url}, ${education_level}, ${school_name}, ${province}, ${occupation}, ${referral_source},
        ${career_interests}, ${comments}, ${payment_proof_url}, 'pending', NOW()
      )
      RETURNING *
    `;

    return NextResponse.json(
      { success: true, enrollment: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const classTermId = searchParams.get('class_term_id');
    const status = searchParams.get('status');

    if (userId && classTermId) {
      // Return the enrollment for this user and class term
      const result = await sql`
        SELECT * FROM enrollments WHERE user_id = ${userId} AND class_term_id = ${classTermId} LIMIT 1
      `;
      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
      }
      return NextResponse.json({ enrollment: result[0] });
    }

    let result;
    if (status) {
      // Filter by status if provided
      result = await sql`
        SELECT * FROM enrollments WHERE status = ${status} ORDER BY created_at DESC
      `;
    } else {
      // Default: return all enrollments
      result = await sql`
        SELECT * FROM enrollments ORDER BY created_at DESC
      `;
    }
    return NextResponse.json({ enrollments: result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}