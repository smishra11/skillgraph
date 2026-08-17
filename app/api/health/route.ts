import { NextResponse } from 'next/server';

import driver from '@/lib/db/driver';

export async function GET() {
  try {
    const result = await driver.executeQuery(
      `
        RETURN $message AS message
      `,
      {
        message: 'SkillGraph connected to CognoDB',
      },
    );

    const message = result.records[0].get('message');

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      message,
    });
  } catch (error) {
    console.error('CognoDB query failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        database: 'unavailable',
      },
      {
        status: 503,
      },
    );
  }
}
