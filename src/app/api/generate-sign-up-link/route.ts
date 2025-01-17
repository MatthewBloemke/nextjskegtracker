import { NextResponse } from "next/server";
import { authAdmin } from "@/firebase/admin";

// POST handler for the API route
export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ID token and check if the user has an 'admin' claim
    const decodedToken = await authAdmin.verifyIdToken(token);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden - Admins only" }, { status: 403 });
    }

    const body = await req.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const signUpLink = await authAdmin.generateSignInWithEmailLink(email, {
      url: "http://localhost:3000/signin",
      handleCodeInApp: true,
    });

    return NextResponse.json({ link: signUpLink }, { status: 200 });
  } catch (error) {
    console.error("Error generating sign-up link:", error);
    return NextResponse.json(
      { error: "Failed to generate sign-up link", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
