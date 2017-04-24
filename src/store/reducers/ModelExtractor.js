import { Attribute, ForeignKey, ManyToMany } from 'redux-orm/lib/fields'
import { compact, filter, mapValues } from 'lodash'
import { isUndefined, omitBy } from 'lodash/fp'

export default class ModelExtractor {
  static addAll ({ session, root, modelName }) {
    const extractor = new ModelExtractor(session)
    extractor.walk(root, modelName)
    extractor.addAll()
  }

  constructor (session) {
    this.session = session
    this.accumulator = []
  }

  addAll () {
    this.mergedNodes().forEach(({ modelName, payload }) => {
      const model = this.session[modelName]
      model.hasId(payload.id)
        ? model.withId(payload.id).updateAppending(payload)
        : model.create(payload)
    })
  }

  walk (node, modelName) {
    if (Array.isArray(node)) {
      return node.forEach(x => this.walk(x, modelName))
    }

    const model = this.session[modelName]

    const normalized = omitBy(isUndefined, mapValues(node, (value, key) => {
      var type = model.fields[key]

      if (type instanceof Attribute) {
        return value
      }

      if (type instanceof ForeignKey) {
        return this._walkOne(value, type)
      }

      if (type instanceof ManyToMany) {
        return this._walkMany(value, type)
      }

      if (!type && key in model.prototype) {
        // this is a reverse relation defined by relatedName
        type = model.virtualFields[key]

        if (type instanceof ForeignKey) {
          // each of the related values needs to have a foreign key back to
          // the current value...
          this._walkMany(value, type, {[type.relatedName]: node.id})

          // ...and because the related values store the foreign key, the
          // current value does not need to record anything about the relation,
          // so we return nothing
          return
        }

        if (type instanceof ManyToMany) {
          return this._walkMany(value, type)
        }
      }

      if (!type) return value
      throw new Error(`don't know how to handle type: ${type}`)
    }))

    if (normalized.id) {
      this.accumulator.push({
        modelName: model.modelName,
        payload: normalized
      })
    }
  }

  mergedNodes () {
    return mergeDuplicates(this.accumulator)
  }

  _walkOne (value, type) {
    if (typeof value !== 'object') return value
    this.walk(value, type.toModelName)
    return value.id
  }

  _walkMany (value, type, extraProps) {
    const items = Array.isArray(value) ? value : value[QUERY_SET_ITEMS_KEY]
    return items.map(x => {
      this.walk(extraProps ? Object.assign(x, extraProps) : x, type.toModelName)
      return x.id
    })
  }
}

// This is more complicated than a simple groupBy(modelName + id).map(merge)
// because we need to preserve the order of nodes.
function mergeDuplicates (nodes) {
  const usedIndexes = {}

  // go through all nodes we accumulated from beginning to end and merge
  // duplicates for each one.
  return compact(nodes.map((node, index) => {
    // skip this node if it's already been merged with an earlier one
    if (usedIndexes[index]) return
    const { modelName, payload: { id } } = node

    // find nodes later in the list that have the same model name and ID,
    // collect them, and mark them to be skipped later
    const duplicates = filter(nodes, (other, index2) => {
      if (index2 > index &&
        other.modelName === modelName && other.payload.id === id) {
        usedIndexes[index2] = true
        return true
      }
    })

    if (duplicates.length === 0) return node

    // merge all the payloads into a new one.
    // we don't use lodash.merge here because it merges arrays by
    // concatenating them, and we don't need its "deep" behavior since these
    // nodes are already normalized.
    const payloads = [{}, node.payload].concat(duplicates.map(d => d.payload))
    return {
      modelName,
      payload: Object.assign.apply(null, payloads)
    }
  }))
}

// this is the key under which our GraphQL API stores the list of items for
// "query-set style" pagination, e.g.:
//
//   person(id: 2) {
//     posts(first: 3) {
//       hasMore
//       items {
//         id
//         title
//       }
//     }
//   }
//
const QUERY_SET_ITEMS_KEY = 'items'
