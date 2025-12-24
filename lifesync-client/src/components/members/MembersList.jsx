import MembersRow from "./MembersRow";

const MembersList = ({ members, isOwner, onRemove, onChangeRole }) => {
  if (!members.length) {
    return (
      <div className="text-sm text-slate-500">
        No members found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <MembersRow
          key={member._id}
          member={member}
          isOwner={isOwner}
          onRemove={() => onRemove(member)}
          onChangeRole={() => onChangeRole(member)}
        />
      ))}
    </div>
  );
};

export default MembersList;
