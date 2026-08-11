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
    const { name, email, phone, date, timeSlot, rep_name, rep_notes } = body;

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
    
    // We want to book the slot as explicitly 'Europe/London' time.
    // If the user books "12:00" on April 15th, it means "12:00 PM London Time".
    // London observes DST (BST = UTC+1 in April).
    // The safest way to pass this to Google Calendar so it natively calculates the correct DST offset
    // is to pass the local ISO string WITHOUT a 'Z', and pair it with the explicit `timeZone` property.

    const startDateTimeLocal = `${date}T${timeSlot}:00`;
    
    // To calculate the end time 30 mins later locally without math bugs:
    const [hourStr, minStr] = timeSlot.split(':');
    let endHour = parseInt(hourStr, 10);
    let endMin = parseInt(minStr, 10) + 30;
    if (endMin >= 60) {
      endHour += 1;
      endMin -= 60;
    }
    const endDateTimeLocal = `${date}T${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}:00`;

    const event = {
      summary: `Consultation: ${name} / Kairo Studio`,
      description: `New booking created by Admin.\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${rep_name ? `Rep Name: ${rep_name}\n` : ''}${rep_notes ? `Rep Notes: ${rep_notes}` : ''}`,
      start: {
        dateTime: startDateTimeLocal,
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endDateTimeLocal,
        timeZone: 'Europe/London',
      },
      attendees: [
        { email: email }, // The client
        { email: 'jake@openlead.co.uk' } // The admin
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const calRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`, {
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
