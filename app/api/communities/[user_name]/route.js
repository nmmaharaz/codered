import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { user_name } = params;
  const communityCollection = await dbConnect(collectionNameObj.communityCollection);
  const data = await communityCollection.findOne({ user_name });

  const result = await communityCollection.aggregate([
    {
      $match: { user_name: user_name }
    },
    {
      $lookup: {
        from: "groupMember",
        localField: "user_name",
        foreignField: "user_name",
        as: "members"
      }
    },
    { $unwind: "$members" },
    {
      $lookup: {
        from: "users",
        localField: "members.member",
        foreignField: "name",
        as: "userDetails"
      }
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        memberData: {
          _id: "$members._id",
          accessibility: "$members.accessibility",
          name: "$userDetails.name",
          group_user_name: "$members.user_name",
          user_name: "$userDetails.user_name",
          email: "$userDetails.email",
          user_photo: "$userDetails.image"
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        group_name: { $first: "$group_name" },
        group_picture: { $first: "$group_picture" },
        audience: { $first: "$audience" },
        description: { $first: "$description" },
        email: { $first: "$email" },
        user_name: { $first: "$user_name" },
        Owner: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Owner"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        },
        Admin: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Admin"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        },
        Admin_Request: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Admin Request"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        },
        invited: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Invited"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        },
        all_Member: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Member"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        },
        request: {
          $push: {
            $cond: [
              { $eq: ["$members.accessibility", "Request"] },
              "$memberData",
              "$$REMOVE"
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        group_name: 1,
        group_picture: 1,
        audience: 1,
        description: 1,
        email: 1,
        user_name: 1,
        Owner: "$Owner",
        All_Admin: "$Admin",
        Admin_Request: "$Admin_Request",
        Invited_members: "$invited",
        All_Member: "$all_Member",
        Request_members: "$request"
      }
    }
  ]).toArray();

  return NextResponse.json(result);
}

export async function PATCH(req, { params }) {
  const { member } = await req.json();
  const { user_name } = params;
  const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection);
  const result = await groupMemberCollection.updateOne({ member, user_name }, {
    $set: {
      accessibility: "Member"
    }
  });
  return NextResponse.json(result);
}

export async function DELETE(req, { params }) {
  const { user_name } = params;
  const member = req.headers.get("member") || req.nextUrl.searchParams.get("member");
  const groupMemberCollection = await dbConnect(collectionNameObj.groupMemberCollection);
  const result = await groupMemberCollection.deleteOne({ user_name, member });
  return NextResponse.json(result);
}
