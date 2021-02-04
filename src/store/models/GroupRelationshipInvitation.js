import { attr, fk, Model } from 'redux-orm'

class GroupRelationshipInvitation extends Model {
  toString () {
    return `GroupRelationshipInvitation: ${this.id}`
  }
}

GroupRelationshipInvitation.modelName = 'GroupRelationshipInvitation'
GroupRelationshipInvitation.fields = {
  id: attr(),
  type: attr(),
  fromGroup: fk('Group', 'invitationsTo'),
  toGroup: fk('Group', 'invitationsFrom')
}
