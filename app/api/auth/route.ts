import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (checkPassword(password)) {
    setAuthCookie();
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}

export async function DELETE() {
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
