import { NextResponse } from "next/server";
import { sql } from "@/lib/database";
import { parseTimestamp } from "@/lib/utils/dateUtils";
import { formatDistanceToNow } from "date-fns";

export async function GET() {
  try {
    // Get a recent comment to test timestamp formatting
    const result = await sql`
      SELECT id, created_at, updated_at, content
      FROM blog_comments 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json({ message: "No comments found" });
    }

    const comment = result[0];
    const now = new Date();

    // Test different parsing methods
    const testTimestamp = comment.created_at;
    const directParse = new Date(testTimestamp);
    const withZ = new Date(testTimestamp + "Z");
    const parseTimestampResult = parseTimestamp(testTimestamp);

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content.substring(0, 50) + "...",
        created_at: comment.created_at,
        updated_at: comment.updated_at,
      },
      server_time: {
        iso: now.toISOString(),
        utc: now.toUTCString(),
        local: now.toString(),
        timestamp: now.getTime(),
      },
      parsing_tests: {
        original_timestamp: testTimestamp,
        direct_parse: {
          iso: directParse.toISOString(),
          timestamp: directParse.getTime(),
          formatted: formatDistanceToNow(directParse, { addSuffix: true }),
        },
        with_z_parse: {
          iso: withZ.toISOString(),
          timestamp: withZ.getTime(),
          formatted: formatDistanceToNow(withZ, { addSuffix: true }),
        },
        parse_timestamp_function: {
          iso: parseTimestampResult.toISOString(),
          timestamp: parseTimestampResult.getTime(),
          formatted: formatDistanceToNow(parseTimestampResult, { addSuffix: true }),
        },
        age_comparison: {
          direct_age_minutes: Math.floor(
            (now.getTime() - directParse.getTime()) / (1000 * 60)
          ),
          with_z_age_minutes: Math.floor(
            (now.getTime() - withZ.getTime()) / (1000 * 60)
          ),
          parse_function_age_minutes: Math.floor(
            (now.getTime() - parseTimestampResult.getTime()) / (1000 * 60)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Debug timestamp error:", error);
    return NextResponse.json(
      { error: "Failed to debug timestamps" },
      { status: 500 }
    );
  }
}
