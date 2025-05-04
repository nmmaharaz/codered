import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server"

export async function GET(req, {params}){
     const {email} =await params
     const userCollection = await dbConnect(collectionNameObj.userCollection)
     const result = await userCollection.findOne({email})
     return NextResponse.json(result)
}
