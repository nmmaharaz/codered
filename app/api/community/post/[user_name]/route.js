import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const {user_name } =await params;
    const groupPostColleciton = await dbConnect (collectionNameObj.groupPostColleciton);
    const result = await groupPostColleciton.find({group_user_name:user_name}).toArray();
    return NextResponse.json(result);
}