import express, {json} from 'express';
import {adminRoute} from './ROUTER/adminroutes.js'
import { userRoute } from './ROUTER/userroutes.js';
import dotenv from 'dotenv';
import cookieParser  from 'cookie-parser'; //


dotenv.config();
const app=express();

app.use(json())
app.use(cookieParser());
app.use('/',adminRoute)
app.use('/',userRoute)

const port =process.env.Port;   

app.listen(port,()=>{
    console.log(`Serevr is Listening to ${port} `)
});





