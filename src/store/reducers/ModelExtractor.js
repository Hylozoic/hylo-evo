import { attr, fk, many } from 'redux-orm'
import { mapValues } from 'lodash'

const ATTR_TYPE = attr().constructor.name
const FK_TYPE = fk().constructor.name
const MANY_TYPE = many().constructor.name

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
    this.accumulator.forEach(({ modelName, payload }) => {
      const model = this.session[modelName]
      model.hasId(payload.id)
        ? model.withId(payload.id).update(payload)
        : model.create(payload)
    })
  }

  walk (node, modelName) {
    const model = this.session[modelName]

    const normalized = mapValues(node, (value, key) => {
      const type = model.fields[key]
      if (!type) return value

      switch (type.constructor.name) {
        case FK_TYPE:
          this.walk(value, type.toModelName)
          return value.id
        case MANY_TYPE:
          const items = Array.isArray(value) ? value : value.items
          return items.map(x => {
            this.walk(x, type.toModelName)
            return x.id
          })
        case ATTR_TYPE:
          return value
        default:
          throw new Error(`don't know how to handle type: ${type}`)
      }
    })

    this.accumulator.push({
      modelName: model.modelName,
      payload: normalized
    })
  }
}
