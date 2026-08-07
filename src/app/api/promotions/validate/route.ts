import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expressRes = await fetch(`${API_BASE_URL}/api/promotions/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await expressRes.json();
    return NextResponse.json(data, { status: expressRes.status });
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: 'Server connection error' }, { status: 500 });
  }
}
