import { attr, Model } from 'redux-orm'

const Invitation = Model.createClass({
  toString () {
    return `Invitation: ${this.id}`
  }
})

export default Invitation

Invitation.modelName = 'Invitation'
Invitation.fields = {
  id: attr(),
  email: attr(),
  created_at: attr(),
  last_sent_at: attr(),
  resent: attr()
}
