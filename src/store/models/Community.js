import { attr, Model } from 'redux-orm'

export default class Community extends Model {
  toString () {
    return `Community: ${this.name}`
  }
}

Community.modelName = 'Community'

Community.fields = {
  id: attr(),
  name: attr()
}
