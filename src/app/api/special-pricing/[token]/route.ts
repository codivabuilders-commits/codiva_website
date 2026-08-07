import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const res = await fetch(`${API_BASE_URL}/api/special-pricing/${token}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch special pricing details' }, { status: 500 });
  }
}
