import { authAdmin } from "@/firebase/admin";

// POST handler for the API route
export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(null, {status: 401, statusText: 'Unauthorized'});
    }

    // Verify ID token and check if the user has an 'admin' claim
    const decodedToken = await authAdmin.verifyIdToken(token);
    if (!decodedToken.admin) {
      return new Response(null, {status: 403, statusText: 'Forbidden - Admins only'});
    }

    const body = await req.json();
    const { email } = body;
    if (!email) {
      return new Response(null, {status: 400, statusText: 'Email is required'});
    }

    const signUpLink = await authAdmin.generateSignInWithEmailLink(email, {
      url: "http://localhost:3000/signin",
      handleCodeInApp: true,
    });

    return new Response(JSON.stringify({link: signUpLink}));
  } catch (error) {
    console.error("Error generating sign-up link:", error);
    return new Response(null, {status: 500, statusText: error instanceof Error ? error.message : String(error)})
  }
}

export default POST;
