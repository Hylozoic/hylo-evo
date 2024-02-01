import { attr, Model } from 'redux-orm'

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
}
