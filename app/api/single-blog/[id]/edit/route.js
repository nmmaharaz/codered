import { authOptions } from "@/lib/authOptions"
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"


export async function GET(req, { params }) {
    const id = params.id
    const blogCollection = await dbConnect(collectionNameObj.blogCollection)
    const query = { _id: new ObjectId(id) }

    //validating is the owner of the booking or not
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const singleBooking = await blogCollection.findOne(query)
    const isOwnerOk = email === singleBooking?.email
    if (isOwnerOk) {
        return NextResponse.json(singleBooking)
    } else {
        return NextResponse.json({ message: "Forbidden GET access" }, { status: 403 })
    }

}

export const PATCH = async (req, { params }) => {
    const id = params.id
    const blogCollection = await dbConnect(collectionNameObj.blogCollection)
    const query = { _id: new ObjectId(id) }

    //validating is the owner of the booking or not
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    const currentBlogData = await blogCollection.findOne(query)
    const isOwnerOk = email === currentBlogData?.email
    if (isOwnerOk) {
        const content = await req.json()
        const filter = {
            $set: { ...content }
        }
        const option = {
            upsert: true
        }
        const updateRes = await blogCollection.updateOne(query, filter, option)
        // revalidatePath("/my-booking")
        return NextResponse.json(updateRes)
    } else {
        return NextResponse.json({ message: "Forbidden access" }, { status: 403 })
    }
}


