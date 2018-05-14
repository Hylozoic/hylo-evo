import { Model } from 'redux-orm'
import { ManyToMany } from 'redux-orm/lib/fields'
import { normalizeEntity } from 'redux-orm/lib/utils'
import { mapValues, uniq, isEmpty, isNull, isUndefined, omitBy, overSome } from 'lodash'

Model.safeGet = function (matchObj) {
  const omittedMatchObj = omitBy(matchObj, overSome([isNull, isUndefined]))
  if (isEmpty(omittedMatchObj)) return null

  let result
  try {
    result = this.get(omittedMatchObj)
  } catch (e) {
    result = null
  }
  return result
}

Model.prototype.updateAppending = function (attrs) {
  return this.update(mapValues(attrs, (val, key) => {
    if (!val) return val
    const field = this.constructor.fields[key]
    if (!(field && field instanceof ManyToMany)) return val

    const existingIds = this[key].toRefArray().map(x => x.id)
    return uniq(existingIds.concat(val.map(normalizeEntity)))
  }))
}
