"use client";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import Skeleton from "../ui/Skeleton";
import UserListItem from "../ui/UserListItem";
import { FaSearch } from "react-icons/fa";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [loadingChat, setLoadingChat] = useState(false);
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
  } = ChatState();

  const handelSearch = async () => {
    if (!search) {
      alert("Please Enter Soothing in search !")
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
    }
  }

  const accessChat = async (userId) => {
    try {
      // setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      // setLoadingChat(false);
      // onClose();
    } catch (error) {
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center bg-black w-full py-2 px-3">
        <div>
          <div className="drawer" data-theme="dark">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label
                htmlFor="my-drawer"
                className="btn btn-ghost text-white hover:bg-gray-600"
              >
                <FaSearch />
                <span className="hidden lg:flex">Search User</span>
              </label>
            </div>
            <div className="drawer-side z-50">
              <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <div className="menu bg-base-200 text-white min-h-full w-80 p-4">
                <div className="flex items-center gap-2 justify-center">
                  <input type="text" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-full max-w-xs" />
                  <button onClick={handelSearch} className="btn outline btn-sm">GO</button>
                </div>
                <div>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    searchResult?.map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
