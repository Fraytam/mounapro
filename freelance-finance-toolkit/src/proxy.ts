import { NextResponse, type NextRequest } from "next/server"
import { findSession, findUserById } from "@/lib/db"

export async function proxy(request: NextRequest) {
  const sessionId = request.cookies.get("session_id")?.value
  let user = null

  if (sessionId) {
    const session = await findSession(sessionId)
    if (session) user = await findUserById(session.userId)
  }

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/forgot-password")

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")
  const isAdmin = request.nextUrl.pathname.startsWith("/admin")

  if (!user && (isDashboard || isAdmin)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user && isAdmin && user.role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
