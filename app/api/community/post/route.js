import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export const POST = async (req) => {
    const body = await req.json()
    const groupPostColleciton = await dbConnect(collectionNameObj.groupPostColleciton)
    const result = await groupPostColleciton.insertOne(body)
    return NextResponse.json(result)
}


