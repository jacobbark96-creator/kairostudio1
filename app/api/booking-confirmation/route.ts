import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_3dzRJj4u_Lr4A9udWQM2Jqc3f9v5AHDDP');

// Initialize Twilio ONLY if the API key starts with 'AC' (which Twilio requires)
// Otherwise, it will fail the build process
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, date, time } = await request.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formattedDate = new Date(date).toLocaleDateString('en-GB', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });

    // 1. Send Email to Client
    try {
      const clientEmailRes = await resend.emails.send({
        from: 'Kairo Studio <onboarding@resend.dev>', // Use the Resend testing domain until you verify kairostudio.co.uk in Resend dashboard
        to: email,
        subject: 'Booking Confirmation: Kairo Studio Consultation',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>Booking Confirmed!</h2>
            <p>Hi ${name},</p>
            <p>Your 30-minute consultation with Kairo Studio is confirmed for:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <strong>Date:</strong> ${formattedDate}<br>
              <strong>Time:</strong> ${time}<br>
            </div>
            <p>We will send you a Google Meet link shortly before the meeting.</p>
            <p>If you need to reschedule, please reply to this email.</p>
            <br>
            <p>Best regards,<br>The Kairo Studio Team</p>
          </div>
        `
      });
      console.log('Client Email Sent:', clientEmailRes);
    } catch (emailError) {
      console.error('Failed to send client email:', emailError);
    }

    // 2. Send Notification Email to Admin (You)
    try {
      const adminEmailRes = await resend.emails.send({
        from: 'Kairo Studio System <onboarding@resend.dev>', // Use the Resend testing domain
        to: 'hello@kairostudio.co.uk', // Ensure this is the email you verified in Resend if you are still in testing mode
        subject: `NEW BOOKING: ${name} at ${time}`,
        html: `
          <h3>New Consultation Booked</h3>
          <p><strong>Client:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${time}</p>
        `
      });
      console.log('Admin Email Sent:', adminEmailRes);
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
    }

    // 3. Send SMS to Client (if phone number provided and Twilio is configured)
    if (phone && process.env.TWILIO_ACCOUNT_SID) {
      try {
        await twilioClient.messages.create({
          body: `Hi ${name}, your consultation with Kairo Studio is confirmed for ${formattedDate} at ${time}. We'll email you a meeting link.`,
          from: process.env.TWILIO_PHONE_NUMBER || 'dummy_number',
          to: phone
        });
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking Confirmation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking confirmation' },
      { status: 500 }
    );
  }
}
