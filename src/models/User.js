import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SECRECT } from '../config/config'
import 'babel-polyfill'
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Please enter username',
        unique: true,
        minlength: 5
    },
    password: {
        type: String,
        minlength: 5,
        required: 'Please Enter Email'
    },
    displayName: {
        type: String
    },
    token: {
        type: String
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todo'
    }],
    createdAt: {
        type: Number
    }
})

UserSchema.methods.generateToken = function () {
    let user = this
    let token = jwt.sign({
        username: user.username,
        createdAt: user.createdAt,
        _id:user._id
    }, SECRECT)
    user.token = token
}

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        let salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        this.save()
    }
    next()
})

UserSchema.statics.login = function ({ username, password }) {
    return User.findOne({
        username: username
    }).then(async user => {
        var check = bcrypt.compareSync(password, user.password)
        if (check === true) {
            return user.token
        } else {
            return "Username or password is wrong"
        }
    })
}



UserSchema.statics.parseToken = async function (token) {
    try {
        var decoded = await jwt.verify(token, SECRECT)
        return decoded
      } catch(err) {
        return {"error":"Invalid token"}
      }
}


UserSchema.statics.generatePassword = async function (password) {
    let salt = await bcrypt.genSalt(10)
    var newPassword = await bcrypt.hash(password, salt)
    return newPassword
}

const User = mongoose.model('user', UserSchema)
module.exports = {
    User
}
