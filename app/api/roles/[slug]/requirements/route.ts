import { NextResponse } from 'next/server';

import { getRoleRequirements } from '@/lib/db/queries';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const requirements = await getRoleRequirements(slug);

    if (requirements.length === 0) {
      return NextResponse.json({ error: 'Role not found.' }, { status: 404 });
    }

    return NextResponse.json({ data: requirements });
  } catch (error) {
    console.error('Failed to fetch role requirements:', error);

    return NextResponse.json(
      { error: 'Unable to load role requirements.' },
      { status: 503 },
    );
  }
}
