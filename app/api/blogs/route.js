import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');
    
    if (!ids) {
      return new Response(JSON.stringify({ error: "No blog IDs provided" }), { status: 400 });
    }

    const blogIds = ids.split(',').map(id => new ObjectId(id));
    const collection = await dbConnect(collectionNameObj.blogCollection);
    
    const blogs = await collection.find({
      _id: { $in: blogIds }
    }).toArray();

    return new Response(JSON.stringify(blogs), { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
} 