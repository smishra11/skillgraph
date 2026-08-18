import { NextResponse } from 'next/server';

import { analyzeSkillGap } from '@/lib/db/queries';

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

    const analysis = await analyzeSkillGap(roleSlug, selectedSkillSlugs);

    if (!analysis) {
      return NextResponse.json(
        { error: 'Target role was not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error('Skill gap analysis failed:', error);

    return NextResponse.json(
      {
        error:
          'SkillGraph could not complete the analysis because the database is temporarily unavailable.',
      },
      { status: 503 },
    );
  }
}
