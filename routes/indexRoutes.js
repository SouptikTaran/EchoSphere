const router = require("express").Router()
const userRoutes = require("./user")
const postRoutes = require("./post")


router.get("/" , (req , res)=>{
    res.status(200).render("home");
})

router.use("/user" , userRoutes);
router.use("/post" , postRoutes);



module.exports = router ;