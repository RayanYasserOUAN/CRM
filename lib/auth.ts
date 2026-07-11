import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET

if (!SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is not set. " +
    "Generate one with: openssl rand -base64 32"
  )
}

export interface JwtPayload {
  userId: number
  username: string
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  const store = await cookies()
  const token = store.get("session")?.value
  if (!token) return null
  return verifyToken(token)
}
