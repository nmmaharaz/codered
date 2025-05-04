"use client"

import { usePathname } from "next/navigation"
import ShowRequestInfo from "./ShowRequestInfo"
import { useGroupInfo } from "../../component/CommunityUserInfo"

function RequestInfo() {
    const pathname=  usePathname()
    const path =pathname.split("/")[2]
      const {data, isLoading, isError, refetch} = useGroupInfo(path)
  return (
    <div>
        <ShowRequestInfo data={data} isLoading={isLoading} refetch={refetch}></ShowRequestInfo>
    </div>
  )
}

export default RequestInfo