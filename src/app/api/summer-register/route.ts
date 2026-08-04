import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parentName,
      childName,
      childAge,
      assignedTrack,
      parentPhone,
      parentEmail,
      preferredCampus,
      agreeUpdates,
    } = body;

    // Basic server-side validation
    if (!parentName || !childName || !childAge || !parentPhone || !parentEmail) {
      return NextResponse.json(
        { error: 'Missing required registration fields' },
        { status: 400 }
      );
    }

    // Forward to Express backend which handles the DB write via pg pool
    const backendRes = await fetch(`${API_BASE_URL}/api/summer-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parentName,
        childName,
        childAge,
        assignedTrack,
        parentPhone,
        parentEmail,
        preferredCampus,
        agreeUpdates,
      }),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      console.error('[summer-register] Backend error:', errText);
      return NextResponse.json(
        { error: 'Failed to save registration. Please try again.' },
        { status: 500 }
      );
    }

    const data = await backendRes.json();

    return NextResponse.json(
      {
        message: 'Summer registration received successfully',
        data: {
          parentName: data.data?.parent_name ?? parentName,
          childName: data.data?.child_name ?? childName,
          assignedTrack: data.data?.assigned_track ?? assignedTrack,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('API /api/summer-register error:', err);
    return NextResponse.json(
      { error: 'Internal server error processing registration' },
      { status: 500 }
    );
  }
}
