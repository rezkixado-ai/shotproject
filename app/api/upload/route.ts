import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAuthed } from '@/lib/auth';

// Requires a Vercel Blob store connected to the project, which sets
// BLOB_READ_WRITE_TOKEN automatically. Locally, run
// `vercel env pull .env.development.local` after linking the project.

export async function POST(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const filename = `shotproject/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(filename, file, {
    access: 'public',
    contentType: file.type || undefined,
  });

  return NextResponse.json({ url: blob.url });
}
