import { attr, fk, Model } from 'redux-orm'

const EventInvitation = Model.createClass({
  toString () {
    return `EventInvitation: ${this.id}`
  }
}) 

EventInvitation.modelName = 'EventInvitation'
EventInvitation.fields = {
  id: attr(),
  response: attr(),
  event: fk('Post', 'eventInvitations'),
  person: fk('Person', 'eventInvitations')  
}

export default EventInvitation
