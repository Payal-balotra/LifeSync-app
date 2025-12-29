import { useQuery } from "@tanstack/react-query";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore";

export default function useMySpaceRole(spaceId) {
  const { user } = useAuthStore();

  const isValidSpaceId =
    typeof spaceId === "string" && spaceId.length > 0;

  const {
    data: members = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["space-members-role", spaceId],
    queryFn: async () => {
      const res = await api.get(
        API_PATHS.SPACE.GET_SPACE_MEMBERS(spaceId)
      );
      return res.data;
    },
    enabled: isValidSpaceId && !!user,
  });

  // ⛔ while loading, role is unknown
  if (isLoading || isFetching || !user) {
    return {
      role: undefined,
      isOwner: false,
      isEditor: false,
      canEdit: false,
      isLoading: true,
    };
  }

  const myMembership = members.find(
    (m) => m.userId?._id === user._id
  );

  const role = myMembership?.role;
console.log("MEMBERS:", members);
console.log("USER:", user);
console.log("ROLE:", role);

  return {
    role, // "owner" | "editor" | "viewer"
    isOwner: role === "owner",
    isEditor: role === "editor",
    canEdit: role === "owner" || role === "editor",
    isLoading: false,
  };
}
