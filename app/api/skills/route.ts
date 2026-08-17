import { NextResponse } from 'next/server';

import { getSkills } from '@/lib/db/queries';

export async function GET() {
  try {
    const skills = await getSkills();

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error('Failed to fetch skills:', error);

    return NextResponse.json(
      { error: 'Unable to load skills.' },
      { status: 503 },
    );
  }
}
