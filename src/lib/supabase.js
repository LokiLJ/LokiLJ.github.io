import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const cmsConfigured = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = cmsConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const mediaPublicUrl = (path) => {
  if (!supabase || !path) return ''
  const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path)
  return data?.publicUrl || ''
}
