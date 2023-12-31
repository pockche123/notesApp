const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken")
const User = require("../models/User")

// @desc auth user/set token
// route POST /users/auth
// @access public
const authUser = asyncHandler(async (req, res) => {
    const {email, password} =  req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        // await generateToken(res, user._id);

        const token = await generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token,
        });
    } else {
        res.status(401).json({message: "Invalid email or password"});
        // throw new Error("Invalid email or password")
    }
})

// @desc Register a new user
// route POST /users
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400).json({message: "User already exists"});
        // throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400).json({message: "Invalid user Data"});
        // throw new Error("Invalid user data")
    }
})

// @desc Logout user
// route POST /users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })

    res.status(200).json({message: "User logged out"})
})

// @desc Get user profile
// route GET /users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.body.user._id,
        name: req.body.user.name,
        email: req.body.user.email,
    };
    console.log(user)

    res.status(200).json(user);
})

// @desc Update user profile
// route PATCH /users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user  =  await User.findById(req.body._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });

    }else{
        res.status(404).json({message:"User not found"});
        // throw new Error("User not found")
    }
})

module.exports = {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}
