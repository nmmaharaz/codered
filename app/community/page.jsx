import axios from "axios";
import CommunityPage from "./component/CommunityPage";
import LoadingPage from "../loading";



const fetchAllGroupData = async () => {
  try {
    const { data } = await axios.get(`${process.env.NEXTAUTH_URL}/api/community`);
    return data;
  } catch (error) {
    console.error("Error fetching group info:", error);
    return null;
  }
};
export default async function GroupList() {
  const groups =await fetchAllGroupData();
  console.log(groups, "groups==>");

  if (!groups) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage></LoadingPage>
      </div>
    );
  }

  return (
    <CommunityPage groups={groups}></CommunityPage>
  );
}
