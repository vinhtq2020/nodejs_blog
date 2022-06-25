import express from "express";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();
const config = process.env;
app.get('/', (req,res)=>res.send('Hello World!'));
app.listen(config.port,()=>console.log(`listening at port ${config.port}`))