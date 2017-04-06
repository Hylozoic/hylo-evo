import { fk, many, ORM } from 'redux-orm'
import { reduce } from 'lodash/fp'

import Comment from './Comment'
import Community from './Community'
import FeedItem from './FeedItem'
import Me from './Me'
import Membership from './Membership'
import Person from './Person'
import Post, { PostFollower, PostCommenter } from './Post'

// see https://github.com/tommikaikkonen/redux-orm/issues/53 for explanation of
// this weird workaround
function proxyClassForORM (klass) {
  // return klass
  if (!navigator.userAgent.includes('Node.js')) return klass
  return new Proxy(klass, {
    apply (Target, thisArg, rest) {
      return new Target(...rest)
    }
  })
}

export const orm = new ORM()
orm.register(...[
  Comment,
  Community,
  FeedItem,
  Me,
  Membership,
  Person,
  Post,
  PostFollower,
  PostCommenter
].map(proxyClassForORM))

export default orm

const FK_TYPE = fk().constructor.name
const MANY_TYPE = many().constructor.name

// Get all fields for each model that are related to other models.
// For each type return an object with transform functions to normalize
// the type.
export function allRelations () {
  return [
    Comment,
    Community,
    FeedItem,
    Me,
    Membership,
    Person,
    Post
  ].reduce(onlyRelationalFields, {})
}

function onlyRelationalFields (fields, entityClass) {
  const reduceWithKey = reduce.convert({ cap: false })
  const entityRelations = reduceWithKey(includeIfRelation, {})(entityClass.fields)

  return {
    ...fields,
    [entityClass.modelName]: entityRelations
  }
}

// Add field to relations if it's a foreign key or many relationship
function includeIfRelation (relations, field, fieldName) {
  const fieldType = field.constructor.name
  if (fieldType === FK_TYPE) {
    relations[fieldName] = {
      relationType: field.toModelName,
      transform: fkTransform
    }
  }
  if (fieldType === MANY_TYPE) {
    relations[fieldName] = {
      relationType: field.toModelName,
      transform: manyTransform
    }
  }
  return relations
}

function fkTransform (entity) {
  return entity.id
}

function manyTransform (entityCollection) {
  return entityCollection.map(entity => entity.id)
}
