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
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
        <h2>Booking Confirmed!</h2>
        <p>Hi %s,</p>
        <p>Your 30-minute consultation with Kairo Studio is confirmed for:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <strong>Date:</strong> %s<br>
          <strong>Time:</strong> %s<br>
        </div>
        <p>We will send you a Google Meet link shortly before the meeting.</p>
        <p>If you need to reschedule, please reply to this email.</p>
        <br>
        <p>Best regards,<br>The Kairo Studio Team</p>
      </div>
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