import { User } from "../../models/User";
import 'babel-polyfill'
async function modifyUserInput(input) {
    var modifiedInput = {}
    if (input.password) {
        modifiedInput = {
            ...modifiedInput,
            password: await User.generatePassword(input.password)
        }
    } if (input.displayName) {
        modifiedInput = {
            ...modifiedInput,
            displayName: input.displayName
        }
    }
    return modifiedInput
}



export const Query = {
    async user(_, agrs, context) {
        console.log(context)
        return await User
            .findByID(context.user._id)
            .populate('todos')
            .lean()
    }
}

export const Mutation = {
    async registerUser(_, { userInput }) {
        var newUser = await User.create({
            username: userInput.username,
            password: userInput.password,
            displayName: userInput.displayName,
            createdAt: new Date().getTime(),
            todos: []
        })

        await newUser.generateToken()
        await newUser.save()
        return newUser.token
    },

    async updateUser(_, { userInput }) {
        if (userInput.token) {
            var parseUser = await User.parseToken(userInput.token)
            if (parseUser.error === "Invalid token") {
                throw new Error("Invalid token")
            }
            const user = await User.findByIdAndUpdate(parseUser._id, {
                $set: { ...modifyUserInput(userInput) }
            }, { new: true })
            return user
        }else{
            throw new Error("Not Login")
        }
    },

    async Login(_, { loginInput }) {
        return await User.login(loginInput)
    }
}