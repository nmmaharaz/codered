'use client';

import React, { useEffect, useState } from 'react';
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import io from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa";
import ScrollableChat from './ScrollableChat';
import { CiLocationArrow1 } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";

const ENDPOINT = process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER;
var socket, selectedChatCompare;

const SingleChat = () => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const { selectedChat, setSelectedChat, user } = ChatState();

    useEffect(() => {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket?.emit("setup", user);
        socket?.on("connected", () => setSocketConnected(true));
        socket?.on("typing", () => setIsTyping(true));
        socket?.on("stop typing", () => setIsTyping(false));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket?.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // if (!notification.includes(newMessageRecieved)) {
                //     setNotification([newMessageRecieved, ...notification]);
                //     setFetchAgain(!fetchAgain);
                // }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
            }
        }
    };

    const handelSentMessage = async () => {
        if (newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const handelMoreOptions = (chat) => {
        // if (!chat.isGroupChat) return;
        // setSelectedChat(chat);
    }

    return (
        <div className='w-full relative h-[75vh] rounded-lg' data-theme="dark">
            {
                selectedChat ? (
                    <>
                        <div className='text-[28px] md:text-3xl py-2 px-2 w-full flex justify-between items-center gap-2 rounded-lg bg-slate-700 text-white'>
                            <button className='bg-gray-600 p-1 rounded-full flex md:hidden cursor-pointer hover:bg-gray-500' onClick={() => setSelectedChat("")}>
                                <FaArrowLeft />
                            </button>
                            {messages && (
                                !selectedChat.isGroupChat ? (
                                    <div className='flex justify-between items-center w-full'>
                                        <p className='flex items-center gap-2'>
                                            <button className="btn btn-ghost text-black hover:bg-gray-200 px-2">
                                                <img height={32} width={32} src={`${getSenderImage(user, selectedChat.users)}`} alt="User" className="rounded-full outline-2 outline-blue-500" />
                                            </button>
                                            <span>{getSender(user, selectedChat.users)}</span>
                                        </p>
                                        <button onClick={() => handelMoreOptions(selectedChat)} className='bg-gray-500 p-1 hover:bg-gray-600 tooltip cursor-pointer rounded-full' data-tip="More Options">
                                            <IoMdMore />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {selectedChat.chatName.toUpperCase()}
                                    </div>
                                ))}
                        </div>
                        <div id='chat-container' className='p-3 bg-slate-800 w-full rounded-lg min-h-full max-h-full overflow-y-auto flex flex-col justify-between' data-theme="dark">
                            {
                                loading ? (
                                    <div className='flex justify-center items-center h-full'>
                                        <svg className="animate-spin h-8 w-8 text-green-500" viewBox="3 3 18 18" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" d="M12 3v2a7 7 0 1 0 7 7h2a9 9 0 1 1-9-9z" />
                                        </svg>
                                    </div>
                                ) : (<div>
                                    <ScrollableChat messages={messages} />
                                </div>)
                            }
                            <div className='mt-4' onKeyDown={sendMessage} data-theme="dark">
                                {isTyping ? <div>Typing...</div> : (<></>)}
                                <span className='flex items-center justify-center gap-3'>
                                    <input type="text" onChange={typingHandler} value={newMessage} placeholder='Enter a message...' className='bg-gray-600 input w-full border' />
                                    <button className='border-2 border-[#38b2ac] rounded-full p-2' onClick={handelSentMessage}>
                                        <CiLocationArrow1 />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='grid items-center justify-center h-full'>
                        <p className='text-3xl pb-3'>Click On a user to start chatting</p>
                    </div>
                )
            }
        </div>
    )
}

export default SingleChat