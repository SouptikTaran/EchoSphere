const {z} = require('zod')

const userSchema = z.object({
    username : z.string(),
    email : z.string().email() ,
    password : z.string()
})

const userValidSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

const validEmailSchema = z.string().email();

const validPasswordSchema = z.object({
    password : z.string(),
    confirmPassword : z.string(),
})
module.exports = {
    userSchema , userValidSchema , validEmailSchema , validPasswordSchema
}
