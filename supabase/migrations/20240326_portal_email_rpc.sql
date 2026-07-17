-- Create a callable RPC function to send the portal email
create or replace function send_portal_email(target_email text, target_name text)
returns json
language plpgsql
security definer
as $$
declare
  resend_api_key text := current_setting('app.settings.resend_api_key', true);
  portal_link text := 'https://billing.stripe.com/p/login/00w5kEa8a9oVdJogU65kk00';
  email_payload jsonb;
  display_name text;
begin
  display_name := coalesce(target_name, 'there');

  email_payload := jsonb_build_object(
    'from', 'Kairo Studio <hello@kairostudio.co.uk>',
    'to', target_email,
    'subject', 'Manage your Kairo Studio Billing',
    'html', format('
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Manage your billing</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header Banner -->
          <div style="background-color: #0f172a; padding: 40px 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">Kairo Studio</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px;">
            <h2 style="color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 16px;">Billing Portal Access</h2>
            <p style="font-size: 16px; color: #4b5563; margin-top: 0;">Hi %s,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
              You can securely manage your Kairo Studio invoices, update your payment methods, and view your billing history using our customer portal.
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="%s" style="background-color: #0891b2; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 16px; display: inline-block;">
                Access Billing Portal
              </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              If the button above doesn''t work, copy and paste this link into your browser:<br>
              <a href="%s" style="color: #0891b2; word-break: break-all;">%s</a>
            </p>
            <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
              Best regards,<br>
              <strong>The Kairo Studio Team</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    ', display_name, portal_link, portal_link, portal_link)
  );

  -- Fire the HTTP POST request to Resend API asynchronously
  perform net.http_post(
      url:='https://api.resend.com/emails',
      headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || resend_api_key
      ),
      body:=email_payload
  );

  return json_build_object('success', true);
end;
$$;