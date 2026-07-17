import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    const portalLink = 'https://billing.stripe.com/p/login/00w5kEa8a9oVdJogU65kk00'
    const displayName = name || 'there'
    
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kairo Studio <hello@kairostudio.co.uk>',
        to: email,
        subject: 'Manage your Kairo Studio Billing',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Manage your billing</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
            <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              
              <!-- Header Banner -->
              <div style="background-color: #0f172a; padding: 40px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">Kairo Studio</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 32px;">
                <h2 style="color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Billing Portal Access</h2>
                <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Hi ${displayName},</p>
                <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
                  You can securely manage your Kairo Studio invoices, update your payment methods, and view your billing history using our customer portal.
                </p>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${portalLink}" style="background-color: #0891b2; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px; display: inline-block;">
                    Access Billing Portal
                  </a>
                </div>

                <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                  If the button above doesn't work, copy and paste this link into your browser:<br>
                  <a href="${portalLink}" style="color: #0891b2; word-break: break-all;">${portalLink}</a>
                </p>
                <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                  Best regards,<br>
                  <strong>The Kairo Studio Team</strong>
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })
    
    const result = await res.json()

    if (!res.ok) {
      throw new Error(JSON.stringify(result))
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})