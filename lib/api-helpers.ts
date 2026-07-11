import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ─── Error response factories ───────────────────────────────────────────

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 })
}

// ─── Async error wrapper ────────────────────────────────────────────────
//
// Wraps any route handler so it never needs its own try/catch.
// Catches all errors, logs them, and returns a consistent 500 response.
//
// Usage:
//   export const GET = apiHandler(async () => { ... })
//   export const PATCH = apiHandler(async (req, { params }) => { ... })
//
type RouteHandler = (...args: any[]) => Promise<NextResponse>

export function apiHandler(handler: RouteHandler): RouteHandler {
  return async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error("API Error:", error instanceof Error ? error.message : error)
      if (error instanceof Error && error.stack) {
        console.error(error.stack)
      }
      return serverError()
    }
  }
}
