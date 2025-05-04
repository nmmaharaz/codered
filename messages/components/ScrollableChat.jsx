"use client";

import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <>
            {messages &&
                messages.map((m, i) => (
                    <div className="flex items-center" key={m._id}>
                        {(isSameSender(messages, m, i, user?._id) ||
                            isLastMessage(messages, i, user?._id)) && (
                                <div>
                                    <img src={m.sender?.image || m.sender?.pic} alt="Sender image" className="rounded-full w-8 h-8 outline-2 outline-blue-500 mr-1 mt-2 cursor-pointer" />
                                </div>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user?._id ? "#1ABC9C" : "#3498DB"}`,
                                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                                marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                            }}
                            className="py-1.5 px-3.5 rounded-3xl max-w-[75%]"
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </>
    );
};

export default ScrollableChat;
