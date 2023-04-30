const express = require ('express')
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json())

const posts = [
    {
    username:"Roshay",
    title:"Post 1"
},
{
    username:"Davit",
    title:"Post 2"
}
]

app.get("/posts", (req,res)=>{
    res.json(posts)
})

app.post("/", (req,res)=>{
    //authenticate user

    const username = req.body.username
    const user = {user: username}

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

})

app.listen(3000)
