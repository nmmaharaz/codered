// import { authOptions } from "@/lib/authOptions"
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
// import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

// Getting all question collection data
export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    const questionCollection = await dbConnect(collectionNameObj.questionCollection);
    
    // If email is provided, filter by email
    const query = email ? { email } : {};
    const result = await questionCollection.find(query).toArray();
    
    return NextResponse.json(result);
}

// Posting to questionCollection
export const POST = async (req) => {
    const body = await req.json()
    const questionCollection = await dbConnect(collectionNameObj.questionCollection)
    const result = await questionCollection.insertOne(body)
    return NextResponse.json(result)
}
