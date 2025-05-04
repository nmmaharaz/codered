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

    const collection = await dbConnect(collectionNameObj.bookmarkCollection);
    const bookmarks = await collection.find({ email: session.user.email }).toArray();

    // Always return the array, even if empty
    return new Response(JSON.stringify(bookmarks || []), { status: 200 });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    // Return empty array instead of error object
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { questionId, blogId, type } = await req.json();
    
    const collection = await dbConnect(collectionNameObj.bookmarkCollection);

    // Add bookmark
    await collection.insertOne({
      email: session.user.email,
      questionId,
      blogId,
      type: type || 'question',
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { questionId, blogId, type } = await req.json();
    
    const collection = await dbConnect(collectionNameObj.bookmarkCollection);

    // Remove bookmark
    await collection.deleteOne({
      email: session.user.email,
      ...(questionId && { questionId }),
      ...(blogId && { blogId }),
      type: type || 'question',
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
} 