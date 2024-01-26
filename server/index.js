import express from 'express';
import mongoose from 'mongoose';
import { MONGOURI } from './keys.js';
import cors from "cors"
import user from './models/user.js';
import post from './models/post.js'
import router from './routes/auth.js'
import router2 from './routes/post.js'
const app = express();
const PORT =process.env.PORT || 3000;

mongoose.connect(MONGOURI)
mongoose.connection.on("connected",()=>{
    console.log('Connected to Server');
})
mongoose.connection.on("error",(err)=>{
    console.log('Error connecting to Server',err);
})

app.use(express.json())
app.use(cors())
app.use(router)
app.use(router2)

app.get('/', (req, res, next) => {
    res.send("Hello, world!");
})

if(process.env.NODE_ENV == 'production'){
    app.use(express.static("../client/build"))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})

