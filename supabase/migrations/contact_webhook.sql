-- Enable the pg_net extension
create extension if not exists pg_net;

-- Add metadata column to contact_submissions if it doesn't exist
alter table contact_submissions add column if not exists metadata jsonb;

-- Create function to send contact notification email
create or replace function send_contact_notification_email()
returns trigger
language plpgsql
security definer
as $$
declare
  resend_api_key text := 're_TeVXqARF_De9xssbiT9Ywhq7PcFvQbQUs';
  admin_payload jsonb;
  metadata_html text := '';
  metadata_key text;
  metadata_value text;
begin
  -- Format metadata if it exists
  if NEW.metadata is not null then
    metadata_html := '<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">';
    metadata_html := metadata_html || '<h3 style="font-size: 14px; color: #374151; margin-top: 0;">Calculator Results:</h3>';
    
    for metadata_key, metadata_value in select * from jsonb_each_text(NEW.metadata)
    loop
      metadata_html := metadata_html || format('<p style="margin: 3px 0; font-size: 13px;"><strong>%s:</strong> %s</p>', 
        initcap(replace(metadata_key, '_', ' ')), 
        metadata_value
      );
    end loop;
    
    metadata_html := metadata_html || '</div>';
  end if;

  -- Construct the payload for the Admin Notification
  admin_payload := jsonb_build_object(
    'from', 'Kairo Studio System <hello@kairostudio.co.uk>',
    'to', 'jake.bedwell@kairostudio.co.uk',
    'subject', format('NEW ENQUIRY: %s', NEW.name),
    'html', format('
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0891b2; margin-top: 0;">New Website Enquiry</h2>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Name:</strong> %s</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> %s</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> %s</p>
          <p style="margin: 5px 0;"><strong>Business:</strong> %s</p>
          <p style="margin: 5px 0;"><strong>Website:</strong> %s</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; color: #374151;">Message / Requirements:</h3>
          <p style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">%s</p>
        </div>

        %s

        %s

        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #9ca3af;">
          <p>Submitted on: %s</p>
        </div>
      </div>
    ', 
    NEW.name, 
    NEW.email, 
    COALESCE(NEW.phone, 'Not provided'), 
    COALESCE(NEW.business, 'Not provided'), 
    COALESCE(NEW.website, 'Not provided'),
    NEW.message,
    CASE 
      WHEN NEW.subject IS NOT NULL THEN format('<p style="padding: 10px; background-color: #ecfeff; color: #0891b2; border-radius: 6px; font-weight: bold;">Selected Plan/Offer: %s</p>', NEW.subject)
      ELSE ''
    END,
    metadata_html,
    to_char(NEW.created_at, 'DD/MM/YYYY HH24:MI')
    ) -- Close format()
  ); -- Close jsonb_build_object()

  -- Fire the HTTP POST request to Resend API
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

-- Create the trigger
drop trigger if exists on_contact_submission_created on contact_submissions;
create trigger on_contact_submission_created
  after insert on contact_submissions
  for each row
  execute function send_contact_notification_email();
