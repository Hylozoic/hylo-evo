import { attr, Model } from 'redux-orm'

class Skill extends Model {
  toString () {
    return `Skill: ${this.name}`
  }
}

export default Skill

Skill.modelName = 'Skill'

Skill.fields = {
  id: attr(),
  name: attr()
}
