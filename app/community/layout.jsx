import "../globals.css"
import HomeLeft from "../components/HomeLeft/HomeLeft";
export default function DashboardLayout({
    children
  }) {
    return (
      <div className="bg-none">
        <div className="flex justify-between">
          <div className="w-4/12 border-r mr-2 border-gray-600">
          <HomeLeft></HomeLeft>
          </div>
          
        <div className="w-full">
        {children}
        </div>
        </div>
      </div>
    );
  }
  