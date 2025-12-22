// src/pages/spaces/SpacesDashboard.jsx
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMySpaces } from "../../services/space.service";
import SpaceCard from "../../components/spaces/SpaceCard";
import CreateSpaceModal from "../../components/spaces/CreateSpaceModel";
import { useState } from "react";
import { Plus, Layers } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading your spaces...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Your Spaces</h2>
          <p className="text-slate-500 mt-1">Manage your projects and collaborations</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Space
        </button>
      </div>

      {/* Spaces Grid */}
      {spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((m) => (
            <SpaceCard
              key={m._id}
              space={m.spaceId}
              onClick={() => navigate(`/app/spaces/${m.spaceId._id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
                <Layers className="w-8 h-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No spaces yet</h3>
            <p className="text-slate-500 max-w-xs mt-2 mb-6">Create your first space to start organizing your tasks and notes.</p>
            <button
                onClick={() => setOpen(true)}
                className="text-indigo-600 font-semibold hover:underline"
            >
                Create a new space
            </button>
        </div>
      )}

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
