const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/posts");
const LoginUser = require('../models/userLogin')
const { tokenValidity } = require('../middlewares/jwtMiddleware')

// Ensure upload directory exists
const createUploadDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const user = req.user.username;
        const uploadDir = path.join(__dirname, '..', 'uploads', user);
        createUploadDir(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const user = req.user.username;
        const name = "profilePicture";
        const uniqueSuffix = name + "-" + user + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const storagePost = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        const user = req.user.username;
        const uploadDir = path.join(__dirname , '..' , 'uploads' , user , 'posts');
        createUploadDir(uploadDir)
        cb(null , uploadDir)
    } ,
    filename :(req , file , cb)=>{
        const user = req.user.username;
        const uniqueSuffix = user + "-post-" +Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});
// Multer upload configuration
const upload = multer({
    storage: storage,
});

const uploadPost = multer({storage : storagePost});

// GET route to render the upload form
router.get("/profile", tokenValidity, (req, res) => {
    res.render("upload");
});

// POST route to handle file upload
router.post("/profile", tokenValidity, upload.single('profileImage'), async (req, res) => {
    const email = req.user.email;
    console.log("profile : ", req.user.email);
    try {

        // Find user by email
        const user = await User.findOne({ email });
        const userLogin = await LoginUser.findOne({ email })
        console.log("USERS : ", user, userLogin)

        if (!user && !userLogin) {
            return res.status(404).json('User not found');
        }
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json('File is required');
        }
        const profilePicPath = '/' + user.username + '/' + req.file.filename;

        // Update user profile picture path
        await user.updateOne({
            email: req.body.email,
            profilePic: profilePicPath,
        })
        await userLogin.updateOne({
            email: req.body.email,
            profilePic: profilePicPath,
        })

        res.status(200).json({ success: true, msg: 'File uploaded and user profile updated successfully', newImageUrl: profilePicPath });
    } catch (err) {
        console.error('Error saving post:', err);
        res.status(500).send('Error saving post: ' + err.message);
    }
});

router.post('/userpost', tokenValidity, uploadPost.single("avatar"),async (req, res) => {
    const email = req.user.email;
    console.log(req.user);
    try {
        const user = await Post.findOne({ email });
        if (!user) {
            return res.json('User Not Found');
        }
        
        const postPath = '/' + req.user.username + '/' + 'posts' + '/' + req.file.filename;
        console.log(postPath);
        console.log("user : " , user);
        user.posts.push(postPath);
        await user.save();
        res.status(200).json({ success: true, msg: 'Post Uploded successfully', newImageUrl: postPath });
    }
    catch(error) {
        res.json({ success: false, msg: 'Post Upload Unsuccessfull'});
    }
})

module.exports = router;
