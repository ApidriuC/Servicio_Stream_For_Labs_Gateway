"use strict";
exports.__esModule = true;
var models_1 = require("../models");
var utils_1 = require("../utils");
var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider: function (request, rawJwtToken, done) {
        utils_1.queryVault("/v1/kv/rsa")
            .then(function (data) {
            done(null, data.public);
        })["catch"](function (err) {
            console.log(err.message);
            done(err, null);
        });
    }
};
var jwtStrategy = new JwtStrategy(opts, function (jwt_payload, done) {
    models_1.User.findOne({ email: jwt_payload.email }, function (err, user) {
        console.log("Admin USER: ", user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
});
exports["default"] = jwtStrategy;
