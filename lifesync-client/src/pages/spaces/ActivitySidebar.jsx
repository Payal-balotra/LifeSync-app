import { X } from "lucide-react";
import ActivityFeed from "../../pages/activity/ActivityFeed";

const ActivitySidebar = ({ onClose }) => {
  return (
    <aside className="w-80 border-l bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-sm">Activity</h3>
        <button onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4">
        <ActivityFeed />
      </div>
    </aside>
  );
};

export default ActivitySidebar;
