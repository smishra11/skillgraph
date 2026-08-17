import { NextResponse } from 'next/server';

import { analyzeSkillGap } from '@/lib/db/queries';

type AnalyzeRequestBody = {
  roleSlug?: string;
  selectedSkillSlugs?: string[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequestBody;

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

    const analysis = await analyzeSkillGap(roleSlug, selectedSkillSlugs);

    if (!analysis) {
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error('Failed to analyze skill gap:', error);

    return NextResponse.json(
      { error: 'Unable to analyze skill gap.' },
      { status: 503 },
    );
  }
}
