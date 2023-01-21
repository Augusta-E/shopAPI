require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');

//const { googleOauth } = require('../../services/auth.service');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

//app.use(session({secret: "mysecret"}))
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true
    })
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); //allow passport to use "express-session"

//google signin function
const googleOauth = async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ password: profile.id });
    if (userEmail) throw new CustomError('user with this email already exist, ');
    if (!user) {
        await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            password: profile.id,
            phoneNumber: '',
            email: profile.emails[0].value,
            isVerified: true
        });
    }
    //if (!user.isVerified) throw new CustomError('Please verify your email to login', 403);
    const token = generateToken({ id: user._id, isAdmin: user.isAdmin });
    return done(null, token);
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/google/callback',
            passReqToCallback: true
        },
        googleOauth
    )
);

//passport route
route.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
route.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

route.get(
    '/google/callback',
    passport.authenticate('google', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    })
);
route.get('/success', (req, res) => res.send(userProfile));
route.get('/error', (req, res) => res.send('error logging in'));
