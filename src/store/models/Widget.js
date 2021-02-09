import { attr, Model } from 'redux-orm'

class Widget extends Model {
  toString () {
    return `Widget: ${this.name}`
  }
}

export default Widget

Widget.modelName = 'Widget'

Widget.fields = {
  id: attr(),
  name: attr(),
  isVisible: attr(),
  order: attr(),
}
