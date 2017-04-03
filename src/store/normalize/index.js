import { each } from 'lodash'
import { fk, many } from 'redux-orm'

import Comment from 'store/models/Comment'
import Community from 'store/models/Community'
import Person from 'store/models/Person'
import Post from 'store/models/Post'
import FeedItem from 'store/models/FeedItem'

export default function normalize (entity, entityType) {
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

  const normalized = {
    ...entity
  }

  const fkType = fk().constructor.name
  const manyType = many().constructor.name

  if (entityType) {
    each(fields[entityType], (field, fieldName) => {
      if (normalized[fieldName]) {
        switch (field.constructor.name) {
          case fkType:
            normalized[fieldName] = fkNormalize(normalized[fieldName])
            break
          case manyType:
            normalized[fieldName] = manyNormalize(normalized[fieldName])
            break
        }
      }
    })
  }

  return normalized
}

function fkNormalize (entity) {
  return entity.id
}

function manyNormalize (entityCollection) {
  return entityCollection.map(entity => entity.id)
}
