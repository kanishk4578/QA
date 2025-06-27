const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const {generateToken} = require('../utils/generateToken');


const registerUser = async (req,res)=>{
    try {
        let {adhaar,name,email,password}=req.body;

        let users = await userModel.findOne({email});
        if(users) return res.status(401).send("You already have account,Please Login");

        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                   let user = await userModel.create({
                       adhaar,
                       name,
                       email,
                       password:hash,
                   })

                   let token = generateToken(user);
                   res.status(201).json({ token, user });      
            })
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

const loginUser = async (req,res)=>{
    try {
        const { email, password} = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.send("No user found");

    bcrypt.compare(password,user.password,(err,result)=>{
         if(result){
             let token = generateToken(user);
             res.status(200).json({ token, user });
         }
         else{
            res.status(404).send("wrong email password") // <-- If this is called after res.redirect, error will occur
         }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};


const getUserProfile =  (req, res, next) => {
   res.status(200).json(req.user)
}



const profileSetup = async (req, res) => {
  try {
    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get user ID from isLoggedIn middleware
    const userId = req.user.id; // or req.user._id based on how you attach it
    const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update user in DB
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }
    ).select("-password"); // exclude password from response

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
    registerUser,
    loginUser,
    logout,
    getUserProfile,
    profileSetup,
};