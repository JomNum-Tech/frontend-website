import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { RoleService } from '@/lib/roleService'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth.protect()
    
    // Check if this is an admin route and verify admin access
    if (isAdminRoute(req)) {
      const hasAdminAccess = await RoleService.checkAdminAccess(userId)
      
      if (!hasAdminAccess) {
        // Redirect unauthorized users to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
