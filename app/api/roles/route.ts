import { NextResponse } from 'next/server';

import { getRoles } from '@/lib/db/queries';

export async function GET() {
  try {
    const roles = await getRoles();

    return NextResponse.json({ data: roles });
  } catch (error) {
    console.error('Failed to load roles:', error);

    return NextResponse.json(
      { error: 'SkillGraph is temporarily unable to connect to the database.' },
      { status: 503 },
    );
  }
}
