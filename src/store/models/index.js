import { ORM } from 'redux-orm'
import Post from './Post'
import Person from './Person'
import Community from './Community'

export const orm = new ORM()
orm.register(Post, Person, Community)

export default orm
