import express from 'express';
import cookieParser from 'cookie-parser';   
import session from 'express-session';
import usersRouter from './routes/users.mjs';
import p2pRouter from './routes/cryptocurrencies.mjs';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import "./strategies/local-strategy.mjs"
import { createApp } from './createApp.mjs';
//import "./strategies/google-strategy.mjs"

mongoose.connect('mongodb://localhost:27017/backend-dev-DB')
    .then(() => console.log('Connected to DataBase')) 
    .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});