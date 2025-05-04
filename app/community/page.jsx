export const dynamic = "force-dynamic";

import CommunityPage from "./component/CommunityPage";
import LoadingPage from "../loading";

const fetchAllGroupData = async () => {
  try {
    const baseUrl = process.env.NEXTAUTH_URL;
    const res = await fetch(`${baseUrl}/api/community`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch groups");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching groupdata info:", error);
    return null;
  }
};

export default async function GroupList() {
  const groups = await fetchAllGroupData();
  console.log(groups, "groups==>");

  if (!groups) {
    return (
      <div className="text-center text-gray-400">
        <LoadingPage />
      </div>
    );
  }

  return <CommunityPage groups={groups} />;
}
