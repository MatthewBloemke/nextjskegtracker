import { NextRequest, NextResponse } from "next/server";
import { authAdmin } from "@/firebase/admin";

// POST handler for the API route
export async function POST(req: NextRequest) {
  try {
    // Ensure the request has a valid content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    // Parse JSON body correctly
    const body = await req.json();
    
    if (!body || !body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get Authorization token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    // Verify ID token and check if the user has an 'admin' claim
    const decodedToken = await authAdmin.verifyIdToken(token);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden - Admins only" }, { status: 403 });
    }

    // Generate the sign-up link
    const signUpLink = await authAdmin.generateSignInWithEmailLink(body.email, {
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
