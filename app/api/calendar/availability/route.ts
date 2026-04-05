import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { fromZonedTime } from 'date-fns-tz';

// This endpoint runs on Node.js to support the `googleapis` package natively
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date'); // YYYY-MM-DD
    
    if (!dateStr) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!privateKey || !clientEmail || !calendarId) {
      // Return empty array if not configured, allowing fallback to DB only
      return NextResponse.json({ busySlots: [] });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const timeZone = 'Europe/London';
    
    // Create boundaries to query the Google Calendar
    // Query from 00:00 to 23:59 in London time
    const startOfDayLocal = `${dateStr}T00:00:00`;
    const endOfDayLocal = `${dateStr}T23:59:59`;
    
    const timeMin = fromZonedTime(startOfDayLocal, timeZone).toISOString();
    const timeMax = fromZonedTime(endOfDayLocal, timeZone).toISOString();

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const busySlots: string[] = [];

    events.forEach(event => {
      // If it's an all day event, it blocks the whole day
      if (event.start?.date) {
         for (let hour = 8; hour < 18; hour++) {
           busySlots.push(`${hour.toString().padStart(2, '0')}:00`);
           busySlots.push(`${hour.toString().padStart(2, '0')}:30`);
         }
         return;
      }

      if (!event.start?.dateTime || !event.end?.dateTime) return;
      
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      // Generate 30 min slots for the requested date and check overlap
      for (let hour = 8; hour < 18; hour++) {
        for (const min of [0, 30]) {
          const timeString = `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
          const slotStartLocal = `${dateStr}T${timeString}:00`;
          
          const slotStartDate = fromZonedTime(slotStartLocal, timeZone);
          const slotEndDate = new Date(slotStartDate.getTime() + 30 * 60000); // add 30 mins
          
          // Check overlap: event starts before slot ends AND event ends after slot starts
          if (eventStart < slotEndDate && eventEnd > slotStartDate) {
            if (!busySlots.includes(timeString)) {
              busySlots.push(timeString);
            }
          }
        }
      }
    });

    return NextResponse.json({ busySlots });
  } catch (error: any) {
    console.error('Google Calendar Availability API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch calendar availability' }, { status: 500 });
  }
}
