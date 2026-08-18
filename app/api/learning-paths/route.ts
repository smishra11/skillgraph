import { NextResponse } from 'next/server';

import { getLearningPaths } from '@/lib/db/queries';

export async function POST(request: Request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  try {
    const { roleSlug, selectedSkillSlugs } = body;

    if (typeof roleSlug !== 'string' || roleSlug.trim().length === 0) {
      return NextResponse.json(
        { error: 'Target role is required.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(selectedSkillSlugs)) {
      return NextResponse.json(
        { error: 'Selected skills must be an array.' },
        { status: 400 },
      );
    }

    if (selectedSkillSlugs.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const learningPaths = await getLearningPaths(roleSlug, selectedSkillSlugs);

    return NextResponse.json({ data: learningPaths });
  } catch (error) {
    console.error('Failed to load learning paths:', error);

    return NextResponse.json(
      {
        error:
          'SkillGraph could not load the learning graph because the database is temporarily unavailable.',
      },
      { status: 503 },
    );
  }
}
