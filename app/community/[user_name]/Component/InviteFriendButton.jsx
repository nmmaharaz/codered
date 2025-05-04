"use client"

import { FaPlus } from "react-icons/fa"

function InviteFriendButton() {
  return (
    <div>
         <button
            onClick={() =>
              document.getElementById("invite_friend").showModal()
            }
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-x-2 text-sm"
          >
            <FaPlus /> Invite
          </button>
    </div>
  )
}

export default InviteFriendButton