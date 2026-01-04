import React from "react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../services/axios";
import { API_PATHS } from "../../services/apiPaths";
import useAuthStore from "../../store/authStore";

const AcceptInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();

  const [error, setError] = useState(null);
  const isProcessing = React.useRef(false);

  useEffect(() => {
    if (loading || isProcessing.current) return;
    if (!user) {
      navigate(`/?invite=${token}`);
      return;
    }
    const acceptInvite = async () => {
      isProcessing.current = true;
      try {
        const res = await axios.post(
          `${API_PATHS.INVITE.ACCEPT}?token=${token}`,
          {},
          { withCredentials: true }
        );

        const spaceId = res.data.spaceId;

        // 🚀 Redirect to space
        navigate(`/app/spaces/${res.data.spaceId}`);
      } catch (error) {
        console.error("Invite accept failed:", error);
        setError(error.response?.data?.message || "Failed to accept invite");
        isProcessing.current = false;
        // navigate("/invalid-invite"); // Removed to show error on screen
      }
    };

    acceptInvite();
  }, [user, loading, token]);

  if (error) {
    return (
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
            <h3>Invitation Failed</h3>
            <p>{error}</p>
            <button 
                onClick={() => navigate('/app/spaces')}
                style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
                Go to Spaces
            </button>
        </div>
    )
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h3>Accepting invite...</h3>
      <p>Please wait</p>
    </div>
  );
};

export default AcceptInvitePage;
