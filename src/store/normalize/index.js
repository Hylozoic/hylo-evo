import { each } from 'lodash'
import { fk, many } from 'redux-orm'

import { allFields } from 'store/models'

export default function transformer (entity, entityType) {
  const fields = allFields
  const transformed = {
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
