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
    const email = searchParams.get('email');
    
    const collection = await dbConnect(collectionNameObj.questionCollection);
    
    // If email is provided, filter by email
    if (email) {
      const questions = await collection.find({ email }).toArray();
      return new Response(JSON.stringify(questions), { status: 200 });
    }
    
    // If ids are provided, filter by ids
    if (ids) {
      const questionIds = ids.split(',').map(id => new ObjectId(id));
      const questions = await collection.find({
        _id: { $in: questionIds }
      }).toArray();
      return new Response(JSON.stringify(questions), { status: 200 });
    }
    
    // If neither provided, return empty array
    return new Response(JSON.stringify([]), { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
} 