import { attr, Model } from 'redux-orm'

const LinkPreview = Model.createClass({
  toString () {
    return `LinkPreview: ${this.title}`
  }
})

export default LinkPreview

LinkPreview.modelName = 'LinkPreview'

LinkPreview.fields = {
  id: attr()
}
