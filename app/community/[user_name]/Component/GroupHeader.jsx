// "use client";
import Image from "next/image";
import { FaCheck, FaEllipsisH } from "react-icons/fa";
// import GroupTab from "./GroupTab";
// import { usePathname } from "next/navigation";
// import InviteFriend from "./InviteFriend";
import profilePic from "@/public/assets/profile-pic.png";
import axios from "axios";
// import { useEffect, useState } from "react";
import InviteFriend from "./InviteFriend";
import GroupTab from "./GroupTab";
import LoadingPage from "@/app/loading";
import InviteFriendButton from "./InviteFriendButton";

const fetchGroupHeaderData = async (path) => {
  try {
    const { data } = await axios.get(`${process.env.NEXTAUTH_URL}/api/communities/${path}`);
    return data[0];
  } catch (error) {
    console.error("Error fetching group info:", error);
    return null;
  }
};

export default async function GroupHeader({user_name}) {
  // const pathname = usePathname();
  // const path = pathname.split("/")[2];

  const groupInfo = await fetchGroupHeaderData(user_name);
  console.log(groupInfo, "this is group Info====>")
  // const [groupInfo, setGroupInfo] = useState(null);

  // useEffect(() => {
  //   const loadData = async () => {
  //     const data = await fetchGroupHeaderData(path);
  //     setGroupInfo(data[0]);
  //   };
  //   if (path) loadData();
  // }, [path]);
  // console.log(groupInfo, "======;;;>")

  if (!groupInfo) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage></LoadingPage>
      </div>
    );
  }
console.log(groupInfo, "this is group Info====>")
  return (
    <div className="border border-gray-600 rounded-lg mb-6 p-6 w-full mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={
              groupInfo.group_picture
                ? groupInfo.group_picture
                : "https://placehold.co/400x150"
            }
            alt="Group Picture"
            className="h-[80px] w-[80px] object-cover rounded-lg"
            width={80}
            height={80}
          />
          <div className="ml-3">
            <h2 className="font-bold text-xl">
              {groupInfo.group_name} <span className="text-green-500">✔</span>
            </h2>
            <p className="text-sm text-gray-500">
              {groupInfo.audience} ·{" "}
              {groupInfo.All_Member?.length || 0} members
            </p>

            <div className="flex mt-2">
              {groupInfo.All_Member?.slice(0, 4).map((member, i) => (
                <Image
                  key={i}
                  src={member?.user_photo || profilePic}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white -ml-2 first:ml-0"
                />
              ))}
              <span className="text-xs text-gray-600 ml-2">
                +
                {groupInfo.All_Member?.length > 5
                  ? groupInfo.All_Member.length - 5
                  : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-x-2 text-sm">
            <FaCheck /> Joined
          </button>
         <InviteFriendButton></InviteFriendButton>
          <button className="bg-gray-200 text-gray-600 p-2 rounded-lg">
            <FaEllipsisH />
          </button>
        </div>
        <InviteFriend user_name={user_name} />
      </div>
      <GroupTab />
    </div>
  );
}
