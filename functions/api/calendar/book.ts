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
    
    // Fetch Calendar Metadata to get the exact Timezone of the owner
    const metaRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const metaData: any = await metaRes.json();
    const ownerTimeZone = metaData.timeZone || 'UTC';

    // Calculate the absolute UTC start time by getting the timezone offset
    const dt = new Date(`${date}T12:00:00Z`);
    const tzDateStr = new Intl.DateTimeFormat('en-US', { 
      timeZone: ownerTimeZone, 
      year: 'numeric', month: 'numeric', day: 'numeric', 
      hour: 'numeric', minute: 'numeric', second: 'numeric', 
      hour12: false 
    }).format(dt);
    
    const utcDateStr = new Intl.DateTimeFormat('en-US', { 
      timeZone: 'UTC', 
      year: 'numeric', month: 'numeric', day: 'numeric', 
      hour: 'numeric', minute: 'numeric', second: 'numeric', 
      hour12: false 
    }).format(dt);
    
    const tzTime = new Date(tzDateStr).getTime();
    const utcTime = new Date(utcDateStr).getTime();
    const offsetMs = tzTime - utcTime; // E.g. +7 hours in ms

    // E.g. user selects "10:00". In GMT, that's "10:00:00Z".
    // We want the booking to represent "10:00 Local Time". 
    // So absolute UTC = Local - Offset.
    const slotLocalMs = new Date(`${date}T${timeSlot}:00Z`).getTime();
    const slotStartMs = slotLocalMs - offsetMs;
    const slotEndMs = slotStartMs + 30 * 60000;
    
    const startDateTime = new Date(slotStartMs).toISOString();
    const endDateTime = new Date(slotEndMs).toISOString();
    
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
