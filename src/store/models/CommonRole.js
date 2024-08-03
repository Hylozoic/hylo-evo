import { attr, Model } from 'redux-orm'

// TODO: for some reason this isnt working! causing error, cant figure out why
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
  name: attr()
  // responsibilities: many('Responsibility')
}

CommonRole.Roles = {
  Coordinator: 1,
  Moderator: 2,
  Host: 3
}
