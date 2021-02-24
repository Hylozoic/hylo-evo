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
  questionAnswers: many('JoinRequestQuestionAnswer'),
  status: attr(),
  updatedAt: attr(),
  user: fk('Person')
}

export class JoinRequestQuestionAnswer extends Model { }
JoinRequestQuestionAnswer.modelName = 'JoinRequestQuestionAnswer'
JoinRequestQuestionAnswer.fields = {
  answer: attr(),
  question: fk('Question', 'joinRequestAnswers')
}

export class Question extends Model { }
Question.modelName = 'Question'
Question.fields = {
  text: attr()
}
