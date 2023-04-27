import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export default withClerkMiddleware((req: NextRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [ `/(.*?trpc.*?|(?!|.*\\..*|static|favicon.ico).*)`, `/dashboard/:path*` ],
};
