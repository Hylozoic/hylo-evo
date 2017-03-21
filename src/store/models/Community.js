import { attr, fk, many, oneToOne, Model } from 'redux-orm'

export default class Community extends Model {
  toString () {
    return `Community: ${this.name}`
  }

  static storeRelatedData (communityData) {
    return {}
  }

  static parse (communityData) {
    this.storeRelatedData(communityData)
    let clonedData = {
      ...communityData
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
Community.modelName = 'Community'
Community.fields = {
  id: attr(),
  name: attr()
}
