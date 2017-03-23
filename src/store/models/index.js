import { ORM } from 'redux-orm'
import Post from './Post'
import Person from './Person'
import Community from './Community'
import Comment from './Comment'

export const orm = new ORM()
orm.register(Post, Person, Community, Comment)

export default orm
