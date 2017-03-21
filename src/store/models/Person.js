import { omit } from 'lodash'
import { attr, Model } from 'redux-orm'

export default class Person extends Model {
  toString () {
    return `Person: ${this.name}`
  }

  static processRelatedData (personData) {
    return omit(personData, [])
  }

  static parse (personData) {
    let clonedData = this.processRelatedData(personData)
    clonedData = {
      ...personData
    }
    return this.create(clonedData)
  }

  static toJSON () {
    const data = {
      ...this.ref
    }
    return data
  }
}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  name: attr(),
  avatar_url: attr()
}
