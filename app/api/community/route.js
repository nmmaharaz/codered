import dbConnect, { collectionNameObj } from "@/lib/dbConnect";import { NextResponse } from "next/server";

export async function GET(){
    const communityCollection = await dbConnect(collectionNameObj.communityCollection)
    const result = await communityCollection.find({}).toArray()
    return NextResponse.json(result)
}

export async function POST(req){
    const {user_name, invite} =await req.json()
    const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection)
    if(invite){
        invite.map(async (member) => {
            const data = await groupMemberCollection.findOne({member})
            if(!data){
              await groupMemberCollection.insertOne({
                user_name,
                member,
                accessibility: "Invited",
              });
            }
          });
    }else{
      return NextResponse.json({message: false})
    }
    return NextResponse.json({ message: true })
}