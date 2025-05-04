import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { collectionNameObj } from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const collection = await dbConnect(collectionNameObj.profileCollection);
    const profile = await collection.findOne({ email: session.user.email });

    return new Response(JSON.stringify(profile || {}), { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();

    const collection = await dbConnect(collectionNameObj.profileCollection);
    
    const result = await collection.updateOne(
      { email: session.user.email },
      {
        $set: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          ...body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error saving profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    
    const collection = await dbConnect(collectionNameObj.profileCollection);
    
    // Update profile picture
    const result = await collection.updateOne(
      { email: session.user.email },
      {
        $set: {
          profilePicture: `data:${file.type};base64,${base64}`,
          updatedAt: new Date(),
        },
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
} 