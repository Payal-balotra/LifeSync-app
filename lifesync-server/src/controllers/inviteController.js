const Invite = require("../models/Invite");
const MemberShip = require("../models/MemberShip");


const sendInvite= async(req,res)=>{
   const {email,role} = req.body;
   const {spaceId} = req.params;

    if (!email || !role) {
    return res.status(400).json({ message: "Email and role required" });
  }

  const existingInvite = await Invite.findOne({
    email,
    spaceId,
    status: "pending",
  })

  
  if (existingInvite) {
    return res.status(400).json({ message: "Invite already sent" });
  }

  const invite = await Invite.create({
    email ,
    spaceId,
    role,
    invitedBy :req.user.id
  })

// email sending will come later
  res.status(201).json(invite);
}


const acceptInvite = async(req,res)=>{
    const invite =  await Invite.findById(req.params.inviteId);

    if(!invite || !invite.status == "pending"){
            return res.status(400).json({ message: "Invalid invite" });

    }

    // create membership 

    await MemberShip.create({
        userId : req.user.id,
        spaceId : invite.spaceId,
        role : invite.role
    })
      invite.status = "accepted";
  await invite.save();

  res.json({ message: "Invite accepted" });

}

const rejectInvite = async (req, res) => {
  const invite = await Invite.findById(req.params.inviteId);

  if (!invite || invite.status !== "pending") {
    return res.status(400).json({ message: "Invalid invite" });
  }

  invite.status = "rejected";
  await invite.save();

  res.json({ message: "Invite rejected" });
};


module.exports = {sendInvite,acceptInvite,rejectInvite}


