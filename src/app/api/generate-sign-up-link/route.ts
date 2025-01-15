import { NextApiRequest, NextApiResponse } from "next";
import { authAdmin } from "@/firebase/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify ID token and check if the user has an 'admin' claim
    const decodedToken = await authAdmin.verifyIdToken(token);
    if (!decodedToken.admin) {
      return res.status(403).json({ error: "Forbidden - Admins only" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const signUpLink = await authAdmin.generateSignInWithEmailLink(email, {
      url: "http://localhost:3000/signin",
      handleCodeInApp: true,
    });

    res.status(200).json({ link: signUpLink });
  } catch (error) {
    console.error("Error generating sign-up link:", error);
    res.status(500).json({ error: "Failed to generate sign-up link", details: error instanceof Error ? error.message : String(error) });
  }
}
