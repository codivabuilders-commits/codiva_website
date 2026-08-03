import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch from Express backend if active
    try {
      const expressRes = await fetch('http://localhost:5000/api/admin/users', { cache: 'no-store' });
      if (expressRes.ok) {
        const data = await expressRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.log('Express backend endpoint unreachable, falling back to Supabase REST / direct DB fetch');
    }

    // Fallback: Supabase REST API check if env vars present
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const summerRes = await fetch(`${supabaseUrl}/rest/v1/summer_registrations?select=*&order=created_at.desc`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
          cache: 'no-store'
        });
        const generalRes = await fetch(`${supabaseUrl}/rest/v1/enrollments?select=*&order=created_at.desc`, {
          headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` },
          cache: 'no-store'
        });

        const summerData = summerRes.ok ? await summerRes.json() : [];
        const generalData = generalRes.ok ? await generalRes.json() : [];

        const summerUsers = summerData.map((r: any) => ({
          id: `summer-${r.id}`,
          rawId: r.id,
          type: 'Summer Academy 2026',
          parentName: r.parent_name,
          childName: r.child_name,
          childAge: r.child_age,
          program: r.assigned_track,
          phone: r.parent_phone,
          email: r.parent_email,
          campus: r.preferred_campus,
          agreeUpdates: r.agree_updates,
          createdAt: r.created_at
        }));

        const generalUsers = generalData.map((r: any) => ({
          id: `general-${r.id}`,
          rawId: r.id,
          type: 'General Program',
          parentName: r.parent_name,
          childName: r.child_name,
          childAge: r.child_age,
          program: r.course,
          phone: r.parent_phone,
          email: r.parent_email,
          campus: r.learning_mode,
          agreeUpdates: true,
          createdAt: r.created_at
        }));

        const allUsers = [...summerUsers, ...generalUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
          stats: {
            total: allUsers.length,
            summerCount: summerUsers.length,
            generalCount: generalUsers.length,
          },
          users: allUsers,
          summerRegistrations: summerUsers,
          generalEnrollments: generalUsers
        });
      } catch (err) {
        console.error('Supabase REST admin fetch error:', err);
      }
    }

    // Default sample fallback format if DB not reachable
    return NextResponse.json({
      stats: { total: 0, summerCount: 0, generalCount: 0 },
      users: [],
      summerRegistrations: [],
      generalEnrollments: []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
