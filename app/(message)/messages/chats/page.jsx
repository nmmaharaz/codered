"use client";

import ChatBox from "@/messages/components/layout/ChatBox";
import MyChats from "@/messages/components/layout/MyChats";
import SideDrawer from "@/messages/components/layout/SideDrawer";
import App from "../../app/App";
import { useEffect, useState } from "react";
import Skeleton from "@/messages/components/ui/Skeleton";

const ChatPage = () => {

  const [fetchAgain, setFetchAgain] = useState();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  if (!user) return <div><Skeleton /><Skeleton /></div>;

  return (
    <App>
      <div className="w-full" data-theme="dark">
        {/* {user && <SideDrawer />} */}
        <div className="flex justify-between h-[87vh] p-3 w-full" data-theme="dark">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </div>
    </App>
  );
};

export default ChatPage;
