import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const {accessibility, _id}  = await req.json();
  const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection);
//   const data = await groupMemberCollection.findOne({_id})
  const result = await groupMemberCollection.updateOne({ _id: new ObjectId(_id)}, {
    $set: {
      accessibility
    }
  });
  console.log(result)
  return NextResponse.json(result);
}
