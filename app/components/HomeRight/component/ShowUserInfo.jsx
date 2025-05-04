import Image from "next/image";
import profileImage from '@/public/assets/profile-pic.png';

export default function ShowUserInfo({ userData }) {
  return (
    <div>
      <div className="group m-1 lg:m-4 ">
        <ul className="space-y-4">
          {userData.slice(0, 5).map((user, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative rounded-full overflow-hidden">
                  <Image
                    src={user?.user_photo || profileImage}
                    alt={user?.user_name || "User"}
                    width={38}
                    height={38}
                    className="rounded-full w-10 h-10 object-cover border-2 overflow-hidden border-blue-500"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-200 text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">web developer</p>
                </div>
              </div>
              <button
                className={`flex items-center justify-center w-8 h-8 rounded-full ${user.isFollowing
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
                  } hover:bg-blue-700 group transition`}
              >
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 group-hover:text-white w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
