// "use client"
import GroupAboutCard from "./component/GroupAboutCard"
import GroupPostLeftSideBar from "./component/GroupPostLeftSideBar"

function GroupPostPage({params}) {
  const { user_name } = params;
  return (
    <div className="flex min-h-screen gap-4">
        <div className="w-4/6">
            <GroupPostLeftSideBar user_name={user_name}></GroupPostLeftSideBar>
        </div>
        <div className="w-2/6">
            <GroupAboutCard></GroupAboutCard>
        </div>
    </div>
  )
}

export default GroupPostPage