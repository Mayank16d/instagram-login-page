import dotenv from 'dotenv';
import express from 'express';
import connectToDb from './config/db.js';
import userRoute from './route/userRoute.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDb();

app.use('/api/v1', userRoute);


export default app;
