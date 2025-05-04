"use client";
import { usePathname } from "next/navigation";
import { useGroupInfo } from "../../component/CommunityUserInfo";
import ShowInvitedMember from "./ShowInvitedMember";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "@/app/loading";

const fetchGroupInviteData = async (path) => {
  try {
    const { data } = await axios.get(`/api/communities/${path}`);
    return data;
  } catch (error) {
    console.error("Error fetching group info:", error);
    return null;
  }
};

function InviteMemberInfo() {
  const [data, setData] = useState([])
  const pathname = usePathname();
  const path = pathname.split("/")[2];

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchGroupInviteData(path);
      setData(data[0]);
    };
    if (path) loadData();
  }, [path]);

  if (!data) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage></LoadingPage>
      </div>
    );
  }
  // const {data, isLoading, isError, refetch} = useGroupInfo(path)
  return (
    <div>
      <ShowInvitedMember data={data}></ShowInvitedMember>
    </div>
  );
}

export default InviteMemberInfo;
