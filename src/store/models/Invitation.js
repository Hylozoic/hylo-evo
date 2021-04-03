import { attr, fk, Model } from 'redux-orm'

class Invitation extends Model {
  toString () {
    return `Invitation: ${this.id}`
  }
}

export default Invitation

Invitation.modelName = 'Invitation'
Invitation.fields = {
  id: attr(),
  email: attr(),
  createdAt: attr(),
  creator: fk('Person', 'createdInvites'),
  group: fk('Group', 'pendingInvitations'),
  lastSentAt: attr(),
  resent: attr(),
  token: attr()
}
