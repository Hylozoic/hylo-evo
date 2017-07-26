import { attr, Model } from 'redux-orm'

const Skill = Model.createClass({
  toString () {
    return `Skill: ${this.name}`
  }
})

export default Skill

Skill.modelName = 'Skill'

Skill.fields = {
  id: attr(),
  name: attr()
}
