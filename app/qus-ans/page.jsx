import axios from "axios";
import QuestionTable from "./components/QuestionTable/QuestionTable";
// import QuestionTableTrending from "@/components/QuestionBox/QuestionTableTrending/QuestionTableTrending";


export const revalidate = 0; // Disable caching, fetch fresh data on each request
// const fetchPostedData = async () => {
//     try {
//         const { data: postedData } = await axios.get(`${process.env.NEXTAUTH_URL}/api/question`);
//         return postedData
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return []
//     }
// };

const fetchPostedData = async (searchTerm = '') => {
    try {
        const { data: postedData } = await axios.get(`${process.env.NEXTAUTH_URL}/api/question`);
        if (!searchTerm) return postedData

        return postedData.filter(post => {
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

export default async function DevQuestions({ searchParams }) {
    const searchTerm = (searchParams?.search || '').toString()
    const cardData = await fetchPostedData(searchTerm)




    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[78%_20%] gap-2.5">
                {/* Left side */}
                <QuestionTable
                    cardData={cardData}
                />
                {/* Right side */}
                {/* <QuestionTableTrending cardData={cardData} /> */}
            </div>
        </>
    );
}
