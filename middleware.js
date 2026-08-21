import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  if (url.pathname !== '/' && !url.pathname.includes('.')) {
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export const config = {
  matcher: '/:path*',
};