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
  lastSentAt: attr(),
  resent: attr(),
  community: fk('Community', 'pendingInvitations')
}
