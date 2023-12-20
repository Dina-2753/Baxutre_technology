const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require("../Model/userSchema")
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken._id, "token": token });
        console.log("first", rootUser)

        if (!rootUser) { throw new Error('User Not Found') }

        req.token = token;
        req.rootUser = rootUser;
        req.fname = rootUser.fname;
        req.lname = rootUser.lname;
        req.email = rootUser.email;
        req.userID = rootUser._id;
        next();

    } catch (err) {
        res.status(401).send("unauthorized :No token provided");
        console.log(err);
    }

}

module.exports = authenticate;