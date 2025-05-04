import { Select } from '@headlessui/react'
import axios from 'axios';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { ChevronDownIcon } from 'lucide-react';
import Image from "next/image";

function ShowMember({ members, mutate }) {
  const handleUpdate = async(accessibility, _id)=>{
    // const accessibility = e.target.value
    console.log(accessibility, _id, "accessibility==>")
    const data = await axios.patch("/api/community/member",{accessibility,_id})
    console.log(data, "this ===> is data ===>")
  }
  return (
    <div>
      <div className="mt-4 px-4 py-2 shadow-sm rounded-md">
        <div className="border-t border-gray-300">
          {members?.All_Member?.map((member, index) => (
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
              <div className='flex items-center'>
              <p className="text-center bg-orange-300 text-white py-1 px-3 rounded-md mr-4">
                  {member?.accessibility}
                </p>
                <div className="relative">
                  <Select 
                  onChange={(e)=>handleUpdate(e.target.value, member?._id)}
                  defaultValue={member?.accessibility}
                    className={clsx(
                      "block w-full appearance-none rounded-lg border-none bg-white/5 px-6 py-1.5 text-sm/6 text-white",
                      "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
                      // Make the text of each option black on Windows
                      "*:text-black"
                    )}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin Request">Admin</option>
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-2.5 right-[5px] size-4 fill-white/60"
                    aria-hidden="true"
                  />
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowMember;
