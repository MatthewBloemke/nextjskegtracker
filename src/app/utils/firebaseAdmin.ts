import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

// Lazy initialization of Firebase Admin SDK
let firebaseAdminApp: App;

if (!getApps().length) {
    firebaseAdminApp = initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
} else {
    firebaseAdminApp = getApps()[0];
}

// Export Firebase Admin Auth
export const adminAuth = getAdminAuth(firebaseAdminApp);
