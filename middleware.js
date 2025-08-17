import { NextResponse } from 'next/server';

export function middleware(request) {
  if (
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/login')
  ) {
    const { email } = request.body || {};
    if (email && !/^[^\s@]+@atera\.com$/i.test(email)) {
      return NextResponse.json(
        { error: 'Only @atera.com email addresses are allowed.' },
        { status: 403 }
      );
    }
  }
  return NextResponse.next();
}