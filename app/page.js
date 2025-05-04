
import HomeLeft from "./components/HomeLeft/HomeLeft";
import HomeCenter from "./components/HomeCenter/HomeCenter";
import HomeRight from "./components/HomeRight/HomeRight";

export const revalidate = 0; // Disable caching, fetch fresh data on each request

export default function Home({ searchParams }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[20%_80%] lg:grid-cols-[20%_60%_20%] ">
      {/* Left Section (Hidden on small screens) */}
      <HomeLeft />

      {/* Center Section (Scrollable) */}
      <HomeCenter searchParams={searchParams} />

      {/* Right Section (Hidden on small & medium screens) */}
      <HomeRight />
    </div>
  );
}
