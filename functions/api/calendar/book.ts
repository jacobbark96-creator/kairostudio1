import { SignJWT, importPKCS8 } from 'jose';

// Define Types for Cloudflare Env
interface Env {
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_CALENDAR_ID: string;
}

async function getGoogleToken(clientEmail: string, privateKey: string, scopes: string[]) {
  const algorithm = 'RS256';
  const formattedKey = privateKey.replace(/\\n/g, '\n');
  const pk = await importPKCS8(formattedKey, algorithm);

  const jwt = await new SignJWT({
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
  })
    .setProtectedHeader({ alg: algorithm, typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(pk);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data: any = await res.json();
  if (!res.ok) throw new Error(`Google Auth Error: ${JSON.stringify(data)}`);
  return data.access_token;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const body: any = await request.json();
    const { name, email, date, timeSlot, companyName, phone } = body;
    
    if (!name || !email || !date || !timeSlot) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const privateKey = env.GOOGLE_PRIVATE_KEY;
    const clientEmail = env.GOOGLE_CLIENT_EMAIL;
    const calendarId = env.GOOGLE_CALENDAR_ID;

    if (!privateKey || !clientEmail || !calendarId) {
      return new Response(JSON.stringify({ success: true, message: 'No Google Calendar credentials provided' }), { status: 200 });
    }

    const token = await getGoogleToken(clientEmail, privateKey, ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly']);
    
    // The website sends the slot as if it's GMT. Example: "17:00".
    // 5pm GMT = 5pm UTC.
    // However, when creating events via the Google Calendar API, simply passing `dateTime: "2026-04-15T17:00:00Z"` 
    // sometimes causes Google to apply the calendar owner's timezone offset TWICE if the `timeZone` property isn't explicitly set, 
    // or if the service account has a weird default timezone.
    
    // To fix this reliably, we will explicitly pass the owner's timezone to Google,
    // but we will calculate the correct local time so that it lands exactly on the GMT hour you requested.
    
    const metaRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const metaData: any = await metaRes.json();
    const ownerTimeZone = metaData.timeZone || 'UTC';

    // We want the event to occur at exactly `timeSlot` GMT.
    // Example: user selects "17:00". We want this to land at 17:00 GMT on Google Calendar.
    // The easiest and most bulletproof way to tell Google Calendar "This is exactly 17:00 GMT"
    // is to construct an absolute ISO 8601 string with a "Z" (Zulu time) and omit the `timeZone` property.
    // Google will automatically place this exact absolute moment in time on the owner's calendar,
    // and visually translate it into the owner's local timezone (e.g. 17:00 GMT -> 00:00 Jakarta).
    
    const startDateTime = `${date}T${timeSlot}:00Z`;
    
    // Calculate the end time 30 mins later
    const startMs = new Date(startDateTime).getTime();
    const endMs = startMs + 30 * 60000;
    const endDateTime = new Date(endMs).toISOString();

    const event = {
      summary: `Consultation: ${name} / Kairo Studio`,
      description: `New booking received via Kairo Studio Website.\n\nName: ${name}\nEmail: ${email}\n${companyName ? `Company: ${companyName}` : ''}\n${phone ? `Phone: ${phone}` : ''}`,
      start: {
        dateTime: startDateTime,
      },
      end: {
        dateTime: endDateTime,
      }
    };

    const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    });

    const calData: any = await calRes.json();
    if (!calRes.ok) throw new Error(`Calendar API Error: ${JSON.stringify(calData)}`);

    return new Response(JSON.stringify({ success: true, eventId: calData.id, eventLink: calData.htmlLink }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    console.error('Google Calendar Booking API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to create calendar event' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
