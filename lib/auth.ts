import { cookies } from 'next/headers';

const COOKIE_NAME = 'fp_admin_session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shotproject2026';

export function checkPassword(pw: string): boolean {
  return pw === ADMIN_PASSWORD;
}

export function isAuthed(): boolean {
  const store = cookies();
  return store.get(COOKIE_NAME)?.value === 'ok';
}

export function setAuthCookie() {
  cookies().set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

export function clearAuthCookie() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}
