import { NextResponse } from "next/server";
import { db } from "@/firebase/client"; // Adjust the path as needed
import { collection, doc, getDoc, getDocs, addDoc, query, where } from "firebase/firestore";
import { adminAuth } from "@/app/utils/firebaseAdmin";

// Handle GET requests
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            // Fetch a single distributor by ID
            const docRef = doc(db, "distributors", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return NextResponse.json({ error: "Distributor not found" }, { status: 404 });
            }

            return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
        } else {
            // Fetch all distributors
            const querySnapshot = await getDocs(collection(db, "distributors"));
            const distributors = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return NextResponse.json(distributors);
        }
    } catch (error) {
        console.error("Error fetching distributors: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Handle POST requests
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1];
  console.log("Authorization Header:", request.headers.get("Authorization"));

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), { status: 401 });
  }
  try {
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // console.log(decodedToken)
    // // Example: Check for admin privileges
    // if (!decodedToken.admin) {
    //   return new Response(JSON.stringify({ error: "Forbidden: Admin privileges required" }), { status: 403 });
    // }
    const body = await request.json();
    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // const distributorsRef = collection(db, "distributors");
    // const q = query(distributorsRef, where("name", "==", name));
    //   const querySnapshot = await getDocs(q);

    //   console.log(querySnapshot, 'test')
    // if (!querySnapshot.empty) {
    //     return NextResponse.json({ error: "Distributor with this name already exists" }, { status: 400 });
    // }

    const docRef = await addDoc(collection(db, "distributors"), {
        name,
        averageDaysOut: 0,
    });

    return NextResponse.json({ message: "Distributor created", id: docRef.id }, { status: 201 });
  } catch (error) {
      console.error("Error adding distributor: ", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
