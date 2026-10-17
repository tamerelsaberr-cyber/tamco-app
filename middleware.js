
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // تفعيل الـ CORS لتجاوز حظر متصفح باي (Pi Browser)
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

// تطبيق التوجيه على كل مسارات التطبيق بشكل صحيح
export const config = {
  matcher: '/:path*',
};