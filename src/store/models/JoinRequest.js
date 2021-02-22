import { attr, fk, many, Model } from 'redux-orm'

class JoinRequest extends Model {
  toString () {
    return `JoinRequest: ${this.id}`
  }
}

export default JoinRequest

JoinRequest.modelName = 'JoinRequest'
JoinRequest.fields = {
  id: attr(),
  createdAt: attr(),
  group: fk('Group'),
  questionAnswers: many('GroupQuestionAnswer'),
  status: attr(),
  updatedAt: attr(),
  user: fk('Person')
}
