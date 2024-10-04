import { attr, Model } from 'redux-orm'

class Agreement extends Model {
  toString () {
    return `Agreement (${this.id}): ${this.title}`
  }
}

export default Agreement

Agreement.modelName = 'Agreement'

Agreement.fields = {
  id: attr(),
  accepted: attr(),
  description: attr(),
  order: attr(),
  title: attr()
}
