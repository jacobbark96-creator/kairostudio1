-- Enable the pg_net extension to allow Postgres to make external HTTP requests
create extension if not exists pg_net;

-- Create a function that constructs the email payload and sends it to Resend
create or replace function send_booking_confirmation_email()
returns trigger
language plpgsql
security definer
as $$
declare
  resend_api_key text := 're_TeVXqARF_De9xssbiT9Ywhq7PcFvQbQUs';
  formatted_date text;
  client_payload jsonb;
  admin_payload jsonb;
begin
  -- Format the date slightly (Postgres TO_CHAR)
  formatted_date := to_char(NEW.booking_date, 'FMDay, FMDD FMMonth YYYY');

  -- 1. Construct the payload for the Client Email
  client_payload := jsonb_build_object(
    'from', 'Kairo Studio <hello@kairostudio.co.uk>',
    'to', NEW.client_email,
    'subject', 'Booking Confirmation: Kairo Studio Consultation',
    'html', format('
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmed - Kairo Studio</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(to right, #22d3ee, #0891b2, #2563eb); padding: 40px 32px; text-align: center;">
            <div style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="color: white; font-size: 32px;">✓</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Booking Confirmed!</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px;">
            <p style="font-size: 16px; color: #374151; margin-top: 0;">Hi %s,</p>
            <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Your 30-minute consultation with Kairo Studio has been successfully scheduled. We are looking forward to speaking with you!</p>
            
            <!-- Details Card -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 32px 0;">
              <div style="margin-bottom: 16px;">
                <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Date</p>
                <p style="margin: 4px 0 0 0; font-size: 18px; color: #0f172a; font-weight: 500;">%s</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600;">Time</p>
                <p style="margin: 4px 0 0 0; font-size: 18px; color: #0891b2; font-weight: 600;">%s</p>
              </div>
            </div>

            <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
              <strong>Next Steps:</strong> We will send you a calendar invitation containing the Google Meet video link shortly before the meeting.
            </p>

            <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              If you need to reschedule or cancel, please reply directly to this email.<br><br>
              Best regards,<br>
              <strong>The Kairo Studio Team</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    ', NEW.client_name, formatted_date, NEW.time_slot)
  );

  -- 2. Construct the payload for the Admin Notification
  admin_payload := jsonb_build_object(
    'from', 'Kairo Studio System <hello@kairostudio.co.uk>',
    'to', 'hello@kairostudio.co.uk',
    'subject', format('NEW BOOKING: %s at %s', NEW.client_name, NEW.time_slot),
    'html', format('
      <h3>New Consultation Booked</h3>
      <p><strong>Client:</strong> %s</p>
      <p><strong>Email:</strong> %s</p>
      <p><strong>Company:</strong> %s</p>
      <p><strong>URL:</strong> %s</p>
      <p><strong>Date:</strong> %s</p>
      <p><strong>Time:</strong> %s</p>
    ', NEW.client_name, NEW.client_email, COALESCE(NEW.company_name, 'Not provided'), COALESCE(NEW.company_url, 'Not provided'), formatted_date, NEW.time_slot)
  );

  -- 3. Fire the HTTP POST requests to Resend API asynchronously
  perform net.http_post(
      url:='https://api.resend.com/emails',
      headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || resend_api_key
      ),
      body:=client_payload
  );

  perform net.http_post(
      url:='https://api.resend.com/emails',
      headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || resend_api_key
      ),
      body:=admin_payload
  );

  return NEW;
end;
$$;

-- Create the trigger that fires the function AFTER a new booking is inserted
drop trigger if exists on_booking_created on bookings;
create trigger on_booking_created
  after insert on bookings
  for each row
  execute function send_booking_confirmation_email();