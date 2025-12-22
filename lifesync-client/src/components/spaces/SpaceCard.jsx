// src/components/spaces/SpaceCard.jsx
const SpaceCard = ({ space, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", padding: 12 }}>
      <h4>{space.name}</h4>
    </div>
  );
};

export default SpaceCard;
