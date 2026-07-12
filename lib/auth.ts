import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface JwtPayload {
  userId: number
  username: string
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is not set. " +
      "Generate one with: openssl rand -base64 32"
    )
  }
  return secret
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getSecret()) as JwtPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JwtPayload | null> {
  try {
    const store = await cookies()
    const token = store.get("session")?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
