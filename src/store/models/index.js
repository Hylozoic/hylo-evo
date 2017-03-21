import { ORM } from 'redux-orm'
import Post from './Post'
import Person from './Person'

export const orm = new ORM()
orm.register(Post, Person)

export default orm
