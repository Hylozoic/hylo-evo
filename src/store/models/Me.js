import { attr, many, Model } from 'redux-orm'

export default class Me extends Model {
  toString () {
    return `Me: ${this.name}`
  }
}

Me.modelName = 'Me'
Me.fields = {
  name: attr(),
  posts: many('Post'),
  memberships: many('Membership')
}
