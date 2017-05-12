import { attr, fk, Model } from 'redux-orm'

const PersonConnection = Model.createClass({
  toString () {
    return `PersonConnection: ${this.type}`
  }
})

export default PersonConnection

PersonConnection.modelName = 'PersonConnection'
PersonConnection.fields = {
  person: fk('Person'),
  type: attr(),
  createdAt: attr(),
  updatedAt: attr()
}
