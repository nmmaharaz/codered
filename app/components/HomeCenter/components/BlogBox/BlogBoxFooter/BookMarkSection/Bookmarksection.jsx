"use client"

import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'

export default function BookmarkSection({ card }) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the blog is already bookmarked when component mounts
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
          bookmark => bookmark.type === 'blog' && bookmark.blogId === card._id
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
          blogId: card._id,
          type: 'blog'
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
    <DropdownMenuItem
      onClick={handleBookmark}
      className={`flex items-center space-x-2 hover:bg-gray-100 p-2 cursor-pointer ${isBookmarked ? 'text-blue-600' : ''}`}
      disabled={isLoading}
    >
      <Bookmark className="w-4 h-4" />
      <span>{isBookmarked ? 'Unbookmark' : 'Bookmark'}</span>
    </DropdownMenuItem>
  )
}