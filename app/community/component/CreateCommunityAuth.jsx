"use client"
import { useSession } from "next-auth/react"
function CreateCommunityAuth() {
    const {data} = useSession()
  return (
    <div>
           <button disabled={!data?.user?.email} onClick={()=>document.getElementById("create_group").showModal()} className="cursor-pointer bg-blue-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm">
            + Create group
          </button>
    </div>
  )
}

export default CreateCommunityAuth