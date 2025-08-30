import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isApiWriteRoute = createRouteMatcher(['/api/(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();

  if (isAdminRoute(req)) {
    if (sessionClaims?.metadata.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (isApiWriteRoute(req) && req.method !== 'GET') {
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};