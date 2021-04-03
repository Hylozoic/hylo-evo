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
  hasModeratorRole: attr(),
  lastViewAt: attr(),
  newPostCount: attr(),
  person: fk('Person', 'memberships'),
  settings: attr()
}
