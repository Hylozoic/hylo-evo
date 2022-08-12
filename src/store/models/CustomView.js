import { attr, fk, many, Model } from 'redux-orm'

class CustomView extends Model {
  toString () {
    return `CustomView: ${this.name}`
  }
}

export default CustomView

CustomView.modelName = 'CustomView'

CustomView.fields = {
  id: attr(),
  activePostsOnly: attr(),
  externalLink: attr(),
  isActive: attr(),
  icon: attr(),
  name: attr(),
  postTypes: attr(),
  viewMode: attr(),
  order: attr(),
  group: fk('Group'),
  topics: many('Topic')
}
