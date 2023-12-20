const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: false
    },
    lname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    hobbies: {
        type: String,
        required: false
    },
    userAge: [{
        age: {
            type: Number,
            required: false
        }
    }
    ],

    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
})


userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});


userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        // this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }

    catch (err) {
        console.log(err);
    }
}



const User = mongoose.model('USER', userSchema);

module.exports = User;