const express = require('express');
const app = express();
const { models: { User }} = require('./db');
const path = require("path");
app.use(express.json());

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

//user posts their information in the form

app.post('/api/auth', async(req, res, next)=>{
    try {
        res.send({ token: await User.authenticate(req.body)})
    }
    catch(ex){
        next(ex)
    }
})

//check and see if the user exists in the server
app.get('/api/auth', async(req, res, next)=>{
    try {
        res.send(await User.byToken(req.headers.authorization));
        res.send(await User.authenticate(req.body));
    }
    catch(ex){
        next(ex)
    }
})



module.exports = app;