import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ─── Field allowlist (input sanitization) ──────────────────────────────
//
// Usage:
//   const data = pick(reqBody, CONTACT_FIELDS)
//   // data now only contains keys from the allowlist
//   await db.contact.update({ where: { id }, data })

/**
 * Returns a new object containing only the specified keys from `obj`.
 * Keys not present in `obj` are omitted (no undefined values).
 */
export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: readonly string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of keys) {
    if (key in obj && obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }
  return result
}

// ─── Model field allowlists ─────────────────────────────────────────────
// Keep these in sync with prisma/schema.prisma.
// Only fields that users are allowed to set via the API.

export const CONTACT_FIELDS = ["name", "email", "phone", "company", "status"] as const

export const DEAL_FIELDS = ["title", "value", "stage", "contactId"] as const
