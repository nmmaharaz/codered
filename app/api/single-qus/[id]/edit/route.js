import { authOptions } from "@/lib/authOptions"
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export async function GET(req, { params }) {
    const id = params.id
    const questionCollection = await dbConnect(collectionNameObj.questionCollection)
    const query = { _id: new ObjectId(id) }

    //validating is the owner of the booking or not
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const singleQuestion = await questionCollection.findOne(query)
    const isOwnerOk = email === singleQuestion?.email
    if (isOwnerOk) {
        return NextResponse.json(singleQuestion)
    } else {
        return NextResponse.json({ message: "Forbidden GET access" }, { status: 403 })
    }

}

export const PATCH = async (req, { params }) => {
    const id = params.id
    const questionCollection = await dbConnect(collectionNameObj.questionCollection)
    const query = { _id: new ObjectId(id) }

    //validating is the owner of the booking or not
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const currentQusData = await questionCollection.findOne(query)
    const isOwnerOk = email === currentQusData?.email
    if (isOwnerOk) {
        const content = await req.json()
        const filter = {
            $set: { ...content }
        }
        const option = {
            upsert: true
        }
        const updateRes = await questionCollection.updateOne(query, filter, option)
        // revalidatePath("/my-booking")
        return NextResponse.json(updateRes)
    } else {
        return NextResponse.json({ message: "Forbidden access" }, { status: 403 })
    }
}


