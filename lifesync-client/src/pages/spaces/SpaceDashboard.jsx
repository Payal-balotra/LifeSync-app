import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMySpaces } from "../../services/space.service";
import SpaceCard from "../../components/spaces/SpaceCard";
import CreateSpaceModal from "../../components/spaces/CreateSpaceModel";
import InvitationsModal from "../../components/spaces/InvitationsModal";
import { useState } from "react";
import { Plus, Layers, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/ui/Skeleton";
import api from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";


const SpacesDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showInvites, setShowInvites] = useState(false);

  const {data: spaces = [], isLoading,refetch,} = useQuery({queryKey: ["spaces"],queryFn: getMySpaces,});

  if (isLoading) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-8 min-h-full">
            <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
 const handleDelete = async (spaceId) => {
  const confirmDelete = window.confirm(
    "This will permanently delete the space. Continue?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(API_PATHS.SPACE.DELETE_SPACE(spaceId));
    toast.success("Space deleted");
    refetch(); // refresh list
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete space");
  }
};



  return (

    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Your Spaces</h2>
          <p className="text-slate-500 mt-1">Manage your projects and collaborations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInvites(true)}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Mail className="w-5 h-5" />
            My Invites
          </button>
          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Space
          </button>
        </div>
      </div>

      {/* Spaces Grid */}
      {spaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {spaces.map((m) => (
            <SpaceCard
              key={m._id}
              role={m.role}
              space={m.spaceId}
              onClick={() => navigate(`/app/spaces/${m.spaceId._id}`)}
              onDelete={()=>{handleDelete(m.spaceId._id)}}
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
                className="cursor-pointer text-indigo-600 font-semibold hover:underline"
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

      <InvitationsModal 
        isOpen={showInvites}
        onClose={() => setShowInvites(false)}
        onInviteAccepted={() => {
           setShowInvites(false);
           refetch();
            toast.success("Invite accepted! Open the space from dashboard.");
        }}
      />
    </div>
  );
};

export default SpacesDashboard;
