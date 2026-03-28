import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Call OpenClaw AI endpoint
    // Base URL: https://jenny-openclaw.tail1b30ec.ts.net
    // Path: kairo:website:chatbot-default
    // Format: Raw String
    
    // Construct the full URL
    // Note: If 'kairo:website:chatbot-default' is meant to be a path parameter or a query parameter, 
    // it needs to be formatted correctly. Assuming it's a path parameter appended to the URL.
    const url = 'https://jenny-openclaw.tail1b30ec.ts.net/kairo:website:chatbot-default';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // Sending as raw string
      },
      body: message, // Sending the raw message string
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenClaw API Error:', response.status, errorText);
      throw new Error(`OpenClaw API returned ${response.status}`);
    }

    // Assuming the response is also a raw string or plain text
    const replyText = await response.text();

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
