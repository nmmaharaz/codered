// import { PATCH } from './route';
import { authOptions } from "@/lib/authOptions"
import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
// import { getRouteParam } from "@/utils/getRouteParam"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


export const GET = async (req, { params }) => {
    const id = params.id;

    const blogCollection = await dbConnect(collectionNameObj.blogCollection);
    const singleBlog = await blogCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(singleBlog);
};

export const DELETE = async (req, { params }) => {
    const id = params.id;

    const blogCollection = await dbConnect(collectionNameObj.blogCollection);
    const currentBlog = await blogCollection.findOne({ _id: new ObjectId(id) });

    const session = await getServerSession(authOptions);
    const isOwnerOk = session?.user?.email === currentBlog?.email;

    if (isOwnerOk) {
        const deleteBlog = await blogCollection.deleteOne({ _id: new ObjectId(id) });
        revalidatePath("/");
        return NextResponse.json(deleteBlog);
    } else {
        return NextResponse.json(
            { message: "You are not authorized to delete the question" },
            { status: 401 }
        );
    }
};


