import { attr, fk, many, Model } from 'redux-orm'

export class MembershipAgreement extends Model { }
MembershipAgreement.modelName = 'MembershipAgreement'
MembershipAgreement.fields = {
  id: attr(),
  accepted: attr()
}

class Membership extends Model {
  toString () {
    return `Membership: ${this.id}`
  }
}

Membership.modelName = 'Membership'
Membership.fields = {
  id: attr(),
  agreements: many('MembershipAgreement'),
  group: fk('Group', 'memberships'),
  hasModeratorRole: attr(),
  lastViewAt: attr(),
  newPostCount: attr(),
  person: fk('Person', 'memberships'),
  settings: attr()
}

export default Membership
