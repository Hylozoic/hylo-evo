import { Model } from 'redux-orm'
import { ManyToMany } from 'redux-orm/lib/fields'
import { normalizeEntity } from 'redux-orm/lib/utils'
import { mapValues, uniq } from 'lodash'

Model.prototype.updateAppending = function (attrs) {
  return this.update(mapValues(attrs, (val, key) => {
    if (!val) return val
    const field = this.constructor.fields[key]
    if (!(field && field instanceof ManyToMany)) return val

    const existingIds = this[key].toRefArray().map(x => x.id)
    return uniq(existingIds.concat(val.map(normalizeEntity)))
  }))
}
