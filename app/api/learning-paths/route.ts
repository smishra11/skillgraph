import { NextResponse } from 'next/server';

import { getLearningPaths } from '@/lib/db/queries';

type LearningPathsRequestBody = {
  roleSlug?: string;
  selectedSkillSlugs?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LearningPathsRequestBody;

    const { roleSlug, selectedSkillSlugs } = body;

    if (!roleSlug) {
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

    const paths = await getLearningPaths(roleSlug, selectedSkillSlugs);

    return NextResponse.json({ data: paths });
  } catch (error) {
    console.error('Failed to fetch learning paths:', error);

    return NextResponse.json(
      { error: 'Unable to load learning paths.' },
      { status: 503 },
    );
  }
}
