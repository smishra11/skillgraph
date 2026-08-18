import { NextResponse } from 'next/server';

import { getSkills } from '@/lib/db/queries';

export async function GET() {
  try {
    const skills = await getSkills();

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error('Failed to load skills:', error);

    return NextResponse.json(
      { error: 'SkillGraph is temporarily unable to connect to the database.' },
      { status: 503 },
    );
  }
}
