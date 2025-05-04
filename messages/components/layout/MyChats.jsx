"use client";

import React, { useEffect, useState } from 'react'
import { ChatState } from "../../Context/ChatProvider";
import axios from 'axios';
import { getSender, getSenderImage } from '../../config/ChatLogics';
import Skeleton from '../ui/Skeleton';
import SideDrawer from './SideDrawer';

const MyChats = ({ fetchAgain }) => {

  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/chat`, config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div className={`${selectedChat ? "hidden" : "flex"} md:flex flex-col items-center p-3 bg-black w-full md:w-[31%] rounded-lg border`}>
      <div className='pb-3 px-3 text-[28px] md:text-3xl flex w-full justify-between items-center text-white'>
        <span>Chats</span>
        <SideDrawer />
      </div>
      <div className='flex flex-col p-3 bg-black w-full h-screen rounded-lg overflow-y-hidden'>
        {
          chats ? (
            <div className='overflow-y-hidden space-y-1'>
              {
                chats.map((chat) => (
                  <div key={chat._id} onClick={() => setSelectedChat(chat)} className={`${selectedChat === chat ? "bg-slate-500 text-white" : "bg-slate-700 text-white"} cursor-pointer px-3 py-2 rounded-lg`}>
                    <div className='flex items-center justify-start gap-3'>
                      <img src={!chat.isGroupChat ? getSenderImage(loggedUser, chat.users) : chat?.image} alt="" className='rounded-full w-8 h-8 outline-2 outline-blue-500' />
                      <p>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : <div><Skeleton /> <Skeleton /></div>}
      </div>
    </div>
  )
}

export default MyChats