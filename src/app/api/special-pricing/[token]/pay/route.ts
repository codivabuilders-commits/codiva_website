import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const body = await req.json();
    const res = await fetch(`${API_BASE_URL}/api/special-pricing/${token}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process special pricing payment' }, { status: 500 });
  }
}
