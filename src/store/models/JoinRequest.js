import { attr, fk, Model } from 'redux-orm'

class JoinRequest extends Model {
  toString () {
    return `JoinRequest: ${this.id}`
  }
}

export default JoinRequest

JoinRequest.modelName = 'JoinRequest'
JoinRequest.fields = {
  id: attr(),
  user: fk('Person'),
  group: fk('Group'),
  createdAt: attr(),
  updatedAt: attr(),
  status: attr()
}
