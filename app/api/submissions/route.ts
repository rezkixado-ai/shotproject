import { NextRequest, NextResponse } from 'next/server';
import { readSubmissions, addSubmission, Submission } from '@/lib/content';
import { isAuthed } from '@/lib/auth';

// GET is admin-only — this is the leads list shown in the admin panel.
export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const submissions = await readSubmissions();
  return NextResponse.json(submissions);
}

// POST is public — this is the join-form submit endpoint.
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.nama || !body.domisili || !body.usia || !body.jenisKelamin || !body.status) {
    return NextResponse.json({ error: 'Data belum lengkap.' }, { status: 400 });
  }

  const sub: Submission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    nama: String(body.nama).slice(0, 100),
    domisili: String(body.domisili).slice(0, 100),
    usia: String(body.usia).slice(0, 10),
    jenisKelamin: String(body.jenisKelamin).slice(0, 30),
    status: String(body.status).slice(0, 30),
    alasan: String(body.alasan || '').slice(0, 500),
  };

  await addSubmission(sub);
  return NextResponse.json({ ok: true });
}
