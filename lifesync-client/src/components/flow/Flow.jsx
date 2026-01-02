import React from "react";
import SpaceFlow from "./SpaceFlow";
import useMySpaceRole from "../../app/hooks/useMySpaceRole";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const Flow = () => {
  const { spaceId } = useParams();
  const { role, canEdit, isLoading } = useMySpaceRole(spaceId);
    console.log(role)
  if (isLoading) {
    return <div>Loading flow...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full"
    >
      <SpaceFlow spaceId={spaceId} role={role} canEdit ={canEdit}/>
    </motion.div>
  );
};

export default Flow;
