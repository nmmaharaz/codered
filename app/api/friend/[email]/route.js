import dbConnect, { collectionNameObj } from "@/lib/dbConnect";import { NextResponse } from "next/server";

export async function GET(req) {
    // const { email } = await params;
    const userCollection = await dbConnect(collectionNameObj.userCollection)
    const result = await userCollection.find({}).toArray()
    return NextResponse.json(result)
}