import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { fromZonedTime } from 'date-fns-tz';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, timeSlot, companyName, phone } = body;
    
    if (!name || !email || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!privateKey || !clientEmail || !calendarId) {
      // If no calendar credentials, fail gracefully
      return NextResponse.json({ success: true, message: 'No Google Calendar credentials provided' });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.events']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const timeZone = 'Europe/London';
    
    // Calculate start and end times in UTC for Google Calendar insertion
    const slotStartLocal = `${date}T${timeSlot}:00`;
    const slotStartDate = fromZonedTime(slotStartLocal, timeZone);
    const slotEndDate = new Date(slotStartDate.getTime() + 30 * 60000); // 30 minute duration
    
    const event = {
      summary: `Consultation: ${name} / Kairo Studio`,
      description: `New booking received via Kairo Studio Website.
      
Name: ${name}
Email: ${email}
${companyName ? `Company: ${companyName}` : ''}
${phone ? `Phone: ${phone}` : ''}`,
      start: {
        dateTime: slotStartDate.toISOString(),
        timeZone,
      },
      end: {
        dateTime: slotEndDate.toISOString(),
        timeZone,
      },
      attendees: [
        { email } // Send an invite to the person who booked
      ],
      conferenceData: {
        createRequest: {
          requestId: `kairo-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
      requestBody: event,
    });

    return NextResponse.json({ success: true, eventId: response.data.id, eventLink: response.data.htmlLink });
  } catch (error: any) {
    console.error('Google Calendar Booking API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create calendar event' }, { status: 500 });
  }
}
