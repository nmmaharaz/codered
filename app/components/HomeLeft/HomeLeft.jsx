
import React from 'react'
import TopGroups from './components/TopGroups/TopGroups'
import ProfileSection from './components/ProfileSection/ProfileSection'
import axios from 'axios';

const fetchCommunityData = async () => {
    try {
        const { data: postedData } = await axios.get(`${process.env.NEXTAUTH_URL}/api/community`);
        return postedData
    } catch (error) {
        console.error("Error fetching posts:", error);
        return []
    }
};
export default async function HomeLeft() {
    const communityData = await fetchCommunityData();
    return (
        <div className="hidden md:block sticky top-0 ">
            <div className='min-h-3/5 '>
                <TopGroups communityData={communityData} />
            </div>
            {/* <div className="divider divider-secondary"></div> */}
            <div className="profileAndLogout">
                <ProfileSection />
            </div>
        </div>
    )
}
