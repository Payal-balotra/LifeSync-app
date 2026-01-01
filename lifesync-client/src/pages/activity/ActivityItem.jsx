import { formatActivity } from "../../lib/utils";

const ActivityItem = ({ activity }) => {
  return (
    <div className="text-sm border-b pb-2">
      <p>
        <b>{activity.user?.name}</b>{" "}
        <span className="text-gray-700">
          {formatActivity(activity)}
        </span>
      </p>

      <p className="text-xs text-gray-400">
        {new Date(activity.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default ActivityItem;
