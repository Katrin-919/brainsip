import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    
    // Verify webhook signature if secret is configured
    if (hookSecret) {
      const wh = new Webhook(hookSecret);
      try {
        wh.verify(payload, headers);
      } catch (error) {
        console.error('Webhook verification failed:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    const data = JSON.parse(payload);
    console.log('Received password reset request for:', data.user?.email);

    const {
      user,
      email_data: { token, token_hash, redirect_to },
    } = data;

    if (!user?.email) {
      throw new Error('No user email provided');
    }

    // Create password reset link
    const resetLink = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${token_hash}&type=recovery&redirect_to=${redirect_to}`;

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: 'Ferdy Fox <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Passwort zurücksetzen - Ferdy Fox',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Passwort zurücksetzen</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Passwort zurücksetzen</h1>
              </div>
              <div style="padding: 40px 30px;">
                <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
                  Hallo!
                </p>
                <p style="color: #333333; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                  Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button unten, um dein Passwort zurückzusetzen:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                    Passwort zurücksetzen
                  </a>
                </div>
                <p style="color: #666666; font-size: 14px; line-height: 20px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                  Oder kopiere diesen Link in deinen Browser:
                </p>
                <p style="color: #2754C5; font-size: 12px; line-height: 18px; word-break: break-all;">
                  ${resetLink}
                </p>
                <p style="color: #999999; font-size: 14px; line-height: 20px; margin-top: 30px;">
                  Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.
                </p>
              </div>
              <div style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
                <p style="color: #999999; font-size: 12px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Ferdy Fox. Alle Rechte vorbehalten.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Password reset email sent successfully to:', user.email);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-password-reset-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
