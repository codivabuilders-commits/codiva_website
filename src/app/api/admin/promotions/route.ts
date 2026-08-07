import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/promotions`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to connect to backend server' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE_URL}/api/admin/promotions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to connect to backend server' }, { status: 500 });
  }
}
