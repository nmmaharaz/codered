"use client";

import { Button } from "@/components/ui/button";
import { PiArrowFatUpBold, PiArrowFatUpFill } from "react-icons/pi";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function GroupLikeSeciton({ card }) {
    const session = useSession()
    const postId = card?._id
    const [likeCount, setLikeCount] = useState(card?.likes?.length || 0);
    const [hashLikeCount, setHashLikeCount] = useState(false);

    // fetching questionLike data
    const fetchQusData = async () => {
        try {
            const { data } = await axios(`/api/community/post/upvote/${postId}`);
            setLikeCount(data?.likes?.length || 0);
            setHashLikeCount(data?.likes?.includes(session?.data?.user?.email));
        } catch (error) {
            console.error("Error fetching questionLike data:", error);
        }
    }
    const updateLike = async () => {
        try {
            const userEmail = session?.data?.user?.email;
            if (!userEmail) return;

            const response = await axios.patch(`/api/community/post/upvote/${postId}`, {
                user: userEmail,
            });

            await fetchQusData()
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    useEffect(() => {
        setHashLikeCount(
            Array.isArray(card?.likes) && card.likes.includes(session?.data?.user?.email || "")
        );
    }, [card, session]);

    return (
        <>
            <Button
                onClick={updateLike}
                className={`flex items-center space-x-1 border gap-0
                        ${hashLikeCount ? "bg-blue-400" : "bg-white hover:bg-white"} 
                    ${hashLikeCount ? "text-white" : "text-gray-900 hover:text-blue-500"}`}>
                {hashLikeCount ? <PiArrowFatUpFill className="text-white" /> : <PiArrowFatUpBold />}
                <span className="flex gap-0.5"><span className="font-semibold hidden md:flex justify-center items-center">Upvote</span> <span>({likeCount})</span> </span>
            </Button>
        </>
    )
}