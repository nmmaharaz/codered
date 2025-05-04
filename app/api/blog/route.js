import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import { NextResponse } from "next/server"

// Getting all blogCollection data
export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    const blogCollection = await dbConnect(collectionNameObj.blogCollection);
    
    // If email is provided, filter by email
    const query = email ? { email } : {};
    const result = await blogCollection.find(query).toArray();
    
    return NextResponse.json(result);
}

// Posting to blogCollection
export const POST = async (req) => {
    const body = await req.json()
    const blogCollection = await dbConnect(collectionNameObj.blogCollection)
    const result = await blogCollection.insertOne(body)
    return NextResponse.json(result)
}
