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

    // Generate time bounds based on London Time to ensure we grab all relevant events for that day.
    // For simplicity, we just use a broad 24-hour window from midnight to midnight UTC.
    // This provides enough buffer to catch any London-time events overlapping with the requested date.
    const startOfDayUTC = new Date(`${dateStr}T00:00:00Z`);
    const endOfDayUTC = new Date(`${dateStr}T23:59:59Z`);
    
    const timeMin = new Date(startOfDayUTC.getTime() - 14 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(endOfDayUTC.getTime() + 14 * 60 * 60 * 1000).toISOString();

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
      
      // The Google event objects contain absolute `dateTime` strings.
      // We parse them into JavaScript Date objects.
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      // Generate 30 min slots for the requested date and check overlap
      for (let hour = 8; hour < 18; hour++) {
        for (const min of [0, 30]) {
          const timeString = `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
          
          // Format slot start time for comparison in explicit UK Time
          const slotStartString = `${dateStr} ${timeString}:00`;
          
          // Use Intl.DateTimeFormat to force Google's absolute Event Time 
          // into the UK Timezone ('Europe/London') accounting for BST/DST.
          const formatOptions: Intl.DateTimeFormatOptions = { 
            timeZone: 'Europe/London', 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false 
          };
          
          const eStartStr = eventStart.toLocaleString('en-GB', formatOptions).replace(',', '');
          const eEndStr = eventEnd.toLocaleString('en-GB', formatOptions).replace(',', '');
          
          // Format from "DD/MM/YYYY HH:MM:SS" back to comparable "YYYY-MM-DD HH:MM:SS"
          const partsS = eStartStr.split(' ');
          const datePartsS = partsS[0].split('/');
          const formattedEStart = `${datePartsS[2]}-${datePartsS[1]}-${datePartsS[0]} ${partsS[1]}`;
          
          const partsE = eEndStr.split(' ');
          const datePartsE = partsE[0].split('/');
          const formattedEEnd = `${datePartsE[2]}-${datePartsE[1]}-${datePartsE[0]} ${partsE[1]}`;

          // Calculate slot end time string (+30 mins)
          let endHour = hour;
          let endMin = min + 30;
          if (endMin >= 60) {
            endHour += 1;
            endMin -= 60;
          }
          const endTimeString = `${endHour.toString().padStart(2, '0')}:${endMin === 0 ? '00' : '30'}`;
          const slotEndString = `${dateStr} ${endTimeString}:00`;

          // Lexicographical string comparison natively handles the local overlap 
          // after DST has been mathematically resolved by Intl.DateTimeFormat
          if (formattedEStart < slotEndString && formattedEEnd > slotStartString) {
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
