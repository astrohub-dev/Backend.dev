import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/users.mjs";
import { comparePassword } from "../utils/helpers.mjs";

export default passport.use(
    new Strategy(async(username, password, done) => {
        try{
            const findUser = await User.findOne({username});
            if(!findUser) throw new Error('User not found');
            if(!comparePassword(password, findUser.password)) throw new Error('Invalid password');

            done(null, findUser);
        } catch (err) {
            done(err, null)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try{
        const findUser = await User.findById(id);
        if(!findUser) throw new Error('User not found');
        done(null, findUser)
    } catch (err) {
        done(err, null)
    }
});