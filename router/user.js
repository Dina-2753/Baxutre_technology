const User = require("../Model/userSchema")
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
const { MongoClient, ObjectId } = require('mongodb');


// Add user here.
router.post('/register', async (req, res) => {
    try {
        const { fname, lname, email, password, cpassword, state, city } = req.body;


        if (!fname || !lname || !email || !password || !cpassword || !state || !city) {
            return res.status(400).json({ error: "All details to be filled ! ....." })
        }

        User.findOne({ email: email })
            .then((userexist) => {
                if (userexist) {
                    return res.status(422).json({ error: "Email Already exists" });

                } else if (password != cpassword) {
                    return res.status(400).json({ error: "password does match" });
                }

                const user = new User({ fname, lname, email, password, cpassword, state, city });
                user.save().then(() => {

                    return res.status(201).json({ message: "user registered succesfully" });

                }).catch((err) => res.status(500).json({ error: "Failed to Register" }));

            }).catch(err => { console.log(err); });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

//login user here..
router.post('/login', async (req, res) => {
    try {
        if (req.cookies.jwtoken) return res.status(200).json({
            "message": "token already exists"
        })

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Plz fill the data" })
        }
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)

            if (!isMatch) {
                return res.status(400).json({ error: "Invlalid Credentials" });
            } else {
                const token = await userLogin.generateAuthToken();

                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                });
                await User.updateOne({ email: email }, { $set: { token: token } }, { multi: true })
                return res.json({ message: "user login succesfully" });
            }
        } else {
            return res.status(400).json({
                error: "Invlalid Credentials"
            });
        }


    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

//Get all user from database
router.get("/api/all_users", authenticate, async (req, res) => {

    try {
        const user = await User.find({})
        if (user) {
            return res.status(200).send(user)
        } else {
            return res.status(200).send({ message: "no records." })
        }

    } catch (error) {
        res.status(500).json("error", error)
    }
})

//find signle user with their unique id
router.post("/api/get_users/:id", authenticate, async (req, res) => {

    try {
        const userId = req.rootUser._id;
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})


//update user here..
router.post('/api/users_update/:userId', authenticate, async (req, res) => {
    const userId = req.params.userId;
    const { state, city } = req.body;
    try {

        if (!state || !city) {
            return res.status(400).json({ error: 'fill data...' });
        }
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }


        const existingUser = await User.findOne({ _id: userId });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        else {
            await User.updateOne({ _id: userId }, { $set: { state, city } });
            const updatedUser = await User.findOne({ _id: userId });
            return res.status(200).json(updatedUser);
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});









module.exports = router