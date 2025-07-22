import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path starts with /dashboard or other protected routes
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/legal-translator');
  
  // Public files and auth-related paths should not be protected
  const isPublicFile = pathname.includes('.');
  const isAuthPath = 
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api/auth');
  
  // Don't protect non-protected routes
  if (!isProtectedRoute || isPublicFile || isAuthPath) {
    return NextResponse.next();
  }
  
  // Get the token from the session
  const token = await getToken({ req: request });
  
  // If there is no token, redirect to the sign-in page
  if (!token) {
    const url = new URL('/auth/signin', request.url);
    // Add the callback URL to redirect back after login
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Skip API routes except for protected API routes if any
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
