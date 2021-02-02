import { attr, fk, Model } from 'redux-orm'

class Membership extends Model {
  toString () {
    return `Membership: ${this.id}`
  }
}

export default Membership

Membership.modelName = 'Membership'
Membership.fields = {
  id: attr(),
  group: fk('Group', 'memberships'),
  person: fk('Person', 'memberships'),
  newPostCount: attr()
}
