import { Select } from "@headlessui/react";
import axios from "axios";
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

function Admin_Request({ members, mutate }) {
  const handleUpdate = async (accessibility, _id) => {
    // const accessibility = e.target.value
    console.log(accessibility, _id, "accessibility==>");
    const { data } = await axios.patch("/api/community/member", {
      accessibility,
      _id,
    });
    if (data?.acknowledged) {
      toast.success("Admin Request Successfully");
    }
  };
  return (
    <div>
      <div className="mt-4 px-4 py-2 shadow-sm rounded-md">
        <div className="border-t border-gray-300">
          {members?.Admin_Request?.map((member, index) => (
            <div
              className="flex py-3 border-b border-gray-300 items-center justify-between"
              key={index}
            >
              <div className="flex items-center">
                <Image
                  src={
                    member?.user_photo
                      ? member?.user_photo
                      : "https://placehold.co/400x400"
                  }
                  alt={member?.name}
                  height={40}
                  width={40}
                  className="h-[40px] w-[40px] rounded-full"
                ></Image>
                <div className="flex ml-8 flex-col">
                  <p className="font-semibold text-white/90">{member?.name}</p>
                  <p className="text-sm text-gray-500">{member?.email}</p>
                  <p className="text-sm text-gray-500">{member?._id}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center">
                <p className="text-center bg-orange-300 text-white py-1 px-3 rounded-md mr-4">
                  {member?.accessibility}
                </p>
                <p className="text-center bg-red-500 text-white py-1 px-3 rounded-md mr-4">
                  Cencel
                </p>
           
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin_Request;
