import React from 'react'
import PostInput from './components/PostInput'
import BlogBoxTable from '@/app/components/HomeCenter/components/BlogBox/BlogBoxTable/BlogBoxTable'
import axios from 'axios';
// import ModalClient from '../ModalClient/ModalClient';

const fetchPostedData = async (searchTerm = '') => {
    try {
        const { data: postedData } = await axios.get(`${process.env.NEXTAUTH_URL}/api/blog`);
        if (!searchTerm) return postedData

        return postedData.filter((post) => {
            const { name = '', content = '' } = post
            return (
                (name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (content || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
        })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return []
    }
};

export default async function HomeCenter({ searchParams }) {
    const searchTerm = (searchParams?.search || '').toString()
    const cardData = await fetchPostedData(searchTerm)
    return (
        <div className="overflow-y-auto h-screen border-l-2 border-r-2 border-gray-500 p-4">
            <div className="flex flex-col items-center  min-h-screen">
                {/* Post Input Box */}
                <PostInput />

                {/* Modal */}
                {/* <ModalClient /> */}


                {/* Post Card */}
                <BlogBoxTable cardData={cardData} />
            </div>
        </div>
    )
}
