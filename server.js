require('dotenv').config()

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
    res.json(posts.filter(post => posts.username === req.user.name)) 
})

app.post("/login", (req,res)=>{
    //authenticate user

    const username = req.body.username
    const user = {user: username}

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken})
})

function authenticationToken(req,res,next){
    const header = req.headers['authorization']
    const token = header && header.split[' '][1]
    if (token===null) return res.status(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) return res.status(403)
        req.user = user
        next()
    })
}

app.listen(3000)
