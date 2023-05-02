require('dotenv').config()

const express = require ('express')
const app = express()

const jwt = require('jsonwebtoken')
app.use(express.json())


app.get("/posts",authenticateToken, (req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name)) 
})

let refreshTokens = []  //in production, we would use database and not an empty array.

app.delete("/logout", (req,res)=>{
    refreshTokens.filter(token =>token != res.body.token)
    res.sendStatus(204)
})


app.post("/login", (req,res)=>{
    //authenticate user

    const username = req.body.username
    const user = {name: username}

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken:accessToken, refreshToken:refreshToken})
})


app.post("/token", (req,res)=>{
    const refreshToken = req.body.token
    if (refreshToken === null) return res.sendStatus(401)
    if (!refreshTokens.include(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({name : user.name})
    res.json({accessToken:accessToken})
    })
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, expiresIn='10s')
}

function authenticateToken(req,res,next){
    const header = req.headers['authorization']
    const token = header && header.split(' ')[1]
    if (token===null) return res.status(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if (err) return res.status(403)
        req.user = user
        next()
    })
}

app.listen(3000)
