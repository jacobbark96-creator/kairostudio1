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

    const token = await getGoogleToken(clientEmail, privateKey, ['https://www.googleapis.com/auth/calendar.events']);

    // Example: User books 12:00 PM on the website.
    // You want this to appear as 6:00 PM on your calendar.
    // This is exactly a +6 hour fixed mapping.
    
    const slotGmtMs = new Date(`${date}T${timeSlot}:00Z`).getTime();
    const OFFSET_HOURS = 6;
    
    const slotStartMs = slotGmtMs + (OFFSET_HOURS * 60 * 60 * 1000);
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
