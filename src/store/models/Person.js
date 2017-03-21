import { attr, Model } from 'redux-orm'

export default class Person extends Model {
  toString () {
    return `Person: ${this.name}`
  }

  static storeRelatedData (personData) {}

  static parse (personData) {
    // this.storeRelatedData(personData)
    // let clonedData = {
    //   ...personData
    // }
    return this.create(personData)
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
