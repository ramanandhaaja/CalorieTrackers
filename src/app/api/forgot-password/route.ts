import { NextResponse } from "next/server";
import payload from "../../../lib/payload";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await payload.forgotPassword({
      collection: 'users',
      data: {
        email,
      },
    });

    return NextResponse.json({
      message: "If a user with that email exists, a password reset email will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
