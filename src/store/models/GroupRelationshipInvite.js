import { attr, fk, many, Model } from 'redux-orm'

export const GROUP_RELATIONSHIP_TYPE = {
  ParentToChild: 0,
  ChildToParent: 1
}

class GroupRelationshipInvite extends Model {
  toString () {
    return `GroupRelationshipInvite: ${this.id}`
  }
}

export default GroupRelationshipInvite

GroupRelationshipInvite.modelName = 'GroupRelationshipInvite'
GroupRelationshipInvite.fields = {
  id: attr(),
  type: attr(),
  createdBy: fk('Person', 'groupInvitesCreated'),
  fromGroup: fk('Group', 'groupInvitesTo'),
  questionAnswers: many('GroupToGroupJoinRequestQuestionAnswer'),
  toGroup: fk('Group', 'groupInvitesFrom')
}

export class GroupToGroupJoinRequestQuestionAnswer extends Model { }
GroupToGroupJoinRequestQuestionAnswer.modelName = 'GroupToGroupJoinRequestQuestionAnswer'
GroupToGroupJoinRequestQuestionAnswer.fields = {
  answer: attr(),
  question: fk('Question', 'groupToGroupJoinRequestAnswers')
}
