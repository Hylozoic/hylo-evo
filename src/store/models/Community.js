import { omit } from 'lodash'
import { attr, Model } from 'redux-orm'

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
}

Community.modelName = 'Community'

Community.fields = {
  id: attr(),
  name: attr()
}
