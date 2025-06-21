import express from 'express';
import cookieParser from 'cookie-parser';   
import session from 'express-session';
import usersRouter from './routes/users.mjs';
import p2pRouter from './routes/cryptocurrencies.mjs';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import "./strategies/local-strategy.mjs"
//import "./strategies/google-strategy.mjs"

export function createApp(){
    const app = express();
    app.use(express.json()) //app.use() is used for enabling middleware functions globally.
    app.use(cookieParser('dxx13q'));
    app.use(session({
        secret: '27xynn',
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use([usersRouter, p2pRouter]);

    app.post("/api/auth", passport.authenticate('local'), (req, res) => {
        res.sendStatus(200);
    });

    app.get("/api/auth/status", (req, res) => {
        return req.user ? res.send(req.user) : res.sendStatus(401);
    });

    app.post("/api/auth/logout", (req, res) => {
        if(!req.user) return res.sendStatus(401);

        req.logout((err) => {
            return err ? res.sendStatus(401) : res.sendStatus(200)
        })
    });

    app.get("/api/auth/google", passport.authenticate('google'), (req, res) => {
        res.sendStatus(200);
    });

    app.get("/api/auth/google/redirect", passport.authenticate('google'), (req, res) => {
        return res.status(200).send('Logged in successfully')
    });
    return app;
}