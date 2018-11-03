import { Todo } from '../../models/Todo'
import { User } from '../../models/User'
import 'babel-polyfill'
function modifyCriteria(criteria) {
    var modifiedCriteria = {}
    if (criteria._id) {
        modifiedCriteria = {
            ...modifiedCriteria,
            _id: criteria._id
        }
    }
    if (criteria.name) {
        modifiedCriteria = {
            ...modifiedCriteria,
            name: criteria.name
        }
    }
    if (criteria.author) {
        modifiedCriteria = {
            ...modifiedCriteria,
            author: criteria.author
        }
    }
    if (criteria.createdAt) {
        modifiedCriteria = {
            ...modifiedCriteria,
            createddAt: criteria.createdAt
        }
    }
    if (criteria.finish) {
        modifiedCriteria = {
            ...modifiedCriteria,
            finish: criteria.finish
        }
    }
    return modifiedCriteria
}
export const Query = {

    async todo(_, { _id }) {
        return await Todo.findById(_id).populate('author').lean()
    },
    async todos(_, { criteria, skip, limit }) {

        if (criteria.token) {
            var parseUser = await User.parseToken(criteria.token)
            if (parseUser.error === "Invalid token") {
                throw new Error("Invalid token")
            }
            criteria.author = parseUser._id
            return await Todo
                .find(...modifyCriteria(criteria))
                .populate('author')
                .skip(skip)
                .limit(limit)
                .lean()
        } else {
            throw new Error("Not Login")
        }
    }
}


export const Mutation = {
    async addTodo(_, { todo }) {
        if (todo.token) {
            var parseUser = await User.parseToken(todo.token)
            if (parseUser.error === "Invalid token") {
                throw new Error("Invalid token")
            }
            todo.author = parseUser._id
            var newTodo = Todo.create(...todo)
            var user = await User.findById(todo.author)
            user.todos.push(newTodo)
            await user.save()
            return newTodo

        } else {
            throw new Error("Not Login")
        }
    },
    async updateTodo(_, { todo }) {
        if (todo.token) {
            var parseUser = await User.parseToken(todo.token)
            if (parseUser.error === "Invalid token") {
                throw new Error("Invalid token")
            }
            todo.author = parseUser._id
            var getTodo = await Todo.findById(todo._id).lean()
            if (getTodo.author === parseUser._id) {
                return Todo.findByIdAndUpdate(todo._id, {
                    $set: {
                        name: todo.name,
                        finish: todo.finish
                    }
                }, { new: true })
            } else {
                throw new Error("Not author")
            }

        } else {
            throw new Error("Not Login")
        }
    },
    async deleteTodo(_, { todoID, token }) {
        if (token) {
            var parseUser = await User.parseToken(token)
            if (parseUser.error === "Invalid token") {
                throw new Error("Invalid token")
            }
            todo.author = parseUser._id
            var getTodo = await Todo.findById(todoID).lean()
            if (getTodo.author === parseUser._id) {
                return await Todo.findByIdAndRemove(todoID)
            } else {
                throw new Error("Not author")
            }
        } else {
            throw new Error("Not Login")
        }
    }
}