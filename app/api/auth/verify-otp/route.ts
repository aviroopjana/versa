import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }
    
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date()
        }
      }
    });
    
    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }
    
    // Mark the user's email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() }
    });
    
    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id
      }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
