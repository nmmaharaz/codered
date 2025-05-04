"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    MoreVertical, Bookmark, Flag,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LikeSection from "./components/LikeSection";
import DisLikeSection from "./components/DisLikeSection";
import DeleteSection from "./components/DeleteSection";
import CommentSection from "./components/CommentSection/CommentSection";
import EditSection from "./components/EditSection";

export default function QuestionBoxFooter({ card }) {
    const { data: session } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if the question is already bookmarked when component mounts
    useEffect(() => {
        if (session && card?._id) {
            checkBookmarkStatus();
        }
    }, [session, card?._id]);

    const checkBookmarkStatus = async () => {
        try {
            const response = await fetch('/api/bookmarks');
            const bookmarks = await response.json();
            
            if (Array.isArray(bookmarks)) {
                const isAlreadyBookmarked = bookmarks.some(
                    bookmark => bookmark.type === 'question' && bookmark.questionId === card._id
                );
                setIsBookmarked(isAlreadyBookmarked);
            }
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const handleBookmark = async () => {
        if (!session || isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/bookmarks', {
                method: isBookmarked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionId: card._id,
                    type: 'question'
                }),
            });

            if (response.ok) {
                setIsBookmarked(!isBookmarked);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-0.5 md:space-x-4">
                {/* Upvote Button */}
                <LikeSection card={card} />

                {/* Downvote Button */}
                <DisLikeSection card={card} />

                {/* Comments */}
                <CommentSection card={card} />
            </div>

            <div>
                {/* Three-dot Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-white border text-gray-900 hover:text-gray-100">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white text-black p-2 rounded-lg shadow-md">
                        {/* Edit */}
                        <EditSection id={card._id} card={card} />
                        {/* Delete btn */}
                        <DeleteSection id={card._id} />
                        <DropdownMenuItem 
                            onClick={handleBookmark}
                            className={`flex items-center space-x-2 hover:bg-gray-100 p-2 cursor-pointer ${
                                isBookmarked ? 'text-blue-600' : ''
                            }`}
                            disabled={isLoading}
                        >
                            <Bookmark className="w-4 h-4" />
                            <span>{isBookmarked ? 'Unbookmark' : 'Bookmark'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100 p-2 cursor-pointer text-red-500">
                            <Flag className="w-4 h-4" />
                            <span>Report</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}
