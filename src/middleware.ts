import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token');

  const isPublicPath = path === '/login' || path === '/signup' || path ==='/' ;

  if ( !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if( path === '/' && token ){
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (path === '/' && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/login', 
    '/signup', 
    '/dashboard'
  ],
};
