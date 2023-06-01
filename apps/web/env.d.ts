namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string
    VERCEL_URL: string
    NEXT_PUBLIC_GRAPHQL_URL: string
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE: string
    GQLURL: string
  }
}
