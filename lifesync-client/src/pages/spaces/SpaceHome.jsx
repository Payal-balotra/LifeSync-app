import React from 'react'
import { useParams } from "react-router-dom";
import SpaceEditor from '../../components/spaces/SpaceEditor';
 import useMySpaceRole from '../../app/hooks/useMySpaceRole';
const SpaceHome = () => {
const {spaceId} = useParams()
console.log(spaceId)
  const {role,canEdit,isLoading}  = useMySpaceRole(spaceId);
  console.log("role is ",role)
  if (isLoading) {
    return <div>Loading space...</div>;
  }
  return (
    <div className="flex-1 p-4">
      <SpaceEditor
       spaceId={spaceId}
       role = {role}
       canEdit ={canEdit}
       />
    </div>
  )
}

export default SpaceHome