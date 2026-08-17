import { NextResponse } from 'next/server';
import { getRoles } from '@/lib/db/queries';

export async function GET() {
  try {
    const roles = await getRoles();

    return NextResponse.json({ data: roles });
  } catch (error) {
    console.error('Failed to fetch roles:', error);

    return NextResponse.json(
      { error: 'Unable to load roles.' },
      { status: 503 },
    );
  }
}
