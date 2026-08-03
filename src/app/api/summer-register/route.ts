import { NextResponse } from 'next/server';

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

    // Connect to Supabase REST API if credentials exist
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/summer_registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            parent_name: parentName,
            child_name: childName,
            child_age: parseInt(childAge, 10),
            assigned_track: assignedTrack,
            parent_phone: parentPhone,
            parent_email: parentEmail,
            preferred_campus: preferredCampus,
            agree_updates: agreeUpdates,
            created_at: new Date().toISOString(),
          }),
        });

        if (!dbRes.ok) {
          const errText = await dbRes.text();
          console.error('Supabase REST error saving summer registration:', errText);
        }
      } catch (dbErr) {
        console.error('Failed to communicate with Supabase:', dbErr);
      }
    } else {
      console.log('Received Summer Registration (Supabase credentials not set):', {
        parentName,
        childName,
        childAge,
        assignedTrack,
        parentPhone,
        parentEmail,
        preferredCampus,
        agreeUpdates,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        message: 'Summer registration received successfully',
        data: {
          parentName,
          childName,
          assignedTrack,
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
