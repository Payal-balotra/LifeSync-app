// src/pages/spaces/SpacesDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMySpaces } from "../../services/space.service";
import SpaceCard from "../../components/spaces/SpaceCard";
import CreateSpaceModal from "../../components/spaces/CreateSpaceModel";
import { useState } from "react";

const SpacesDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const {
    data: spaces = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["spaces"],
    queryFn: getMySpaces,
  });

  if (isLoading) return <p>Loading spaces...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Your Spaces</h2>
        <button onClick={() => setOpen(true)}>+ Create Space</button>
      </div>

      {spaces.map((m) => (
        <SpaceCard
          key={m._id}
          space={m.spaceId}
          onClick={() => navigate(`/app/spaces/${m.spaceId._id}`)}
        />
      ))}

      {open && (
        <CreateSpaceModal
          onClose={() => setOpen(false)}
          onCreated={(spaceId) => {
            setOpen(false);
            refetch(); // refresh spaces list
            navigate(`/app/spaces/${spaceId}`);
          }}
        />
      )}
    </div>
  );
};

export default SpacesDashboard;
