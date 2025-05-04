"use client";
import useSWR from "swr";
import axios from "axios";
import GroupInput from "./GroupInput";
import { usePathname } from "next/navigation";
import PostBoxTable from "./PostBoxTable";
import LoadingPage from "@/app/loading";

const fetcher = (url) => axios.get(url).then(res => res.data);

export default function PostInputCard() {
  const pathname = usePathname();
  const user_name = pathname.split("/")[2];

  const {
    data: cardData,
    isLoading,
    mutate,
  } = useSWR(`/api/community/post/${user_name}`, fetcher);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!cardData) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage></LoadingPage>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <div className="flex flex-col items-center">
          <GroupInput mutate={mutate} />
          <PostBoxTable cardData={cardData}></PostBoxTable>
        </div>
      </div>
    </div>
  );
}
