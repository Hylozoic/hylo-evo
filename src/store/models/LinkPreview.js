import { attr, Model } from 'redux-orm'

class LinkPreview extends Model {
  toString () {
    return `LinkPreview: ${this.title}`
  }
}

export default LinkPreview

LinkPreview.modelName = 'LinkPreview'

LinkPreview.fields = {
  id: attr()
}
