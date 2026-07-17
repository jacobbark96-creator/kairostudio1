import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, date, time } = await req.json()

    if (!name || !email || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const formattedDate = new Date(date).toLocaleDateString('en-GB', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    })

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    
    // 1. Send Email to Client
    let clientEmailStatus = null;
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Kairo Studio <hello@kairostudio.co.uk>',
          to: email,
          subject: 'Booking Confirmation: Kairo Studio Consultation',
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
              <h2>Booking Confirmed!</h2>
              <p>Hi ${name},</p>
              <p>Your 30-minute consultation with Kairo Studio is confirmed for:</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <strong>Date:</strong> ${formattedDate}<br>
                <strong>Time:</strong> ${time}<br>
              </div>
              <p>We will send you a Google Meet link shortly before the meeting.</p>
              <p>If you need to reschedule, please reply to this email.</p>
              <br>
              <p>Best regards,<br>The Kairo Studio Team</p>
            </div>
          `
        })
      })
      clientEmailStatus = await res.json()
    } catch (e) {
      clientEmailStatus = { error: String(e) }
    }

    // 2. Send Notification Email to Admin
    let adminEmailStatus = null;
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Kairo Studio System <hello@kairostudio.co.uk>',
          to: 'hello@kairostudio.co.uk',
          subject: `NEW BOOKING: ${name} at ${time}`,
          html: `
            <h3>New Consultation Booked</h3>
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
          `
        })
      })
      adminEmailStatus = await res.json()
    } catch (e) {
      adminEmailStatus = { error: String(e) }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        diagnostics: {
          clientEmail: clientEmailStatus,
          adminEmail: adminEmailStatus
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})