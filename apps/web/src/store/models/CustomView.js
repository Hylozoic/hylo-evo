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
  collectionId: attr(),
  defaultSort: attr(),
  defaultViewMode: attr(),
  externalLink: attr(),
  isActive: attr(),
  icon: attr(),
  name: attr(),
  postTypes: attr(),
  order: attr(),
  type: attr(),

  collection: fk('Collection'),
  group: fk('Group'),
  topics: many('Topic')
}
