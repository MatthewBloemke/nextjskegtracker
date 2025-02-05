import { authAdmin } from "@/firebase/admin";
import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";

interface RequestBody {
  email: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    console.log(body)
    const userEmail = body.email;

    if (!userEmail) {
      return new Response("Bad Request - Email is required", { status: 400 });
    }

    const userDocRef = doc(db, "employees", userEmail.replace(/[@.]/g, '_'));
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return new Response("User not found in Firestore", { status: 404 });
    }

    const userData = userDocSnap.data();

    const user = await authAdmin.getUserByEmail(userEmail);

    console.log(userData)

    await authAdmin.setCustomUserClaims(user.uid, {
      allowed: userData.allowed ?? false,
      admin: userData.admin ?? false,
      distributor: userData.distributor ?? false,
    });

    return new Response(`Custom claims updated for ${userEmail}`, { status: 200 });
  } catch (error) {
    console.error("Error updating custom claims:", error);
    return new Response("Failed to update custom claims", { status: 500 });
  }
}
