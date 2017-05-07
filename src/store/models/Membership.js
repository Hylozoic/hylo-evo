import { attr, fk, Model } from 'redux-orm'

const Membership = Model.createClass({
  toString () {
    return `Membership: ${this.id}`
  }
})

export default Membership

Membership.modelName = 'Membership'
Membership.fields = {
  id: attr(),
  community: fk('Community', 'memberships'),
  newPostCount: attr()
}
