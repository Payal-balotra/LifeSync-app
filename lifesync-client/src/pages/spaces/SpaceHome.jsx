import React from 'react'
import { useParams } from "react-router-dom";
import SpaceEditor from '../../components/spaces/SpaceEditor';

const SpaceHome = () => {
const spaceId = useParams()
  
  return (
    <div className="flex-1 p-4">
      <SpaceEditor spaceId={spaceId} />
    </div>
  )
}

export default SpaceHome