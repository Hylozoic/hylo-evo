import { fk, many, ORM } from 'redux-orm'
import { reduce } from 'lodash/fp'

import Comment from './Comment'
import Community from './Community'
import FeedItem from './FeedItem'
import Person from './Person'
import Post, { PostFollower } from './Post'

export const orm = new ORM()
orm.register(
  Comment,
  Community,
  FeedItem,
  Person,
  Post,
  PostFollower
)

export default orm

// Get all fields for each model that are related to other models.
// For each type return an object with transform functions to normalize
// the type.
// TODO: consider moving the transforms inside each model.
export function allRelations () {
  return [
    Comment,
    Community,
    FeedItem,
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

const FK_TYPE = fk().constructor.name
const MANY_TYPE = many().constructor.name

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
