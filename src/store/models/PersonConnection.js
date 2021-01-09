import { attr, fk, Model } from 'redux-orm'

class PersonConnection extends Model {
  toString () {
    return `PersonConnection: ${this.type}`
  }
}

export default PersonConnection

PersonConnection.modelName = 'PersonConnection'
PersonConnection.fields = {
  person: fk('Person'),
  type: attr(),
  createdAt: attr(),
  updatedAt: attr()
}
