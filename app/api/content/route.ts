import { NextRequest, NextResponse } from 'next/server';
import { readContent, writeContent } from '@/lib/content';
import { isAuthed } from '@/lib/auth';

// Reads from Redis on every request — don't let Next try to prerender this.
export const dynamic = 'force-dynamic';

// GET is public — the landing & form pages need this to render content.
export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

// PUT is admin-only — saving content requires a valid session.
export async function PUT(req: NextRequest) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  await writeContent(body);
  return NextResponse.json({ ok: true });
}
