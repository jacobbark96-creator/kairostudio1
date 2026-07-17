interface Env {
  RESEND_API_KEY: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const body: any = await request.json();
    const { staffEmail, answers } = body;

    if (!staffEmail || !answers) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const resendApiKey = env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0891b2;">Discovery Call Summary</h2>
        <p><strong>Submitted by:</strong> ${staffEmail}</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        ${Object.entries(answers)
          .map(
            ([question, answer]) => `
          <div style="margin-bottom: 20px;">
            <p style="font-weight: bold; color: #374151; margin-bottom: 5px;">${question}</p>
            <p style="color: #4b5563; white-space: pre-wrap; background: #f9fafb; padding: 10px; border-radius: 8px;">${answer || 'No answer provided'}</p>
          </div>
        `
          )
          .join('')}
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">This form was submitted via kairostudio.co.uk/form</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Kairo Studio <hello@kairostudio.co.uk>',
        to: [staffEmail],
        subject: `Discovery Call: ${answers['Client / Business Name'] || 'New Lead'}`,
        html: emailHtml,
      }),
    });

    const data: any = await res.json();
    if (!res.ok) throw new Error(`Resend API Error: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true, messageId: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Discovery Form API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to send discovery form' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
