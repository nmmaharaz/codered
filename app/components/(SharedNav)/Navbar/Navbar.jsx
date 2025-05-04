"use client";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Bell, MessagesSquare } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect } from "react";
import profilePic from "@/public/assets/profile-pic.png";
import DrawerContentPage from "@/app/components/HomeCenter/components/DrawerContentPage";
import axios from "axios";
import { useRouter } from "next/navigation";
import Notification from "../../Notifications/Notifications";
import LoadingPage from "@/app/loading";
import SearchInputs from "./components/Search";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const email = session?.user.email || null;

  const setUserInLocalStorage = async () => {
    if (email) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/user/getuser/${email}`
        );
        const userData = response.data;
        localStorage.setItem("userInfo", JSON.stringify(userData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    setUserInLocalStorage();
  }, [email]);

  const navLinks = (
    <>
      <li className="lg:hidden">
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/qus-ans"}>Questions <span className="hidden lg:flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question-icon lucide-message-circle-question"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
        </span> </Link>
      </li>
      <li>
        <Link href={"/community"}>
          Community
          <span className="hidden lg:flex"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users-round-icon lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg></span>
        </Link>
      </li>
    </>
  );

  const handelMassageRoute = () => {
    router.push("/messages/chats");
  };

  return (
    <div className="navbar lg:px-5 bg-black text-white shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white text-black rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <Link href={"/"} className=" hidden lg:flex">
          {/* <SparklesText text="DevQuestions" className="text-2xl" /> */}
          <h1 className="text-2xl"> <span className="text-red-700 hover:text-white">Code</span><span className="hover:text-red-700">Red</span> </h1>
        </Link>
        <ul className="menu menu-horizontal px-1 hidden lg:flex">{navLinks}</ul>
      </div>
      <div className="navbar-center relative">
        {/* Search bar */}
        <Suspense fallback={<div><LoadingPage /></div>}>
          <SearchInputs />
        </Suspense>
        {/* <SearchWithAi /> */}
      </div>
      <div className="navbar-end">
        {status === "authenticated" ? (
          <>
            <Drawer>
              <div className="flex justify-center items-center gap-1.5">
                <div
                  className="message btn btn-sm rounded-full bg-black border border-gray-600 text-white hidden md:flex"
                  onClick={handelMassageRoute}
                >
                  <MessagesSquare />
                </div>
                {/* <div className="notification btn btn-sm rounded-full bg-black border-none text-white hidden lg:flex">
                  <Bell />
                </div> */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="notification btn btn-sm rounded-full bg-black border border-gray-600 text-white hidden lg:flex"
                  >
                    <Bell />
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content bg-white rounded-box z-1 mt-3 shadow"
                  >
                    <Notification />
                  </div>
                </div>

                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        src={session?.user?.image || profilePic}
                        width={40}
                        height={40}
                        alt="Profile image"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-white text-black rounded-box z-1 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li>
                      <a>Settings</a>
                    </li>
                    <li>
                      <Link href="/messages/chats">Message</Link>
                    </li>
                    <li>
                      <a>Notification</a>
                    </li>

                    <li>
                      <button
                        onClick={() => signOut()}
                        className="btn btn-sm md:btn-md bg-red-400"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>

                <DrawerTrigger asChild>
                  <Button className="cursor-pointer  flex items-center bg-black border border-red-500 text-white md:px-5 py-2 rounded-lg font-medium transition duration-300">
                    <span className="hidden md:flex">Add Question</span>
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
                  </Button>
                </DrawerTrigger>
                {/* <DrawerTrigger asChild>
                                <Button className=' cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800'>Add Question</Button>
                            </DrawerTrigger> */}
              </div>
              {/* DrawerContentPage Here */}
              <DrawerContentPage />
            </Drawer>
          </>
        ) : (
          <>
            <div className="flex gap-1.5">
              <Link href={"/login"}>
                <Button className=" cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800">
                  Log In
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
