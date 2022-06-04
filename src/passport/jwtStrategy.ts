import { User } from '../models';
import { queryVault } from '../utils'
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;


const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider:(request: any, rawJwtToken: any, done: any) => {
        queryVault("/v1/kv/rsa")
        .then((data:any ) => {
            done(null, data.public)
        })
        .catch(err  => {
            console.log(err.message)
            done(err, null)
        })
    }
}


const jwtStrategy = new JwtStrategy(opts, function(jwt_payload: any, done: Function) {
    
    User.findOne({ email: jwt_payload.email}, function(err, user) {
        console.log("Admin USER: ", user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
})

export default jwtStrategy