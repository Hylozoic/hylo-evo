import { Model, ManyToMany } from 'redux-orm'
import { normalizeEntity } from 'redux-orm/lib/utils'
import { mapValues, uniq, isEmpty, isNull, isUndefined, omitBy, overSome } from 'lodash'

Model.safeGet = function (matchObj) {
  const omittedMatchObj = omitBy(matchObj, overSome([isNull, isUndefined]))
  if (isEmpty(omittedMatchObj)) return null
  return this.get(omittedMatchObj)
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
