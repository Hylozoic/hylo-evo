import { attr, fk, Model } from 'redux-orm'

const JoinRequest = Model.createClass({
  toString () {
    return `JoinRequest: ${this.id}`
  }
})

export default JoinRequest

JoinRequest.modelName = 'JoinRequest'
JoinRequest.fields = {
  id: attr(),
  user: fk('Person'),
  community: fk('Community'),
  createdAt: attr(),
  updatedAt: attr(),
  status: attr()
}
