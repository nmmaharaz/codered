// import GroupPostCard from "./GroupPostCard"
import PostInputCard from "./PostInputCard";

function GroupPostLeftSideBar({user_name}) {
  return (
    <div className="min-h-screen">
      <PostInputCard user_name={user_name}></PostInputCard>
      {/* <GroupPostCard></GroupPostCard> */}
    </div>
  );
}

export default GroupPostLeftSideBar;
