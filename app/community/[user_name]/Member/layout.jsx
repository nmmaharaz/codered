import "../../../globals.css"
import MemberTab from "./component/MemberTab";
export default function DashboardLayout({
    children
  }) {
    return (
      <div className="min-h-screen border border-gray-500 shadow-md rounded-lg p-4">
        <MemberTab></MemberTab>
        {children}
      </div>
    );
  }