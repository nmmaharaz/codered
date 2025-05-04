import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import LikeSection from './LikeSection/LikeSection'
// import EditSection from './EditSection/EditSection'
// import DeleteSection from './DeleteSection/DeleteSection'
// import CommentSection from './CommentSection/CommentSection'
import GroupLikeSeciton from './GroupLikeSeciton'
import GroupCommentSection from './GroupCommentSeciton'
// import BookmarkSection from './BookMarkSection/Bookmarksection'

export default function PostBoxFooter({ card }) {
  return (
    <>
      <div className="flex justify-center items-center space-x-4">
        {/* Upvote Button */}
        <GroupLikeSeciton card={card} />

        {/* Comments */}
        <GroupCommentSection card={card} />
      </div>

      
    </>
  )
}


