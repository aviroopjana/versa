import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create a token that expires in 10 minutes
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    
    // Store the verification token
    await prisma.verificationToken.upsert({
      where: { 
        identifier_token: {
          identifier: email,
          token: "current" // We use a placeholder to allow upsert
        } 
      },
      update: {
        token: otp,
        expires
      },
      create: {
        identifier: email,
        token: otp,
        expires
      }
    });
    
    // Send email with OTP
    await resend.emails.send({
      from: "Versa <verify@yourdomain.com>",
      to: email,
      subject: "Verify your email for Versa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify your email for Versa</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
