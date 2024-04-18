import { attr, many, Model } from 'redux-orm'

// export class Responsibility extends Model { }
// Responsibility.modelName = 'Responsibility '
// Responsibility.fields = {
//   id: attr(),
//   title: attr(),
//   description: attr(),
//   type: attr()
// }

class CommonRole extends Model {
  toString () {
    return `CommonRole (${this.id}): ${this.name}`
  }
}

export default CommonRole

CommonRole.modelName = 'CommonRole'

CommonRole.fields = {
  id: attr(),
  emoji: attr(),
  description: attr(),
  name: attr(),
  //responsibilities: many('Responsibility')
}
