import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Server-only Supabase client (no session persistence)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // 1 — Save to Supabase
    const { error: dbError } = await supabase.from("contacts").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      );
    }

    // 2 — Send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    let emailStatus: { sent: boolean; error?: string } = { sent: false };

    if (resendKey) {
      try {
        const resend = new Resend(resendKey);

        // NOTE: When using onboarding@resend.dev (Resend's test domain) the
        // recipient MUST be the same email used to register your Resend account.
        // To send to any email, verify your own domain at resend.com/domains.
        // Until then, RESEND_TO_EMAIL should equal your Resend account email.
        const toEmail =
          process.env.RESEND_TO_EMAIL ?? "anshika.sharma.vfx28@gmail.com";

        const { data, error: sendError } = await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [toEmail],
          replyTo: email.trim(),
          subject: `New message from ${name.trim()} — Portfolio`,
          html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#131313;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#131313;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#201f1f;border-radius:16px;overflow:hidden;border:1px solid rgba(77,70,53,0.2);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#f2ca50,#d4af37);padding:32px 40px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#3c2f00;font-weight:600;">Shweta Sharma · Portfolio</p>
          <h1 style="margin:8px 0 0;font-size:24px;font-weight:800;color:#3c2f00;letter-spacing:-0.02em;">New Contact Message</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding-right:12px;">
                <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(229,226,225,0.4);">From</p>
                <p style="margin:0;font-size:15px;color:#e5e2e1;font-weight:600;">${name.trim()}</p>
              </td>
              <td width="50%">
                <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(229,226,225,0.4);">Email</p>
                <p style="margin:0;font-size:14px;color:#f2ca50;">${email.trim()}</p>
              </td>
            </tr>
          </table>
          <div style="height:1px;background:linear-gradient(to right,transparent,rgba(77,70,53,0.4),transparent);margin-bottom:28px;"></div>
          <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(229,226,225,0.4);">Message</p>
          <p style="margin:0;font-size:15px;color:rgba(229,226,225,0.85);line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
        </td></tr>
        <!-- Reply CTA -->
        <tr><td style="padding:0 40px 36px;">
          <div style="height:1px;background:linear-gradient(to right,transparent,rgba(77,70,53,0.4),transparent);margin-bottom:28px;"></div>
          <a href="mailto:${email.trim()}?subject=Re: Your message to Shweta Sharma"
            style="display:inline-block;background:linear-gradient(135deg,#f2ca50,#d4af37);color:#3c2f00;padding:14px 28px;border-radius:6px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
            Reply to ${name.trim()} →
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 40px;background:#1c1b1b;">
          <p style="margin:0;font-size:11px;color:rgba(229,226,225,0.3);text-align:center;">
            Sent from your portfolio contact form · anshika.sharma.vfx28@gmail.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });

        if (sendError) {
          console.error("Resend API error:", sendError);
          emailStatus = { sent: false, error: sendError.message };
        } else {
          console.log("Email sent successfully. Resend ID:", data?.id);
          emailStatus = { sent: true };
        }
      } catch (emailError) {
        const msg = emailError instanceof Error ? emailError.message : String(emailError);
        console.error("Resend exception:", msg);
        emailStatus = { sent: false, error: msg };
      }
    } else {
      console.warn("RESEND_API_KEY not set — email notification skipped.");
    }

    return NextResponse.json({ success: true, email: emailStatus }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
