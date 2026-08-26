import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rniqmxpmtqmnwqtawlnz.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'

  if (!url || !key) {
    throw new Error('Supabase environment variables not configured')
  }

  const cookieStore = await cookies()

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
