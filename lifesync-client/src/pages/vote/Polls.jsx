import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getPolls, votePoll, createPoll } from "../../services/polls.service";
import useSpaceSocket from "../../app/hooks/useSpaceSocket";
import useMySpaceRole from "../../app/hooks/useMySpaceRole";
import PollCard from "./PollCard";
import CreatePollModal from "./CreatePollModal";
import {toast} from "react-hot-toast";

const Polls = () => {
     const { spaceId } = useParams();
  const [open, setOpen] = useState(false);

  // 🔑 role hook (you already have this)
  const { role, isOwner, isEditor } = useMySpaceRole(spaceId);
  const canCreate = isOwner || isEditor;

  // polls query
  const { data: polls = [], refetch } = useQuery({
    queryKey: ["polls", spaceId],
    queryFn: () => getPolls(spaceId),
    enabled: !!spaceId,
  });

  // socket events (memoized)
  const events = useMemo(
    () => ({    
      "poll-updated": refetch,
    }),
    [refetch]
  );

  useSpaceSocket({ spaceId, events });

  // vote handler
 const handleVote = async (pollId, optionId) => {
  try {
    await votePoll(pollId, optionId);
  } catch (err) {
    console.log("VOTE ERROR:", err.response?.data); // DEBUG

    const message =
      err.response?.data?.message || "You have already voted";

    toast.error(message);
  }
};

  // create handler
 const handleCreatePoll = async (data) => {
  try {
    await createPoll(spaceId, data);
    refetch(); // optional, socket will also update
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="p-6 space-y-4">
      {/* Create button */}
      {canCreate && (
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg cursor-pointer"
        >
          + Create Poll
        </button>
      )}

      {/* Poll list */}
      {polls.map((poll) => (
        <PollCard
          key={poll._id}
          poll={poll}
          onVote={handleVote}
        />
      ))}

      {/* Create modal */}
      <CreatePollModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreatePoll}
      />
    </div>
  );
};

export default Polls;
