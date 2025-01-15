import { NextResponse } from "next/server";
import { authAdmin } from "@/firebase/admin";

export async function POST(request: Request) {
  try {
    const authToken = request.headers.get("Authorization")?.split(" ")[1];
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await authAdmin.verifyIdToken(authToken);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden - Admin access only" }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await authAdmin.getUserByEmail(email);
    await authAdmin.setCustomUserClaims(user.uid, { allowed: true });

    return NextResponse.json({ message: `Access granted to ${email}` }, { status: 200 });
  } catch (error) {
    console.error("Error setting custom claim:", error);
    return NextResponse.json({ error: "Failed to set custom claim" }, { status: 500 });
  }
}
