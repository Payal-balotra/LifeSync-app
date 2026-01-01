import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import { socket } from "../../services/socket";
import ActivityItem from "./ActivityItem";
const ActivityFeed = () => {
  const { spaceId } = useParams();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activity-feed", spaceId],
    enabled: !!spaceId,
    queryFn: async () => {
      const res = await api.get(
        API_PATHS.ACTIVITY.GET_ACTIVITY_FEED(spaceId)
      );
      return res.data;
    },
  });

  // 🔴 Live updates
  useEffect(() => {
    if (!spaceId) return;

    socket.emit("join-space", { spaceId });

    const onNewActivity = () => {
      queryClient.invalidateQueries(["activity-feed", spaceId]);
    };

    socket.on("activity:new", onNewActivity);

    return () => {
      socket.off("activity:new", onNewActivity);
    };
  }, [spaceId, queryClient]);

  if (isLoading) return <p className="text-sm">Loading...</p>;

  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <ActivityItem key={a._id} activity={a} />
      ))}
    </div>
  );
};

export default ActivityFeed;
