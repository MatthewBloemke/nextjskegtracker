import { authAdmin } from "@/firebase/admin";

interface RequestBody {
  email: string
}

export async function POST(request: Request) {
  try {
    const authToken = request.headers.get("Authorization")?.split(" ")[1];

    if (!authToken) {
      return new Response("Unauthorized" , { status: 401 });
    }

     const decodedToken = await authAdmin.verifyIdToken(authToken);
     console.log(decodedToken);
    if (!decodedToken.admin) {
      return new Response("Forbidden - Admin access only" , { status: 403 });
    }

    try {
      const body : RequestBody = await request.json();
      const user = await authAdmin.getUserByEmail(body.email);
      await authAdmin.setCustomUserClaims(user.uid, { allowed: true });
  
      return new Response(`Access granted to ${body.email}` , { status: 200 });
    } catch {

      return new Response("Email is required", { status: 400 });
    }

  } catch (error) {
    console.error("Error setting custom claim:", error);
    return new Response("Failed to set custom claim", { status: 500 });
  }
}
