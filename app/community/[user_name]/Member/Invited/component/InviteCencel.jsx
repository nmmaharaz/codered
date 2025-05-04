"use client"
import axios from "axios";
import { useRouter } from "next/navigation";

function InviteCencel() {
    const route = useRouter()
    const handleDelete = async (invite) => {
        await axios.delete(`/api/communities/${invite?.group_user_name}`, {
          headers: { member: invite?.name },
        });
        route.refresh()
      };
    return (
    <div>
         <button
                onClick={() => handleDelete(invite)}
                className="text-center cursor-pointer hover:bg-red-700 duration-500 bg-red-500 text-white font-semibold text-sm py-1 px-3 rounded-md mr-4"
              >
                Cencel
              </button>
    </div>
  )
}

export default InviteCencel