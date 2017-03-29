import { each } from 'lodash'
import { fk, many } from 'redux-orm'

import Comment from 'store/models/Comment'
import Community from 'store/models/Community'
import Person from 'store/models/Person'
import Post from 'store/models/Post'
import FeedItem from 'store/models/FeedItem'

export default function transformer (entity, entityType) {
  const fields = [
    Comment,
    Community,
    Person,
    Post,
    FeedItem
  ].reduce(
    (fields, entityClass) => ({ ...fields, [entityClass.modelName]: entityClass.fields }),
    {}
  )

  const transformed = {
    ...entity
  }

  const fkType = fk().constructor.name
  const manyType = many().constructor.name

  if (entityType) {
    each(fields[entityType], (field, fieldName) => {
      if (transformed[fieldName]) {
        switch (field.constructor.name) {
          case fkType:
            transformed[fieldName] = fkTransform(transformed[fieldName])
            break
          case manyType:
            transformed[fieldName] = manyTransform(transformed[fieldName])
            break
        }
      }
    })
  }

  return transformed
}

function fkTransform (entity) {
  return entity.id
}

function manyTransform (entityCollection) {
  return entityCollection.map(entity => entity.id)
}
