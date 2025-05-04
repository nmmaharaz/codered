import "../../globals.css";
import GroupHeader from "./Component/GroupHeader";
// import { GroupHeader } from "./Component/GroupHeader";
// import GroupHeader from "./Component/GroupHeader";
export default function DashboardLayout({ children, params }) {
  const { user_name } = params;
  return (
    <div className="bg-none">
      <GroupHeader user_name={user_name}></GroupHeader>
      {children}
    </div>
  );
}
