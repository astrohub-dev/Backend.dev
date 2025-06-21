import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { googleUser } from "../mongoose/schemas/google-users.mjs";

export default passport.use(
    new Strategy({
        clientID: "789786237638-ksj9rmhabdd4b44jbf7j3n019lgq2i37.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/api/auth/google/redirect",
        scope: ['profile', 'email']
    }, 
    async(accessToken, refreshToken, profile, done) => {
        let findUser;
        try {
            findUser = await googleUser.findOne({googleId: profile.id});
        } catch(err) {
            return done(err, null)
        };

        try{
            if(!findUser) {
                const newUser = new googleUser({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            }
            return done(null, findUser)
        } catch(err) {
            console.log(err)
            return done(err, null)
        };
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try{
        const findUser = await googleUser.findById(id);
        if(!findUser) throw new Error('User not found');
        done(null, findUser)
    } catch (err) {
        done(err, null)
    }
});