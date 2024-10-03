import { Attribute, ForeignKey, ManyToMany } from 'redux-orm'
import { compact, filter, mapValues } from 'lodash'
import { isUndefined, omitBy } from 'lodash/fp'

export default class ModelExtractor {
  static addAll ({ session, root, modelName, ...opts }) {
    if (!root) return

    const extractor = new ModelExtractor(session, opts)
    extractor.walk(root, modelName)
    extractor.addAll()
  }

  constructor (session, options = {}) {
    this.session = session
    this.options = options
    this.accumulator = []
  }

  addAll () {
    const method = this.options.append ? 'updateAppending' : 'update'
    this.mergedNodes().forEach(({ modelName, payload }) => {
      const model = this.session[modelName]
      model.idExists(payload.id)
        ? model.withId(payload.id)[method](payload)
        : model.create(payload)
    })
  }

  walk (node, modelName, atRoot = true) {
    if (atRoot) {
      if (Object.prototype.hasOwnProperty.call(node, QUERY_SET_ITEMS_KEY) || Array.isArray(node)) {
        return this._walkMany(node, modelName)
      }
    }

    const model = this.session[modelName]
    if (!model) {
      throw new Error(`no model in session named "${modelName}"`)
    }

    const normalized = omitBy(isUndefined, mapValues(node, (value, key) => {
      let type = model.fields[key]

      if (value && value.__typename) {
        const polymorphicChildId = this._walkOne(value, value.__typename)
        return `${value.__typename}-${polymorphicChildId}`
      }

      if (type instanceof Attribute) {
        return value
      }

      if (type instanceof ForeignKey) {
        return this._walkOne(value, getModelName(type, modelName))
      }

      if (type instanceof ManyToMany) {
        return this._walkMany(value, getModelName(type, modelName))
      }

      if (!type && key in model.prototype) {
        // this is a reverse relation defined by relatedName
        type = model.virtualFields[key]

        if (type instanceof ForeignKey) {
          // each of the related values needs to have a foreign key back to
          // the current value...
          this._walkMany(value, getModelName(type, modelName), { [type.relatedName]: node.id })

          // ...and because the related values store the foreign key, the
          // current value does not need to record anything about the relation,
          // so we return nothing
          return
        }

        if (type instanceof ManyToMany) {
          return this._walkMany(value, getModelName(type, modelName))
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

  _walkOne (value, modelName) {
    if (typeof value !== 'object' || !value) return value
    this.walk(value, modelName, false)
    return value.id
  }

  _walkMany (value, modelName, extraProps) {
    const items = Array.isArray(value) ? value : value[QUERY_SET_ITEMS_KEY]
    return items.map(x => {
      const node = extraProps ? Object.assign(x, extraProps) : x
      this.walk(node, modelName, false)
      return x.id
    })
  }
}

function getModelName (type, parentModelName) {
  return type.toModelName === 'this' ? parentModelName : type.toModelName
}

// This is more complicated than a simple groupBy(modelName + id).map(merge)
// because we need to preserve the order of nodes.
function mergeDuplicates (nodes) {
  const usedIndexes = {}

  // go through all nodes we accumulated from beginning to end and merge
  // duplicates for each one.
  return compact(nodes.map((node, index) => {
    // skip this node if it's already been merged with an earlier one
    if (usedIndexes[index]) return null
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
