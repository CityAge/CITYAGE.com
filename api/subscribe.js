export const config = { runtime: 'edge' };

// CityAge flagship publication (not secret — used in client embeds too)
const PUBLICATION_ID = 'pub_6c2428d5-0d75-4d30-abba-7fde15449252';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { email, website } = await req.json();

    // Honeypot: real users never fill the hidden "website" field. Bots do.
    // Silently accept so the bot moves on, but save nothing.
    if (website) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // Beehiiv API key lives ONLY in Vercel env — never in this file.
    const KEY = process.env.BEEHIIV_API_KEY;
    if (!KEY) {
      return new Response(JSON.stringify({ error: 'Subscriptions not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch(`https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'cityage.com',
        utm_medium: 'website',
        referring_site: 'cityage.com'
      })
    });

    if (!res.ok) {
      const detail = await res.text();
      return new Response(JSON.stringify({ error: 'Subscribe failed', detail }), {
        status: 502, headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
