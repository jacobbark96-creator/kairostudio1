import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Note: In production, we'd use a service like Resend directly from here, 
// or call our Next.js API route. For simplicity in this Edge Function, we'll
// call our Next.js API route that handles the actual email/SMS sending.

serve(async (req) => {
  // This function should be triggered by pg_cron every hour
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Calculate time windows for 24h and 2h
    const now = new Date()
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)

    // We need to match bookings for tomorrow (24h) and today (2h)
    // For a real production app, we would add a 'reminder_24h_sent' boolean to the table
    // to ensure we don't send it multiple times if the cron runs more often.
    
    // Fetch upcoming bookings that are 'confirmed'
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')

    if (error) throw error

    // In a real scenario, you'd filter these by exact time and send the payload
    // to your custom /api/booking-confirmation (or a new /api/booking-reminder) route.
    
    return new Response(
      JSON.stringify({ message: `Checked ${bookings?.length || 0} bookings for reminders` }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(String(err), { status: 500 })
  }
})
