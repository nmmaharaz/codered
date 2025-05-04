import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Flag, MoreVertical } from 'lucide-react'
import LikeSection from './LikeSection/LikeSection'
import EditSection from './EditSection/EditSection'
import DeleteSection from './DeleteSection/DeleteSection'
import CommentSection from './CommentSection/CommentSection'
import BookmarkSection from './BookMarkSection/Bookmarksection'
// import BookmarkSection from './BookMarkSection/Bookmarksection'

export default function BlogBoxFooter({ card }) {
  return (
    <>
      <div className="flex justify-center items-center space-x-4">
        {/* Upvote Button */}
        <LikeSection card={card} />

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
            <EditSection id={card._id} card={card} />
            <DeleteSection id={card._id} />
            <BookmarkSection card={card} />
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