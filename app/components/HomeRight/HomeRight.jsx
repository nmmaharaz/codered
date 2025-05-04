import React from 'react'
import ShowUserInfo from './component/ShowUserInfo';
import axios from 'axios';
const fetchUserData = async () => {
  try {
      const { data: postedData } = await axios.get(`${process.env.NEXTAUTH_URL}/api/users`);
      return postedData
  } catch (error) {
      console.error("Error fetching posts:", error);
      return []
  }
};
export default async function HomeRight() {
  const userData = await fetchUserData();
  return (
    <div className="hidden lg:block sticky top-0 ">
      <ShowUserInfo userData={userData}></ShowUserInfo>
    </div>
  )
}
