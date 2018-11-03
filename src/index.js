import express from "express"
import GraphqlHTTP from 'express-graphql'
import mongoose from './database/mongoose'
import schema from './graphql'
import { PORT, SECRECT } from './config/config'
var app = express()


app.use('/graphql', GraphqlHTTP({
    graphiql: true,
    schema: schema,
}
))
app.listen(PORT, () => {
    console.log("Server is start on PORT:" + PORT)
})