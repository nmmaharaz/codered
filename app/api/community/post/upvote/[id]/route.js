import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const {id} = await params
    const groupPostColleciton = await dbConnect(collectionNameObj.groupPostColleciton);
    const singleBlog = await groupPostColleciton.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(singleBlog);
};



export const PATCH = async (req, { params }) => {
    const groupPostColleciton = await dbConnect(collectionNameObj.groupPostColleciton);
    const {id} = await params
    const postId = new ObjectId(id)
    const body = await req.json();
    const userEmail = body.user;

    if (!userEmail) {
        return NextResponse.json({ message: "No user email provided" }, { status: 400 });
    }

    const post = await groupPostColleciton.findOne({ _id: postId });
    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    let updateLikes = [...(post.likes || [])];
    let updateDislikes = [...(post.dislikes || [])];
    const alreadyLiked = updateLikes.includes(userEmail);

    if (alreadyLiked) {
        updateLikes = updateLikes.filter(email => email !== userEmail);
    } else {
        updateLikes.push(userEmail);
        updateDislikes = updateDislikes.filter(email => email !== userEmail);
    }

    const updateRes = await groupPostColleciton.updateOne(
        { _id: postId },
        { $set: { likes: updateLikes, dislikes: updateDislikes } }
    );

    return NextResponse.json({
        message: alreadyLiked ? "Like removed" : "Like added",
        totalLikes: updateLikes.length,
        updateRes
    });
};
