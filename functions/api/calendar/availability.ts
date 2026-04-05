import { SignJWT, importPKCS8 } from 'jose';

// Define Types for Cloudflare Env
interface Env {
  GOOGLE_CLIENT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_CALENDAR_ID: string;
}

async function getGoogleToken(clientEmail: string, privateKey: string, scopes: string[]) {
  const algorithm = 'RS256';
  // Replace escaped newlines with actual newlines
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

export async function onRequestGet(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const dateStr = url.searchParams.get('date'); // YYYY-MM-DD
    
    if (!dateStr) return new Response(JSON.stringify({ error: 'Date is required' }), { status: 400 });

    const privateKey = env.GOOGLE_PRIVATE_KEY;
    const clientEmail = env.GOOGLE_CLIENT_EMAIL;
    const calendarId = env.GOOGLE_CALENDAR_ID;

    if (!privateKey || !clientEmail || !calendarId) {
      return new Response(JSON.stringify({ 
        busySlots: [], 
        debug: 'Missing Env Vars',
        hasPrivateKey: !!privateKey,
        hasClientEmail: !!clientEmail,
        hasCalendarId: !!calendarId
      }), { status: 200 });
    }

    const token = await getGoogleToken(clientEmail, privateKey, ['https://www.googleapis.com/auth/calendar.readonly']);

    // Generate strict GMT (UTC) time bounds
    // The website calendar operates 100% in GMT/UTC time.
    const startOfDayGMT = new Date(`${dateStr}T00:00:00Z`);
    const endOfDayGMT = new Date(`${dateStr}T23:59:59Z`);
    
    // Expand by 14 hours in both directions to safely cover any global Timezone shifts 
    // that might pull events across midnight boundaries.
    const timeMin = new Date(startOfDayGMT.getTime() - 14 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(endOfDayGMT.getTime() + 14 * 60 * 60 * 1000).toISOString();

    const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const calData: any = await calRes.json();
    if (!calRes.ok) throw new Error(`Calendar API Error: ${JSON.stringify(calData)}`);

    const events = calData.items || [];
    const busySlots: string[] = [];
    const debugEventsList: any[] = [];

    // Debug tracking
    const debugEventsFound = events.length;

    events.forEach((event: any) => {
      debugEventsList.push({
        start: event.start,
        end: event.end,
        summary: event.summary
      });
      // All day event blocks the whole day
      if (event.start?.date) {
         for (let hour = 8; hour < 18; hour++) {
           busySlots.push(`${hour.toString().padStart(2, '0')}:00`);
           busySlots.push(`${hour.toString().padStart(2, '0')}:30`);
         }
         return;
      }

      if (!event.start?.dateTime || !event.end?.dateTime) return;
      
      // Parse Google event times into absolute milliseconds
      const eventStartMs = new Date(event.start.dateTime).getTime();
      const eventEndMs = new Date(event.end.dateTime).getTime();

      // Generate 30 min slots for the requested date in strict GMT (UTC+0) and check overlap
      for (let hour = 8; hour < 18; hour++) {
        for (const min of [0, 30]) {
          const timeString = `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
          
          // Construct absolute timestamp for the slot in GMT
          const slotStartMs = new Date(`${dateStr}T${timeString}:00Z`).getTime();
          const slotEndMs = slotStartMs + 30 * 60000; // +30 minutes

          // Check if event overlaps this 30m slot mathematically
          if (eventStartMs < slotEndMs && eventEndMs > slotStartMs) {
            if (!busySlots.includes(timeString)) {
              busySlots.push(timeString);
            }
          }
        }
      }
    });

    return new Response(JSON.stringify({ 
      busySlots,
      debug: {
        eventsFound: debugEventsFound,
        eventsList: debugEventsList,
        dateRequested: dateStr,
        timeMinRequested: timeMin,
        timeMaxRequested: timeMax
      }
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    console.error('Google Calendar Availability API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch calendar availability' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
