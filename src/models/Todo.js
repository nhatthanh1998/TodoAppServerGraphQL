import mongoose from 'mongoose'
const TodoSchema = new mongoose.Schema({
    name: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Number
    },
    finish: {
        type: Boolean
    }
})
const Todo = mongoose.model('todo', TodoSchema)
module.exports = {
    Todo
}
