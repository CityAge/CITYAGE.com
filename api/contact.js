export const config = { runtime: 'edge' };

const SUPABASE_URL = 'https://rniqmxpmtqmnwqtawlnz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { name, organisation, email, enquiry, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // Save to Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ name, organisation, email, enquiry, message })
    });

    // Send alert email via Resend
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_KEY}`
        },
        body: JSON.stringify({
          from: 'CityAge <info@cityage.com>',
          to: ['miro@cityage.com'],
          subject: `New enquiry from ${name}${organisation ? ' — ' + organisation : ''}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
              <h2 style="font-weight: 300; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
                New CityAge Enquiry
              </h2>
              <p><strong>Name:</strong> ${name}</p>
              ${organisation ? `<p><strong>Organisation:</strong> ${organisation}</p>` : ''}
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${enquiry ? `<p><strong>Enquiry type:</strong> ${enquiry}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 16px; border-left: 3px solid #B8956A;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            </div>
          `
        })
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
