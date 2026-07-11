import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs", "jsonwebtoken"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/bcryptjs/**/*", "./node_modules/jsonwebtoken/**/*"],
  },
}

export default nextConfig
