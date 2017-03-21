import { omit } from 'lodash'
import { attr, fk, many, oneToOne, Model } from 'redux-orm'

export default class Community extends Model {
  toString () {
    return `Community: ${this.name}`
  }

  static processRelatedData (communityData) {
    return omit(communityData, [])
  }

  static parse (communityData) {
    let clonedData = this.processRelatedData(communityData)
    clonedData = {
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
