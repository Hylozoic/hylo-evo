import { attr, Model } from 'redux-orm'

export default class Person extends Model {
  toString () {
    return `Person: ${this.name}`
  }
}

Person.modelName = 'Person'

Person.fields = {
  id: attr(),
  name: attr(),
  avatarUrl: attr(),
  bannerUrl: attr(),
  postsTotal: attr()
}
