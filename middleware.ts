import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(`Request path: ${pathname}`);
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  if (!token && pathname !== '/') {
    console.log('No token found, redirecting to home');
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'], 
};
