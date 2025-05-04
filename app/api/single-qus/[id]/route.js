// import { PATCH } from './route';
import { authOptions } from "@/lib/authOptions"
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


export const GET = async (req, { params }) => {
    const questionCollection = await dbConnect(collectionNameObj.questionCollection);
    const query = { _id: new ObjectId(params.id) };
    const singleQus = await questionCollection.findOne(query);
    return NextResponse.json(singleQus);
};

export const DELETE = async (req, { params }) => {
    const query = { _id: new ObjectId(params.id) };
    const questionCollection = await dbConnect(collectionNameObj.questionCollection);
    const currentQuestion = await questionCollection.findOne(query);

    const session = await getServerSession(authOptions);
    const isOwnerOk = session?.user?.email === currentQuestion?.email;

    if (isOwnerOk) {
        const deleteQus = await questionCollection.deleteOne(query);
        revalidatePath("/qus-ans");
        return NextResponse.json(deleteQus);
    } else {
        return NextResponse.json(
            { message: "You are not authorized to delete the question" },
            { status: 401 }
        );
    }
};

