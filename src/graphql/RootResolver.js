import Scalar from './scalar/resolver'
import {Query as TodoQuery,Mutation as TodoMutaiton} from './todos/resolver'
import {Query as UserQuery,Mutation as UserMutation} from './users/resolver'
export default {
    ...Scalar,
    Query:{
        ...TodoQuery,
        ...UserQuery
    },
    Mutation:{
        ...TodoMutaiton,
        ...UserMutation
    }
}