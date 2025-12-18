const User = require("../models/UserSchema")

const getMe =async(req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
}

module.exports = getMe