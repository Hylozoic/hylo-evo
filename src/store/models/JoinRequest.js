import { attr, fk, many, Model } from 'redux-orm'

export const JOIN_REQUEST_STATUS = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
  Canceled: 3
}

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
  questionAnswers: many('GroupJoinQuestionAnswer'),
  status: attr(),
  updatedAt: attr(),
  user: fk('Person')
}

export class GroupJoinQuestionAnswer extends Model { }
GroupJoinQuestionAnswer.modelName = 'GroupJoinQuestionAnswer'
GroupJoinQuestionAnswer.fields = {
  answer: attr(),
  question: fk('Question', 'joinQuestionAnswers')
}

export class Question extends Model { }
Question.modelName = 'Question'
Question.fields = {
  text: attr()
}
