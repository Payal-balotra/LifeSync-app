import React from "react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createSpace } from "../../services/space.service";

const CreateSpaceModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: createSpace,
    onSuccess: (space) => {
      onCreated(space._id);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name });
  };

  return (
    <div className="modal">
      <h3>Create Space</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Space name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpaceModal;
