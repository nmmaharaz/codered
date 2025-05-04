import Image from "next/image";
import ShowMember from "./ShowMember";
import ShowAllAdmin from "./ShowAllAdmin";
import Admin_Request from "./Admin_Request";

function ShowAllMemberInfo({ members, mutate}) {
  return (
    <div className="my-5">
      <div className="px-4 py-2 shadow-sm rounded-md">
        {members?.Owner?.map((owner, index) => (
          <div className="flex items-center border-b pb-6 border-gray-300 justify-between" key={index}>
            <div className="flex items-center">
              <Image
                src={
                  owner?.user_photo
                    ? owner?.user_photo
                    : "https://placehold.co/400x400"
                }
                alt="Ownwer name"
                height={40}
                width={40}
                className="h-[40px] w-[40px] rounded-full"
              ></Image>
            <div className="flex ml-8 flex-col">
              <p className="text-white/90 font-semibold">{owner?.name}</p>
              <p className="text-sm text-gray-500">{owner?.email}</p>
            </div>
            </div>
            <div>
                <p className="text-center bg-green-500 text-white py-1 px-3 rounded-md mr-4">{owner?.accessibility}</p>
            </div>
          </div>
        ))}
      </div>
      <ShowAllAdmin members={members} mutate={mutate}></ShowAllAdmin>
      <Admin_Request members={members} mutate={mutate}></Admin_Request>
      <ShowMember members={members} mutate={mutate}></ShowMember>

    </div>
  );
}

export default ShowAllMemberInfo;
