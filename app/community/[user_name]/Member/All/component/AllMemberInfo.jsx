"use client";
import useSWR from "swr";
import { usePathname } from "next/navigation";
import ShowAllMemberInfo from "./ShowAllMemberInfo";
import LoadingPage from "@/app/loading";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

function AllMemberInfo() {
  const pathname = usePathname();
  const path = pathname?.split("/")[2];

  const { data, error, mutate, isLoading } = useSWR(
    path ? `/api/communities/${path}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500">Failed to load members</div>
    );
  }

  return (
    <div>
      <ShowAllMemberInfo mutate={mutate} members={data[0]} />
    </div>
  );
}

export default AllMemberInfo;
